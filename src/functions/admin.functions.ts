import { createServerFn } from "@tanstack/react-start";
import { getAdminClient } from "@/server/supabase-admin";
import { sendRegistrationConfirmation } from "@/server/email";

// Admin data access. Everything here runs with the service-role key, so each
// function re-verifies the admin password server-side. The client-side gate in
// admin.tsx is only UX — this is the actual access boundary.

export const DOCUMENT_KEYS = [
  "code_of_conduct",
  "photo_release",
  "parent_signature",
  "liability_waiver",
  "medical_release",
] as const;

// Index signature uses only serializable value types so these can be returned
// straight from a server function (createServerFn validates serializability).
type AdminValue = string | number | boolean | null | string[];

export type AdminRegistration = {
  [key: string]: AdminValue;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  school: string;
  exp_level: string;
  tshirt: string;
  dietary: string;
  team_name: string | null;
  status: "accepted" | "waitlisted";
  confirmed: boolean;
  devpost_url: string | null;
  created_at: string;
};

export type AdminWaitlist = AdminRegistration & { position: number };

export type SignatureRow = {
  user_id: string;
  email: string | null;
  signed: Record<string, string>; // document_key -> signed_at
  signed_count: number;
};

export type SignatureStats = {
  fully_signed: number;
  total_signers: number;
};

function assertAdmin(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not configured");
  if (password !== expected) throw new Error("Unauthorized");
}

export const getRegistrations = createServerFn({ method: "POST" })
  .inputValidator((p: { password: string }) => p)
  .handler(async ({ data }): Promise<AdminRegistration[]> => {
    assertAdmin(data.password);
    const supabase = getAdminClient();
    const { data: rows, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (rows ?? []) as AdminRegistration[];
  });

export const getWaitlist = createServerFn({ method: "POST" })
  .inputValidator((p: { password: string }) => p)
  .handler(async ({ data }): Promise<AdminWaitlist[]> => {
    assertAdmin(data.password);
    const supabase = getAdminClient();
    const { data: rows, error } = await supabase
      .from("waitlist")
      .select("*")
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    return (rows ?? []) as AdminWaitlist[];
  });

export const getSignatures = createServerFn({ method: "POST" })
  .inputValidator((p: { password: string }) => p)
  .handler(async ({ data }): Promise<SignatureRow[]> => {
    assertAdmin(data.password);
    const supabase = getAdminClient();

    const { data: sigs, error } = await supabase
      .from("document_signatures")
      .select("user_id, document_key, signed_at");
    if (error) throw new Error(error.message);

    // Map user_id -> email via the auth admin API.
    const emails = new Map<string, string | null>();
    let page = 1;
    for (;;) {
      const { data: list, error: listErr } = await supabase.auth.admin.listUsers({
        page,
        perPage: 1000,
      });
      if (listErr) throw new Error(listErr.message);
      for (const u of list.users) emails.set(u.id, u.email ?? null);
      if (list.users.length < 1000) break;
      page += 1;
    }

    const byUser = new Map<string, SignatureRow>();
    for (const s of (sigs ?? []) as Array<{
      user_id: string;
      document_key: string;
      signed_at: string;
    }>) {
      let row = byUser.get(s.user_id);
      if (!row) {
        row = {
          user_id: s.user_id,
          email: emails.get(s.user_id) ?? null,
          signed: {},
          signed_count: 0,
        };
        byUser.set(s.user_id, row);
      }
      row.signed[s.document_key] = s.signed_at;
      row.signed_count = Object.keys(row.signed).length;
    }

    return [...byUser.values()].sort((a, b) => b.signed_count - a.signed_count);
  });

export const getSignatureStats = createServerFn({ method: "POST" })
  .inputValidator((p: { password: string }) => p)
  .handler(async ({ data }): Promise<SignatureStats> => {
    assertAdmin(data.password);
    const supabase = getAdminClient();
    const { data: sigs, error } = await supabase
      .from("document_signatures")
      .select("user_id, document_key");
    if (error) throw new Error(error.message);

    const counts = new Map<string, Set<string>>();
    for (const s of (sigs ?? []) as Array<{ user_id: string; document_key: string }>) {
      let set = counts.get(s.user_id);
      if (!set) counts.set(s.user_id, (set = new Set()));
      set.add(s.document_key);
    }

    let fully = 0;
    for (const set of counts.values()) {
      if (DOCUMENT_KEYS.every((k) => set.has(k))) fully += 1;
    }
    return { fully_signed: fully, total_signers: counts.size };
  });

export const promoteFromWaitlist = createServerFn({ method: "POST" })
  .inputValidator((p: { password: string; waitlistId: string }) => p)
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string; name?: string }> => {
    assertAdmin(data.password);
    const supabase = getAdminClient();

    const { data: entry, error: fetchErr } = await supabase
      .from("waitlist")
      .select("*")
      .eq("id", data.waitlistId)
      .maybeSingle();
    if (fetchErr) return { ok: false, error: fetchErr.message };
    if (!entry) return { ok: false, error: "Waitlist entry not found" };

    // Copy everything except waitlist-only / generated columns.
    const { id: _id, position: _position, created_at: _created, ...rest } =
      entry as Record<string, unknown>;

    const { error: insertErr } = await supabase
      .from("registrations")
      .insert({ ...rest, status: "accepted" });
    if (insertErr) return { ok: false, error: insertErr.message };

    const { error: deleteErr } = await supabase.from("waitlist").delete().eq("id", data.waitlistId);
    if (deleteErr) return { ok: false, error: deleteErr.message };

    try {
      await sendRegistrationConfirmation({
        to: String((entry as Record<string, unknown>).email).toLowerCase(),
        firstName: String((entry as Record<string, unknown>).first_name),
        status: "accepted",
      });
    } catch (err) {
      console.error("promotion email failed", err);
    }

    return { ok: true, name: String((entry as Record<string, unknown>).first_name) };
  });
