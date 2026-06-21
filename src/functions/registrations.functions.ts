import { createServerFn } from "@tanstack/react-start";
import { registrationSchema, type RegistrationInput, HACKER_CAP } from "@/lib/registration-schema";
import { getAdminClient } from "@/server/supabase-admin";
import { sendRegistrationConfirmation } from "@/server/email";

// Server-side registration. Runs with the service-role key (bypasses RLS) so it
// can read the live count, insert the row, stamp user_id, and fire a Resend
// confirmation — none of which the anonymous browser client can do safely.

export type SubmitResult =
  | { ok: true; status: "accepted" | "waitlisted"; name: string }
  | { ok: false; error: string };

export type UserRegistration = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  school: string;
  status: "accepted" | "waitlisted";
  team_name: string | null;
  confirmed: boolean;
  devpost_url: string | null;
};

function parseTeammates(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 3);
}

function buildRow(data: RegistrationInput, userId: string | null) {
  return {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email.toLowerCase(),
    phone: data.phone,
    school: data.school,
    grad_year: data.grad_year,
    exp_level: data.exp_level,
    dietary: data.dietary,
    tshirt: data.tshirt,
    idea: data.idea || null,
    github: data.github || null,
    linkedin: data.linkedin || null,
    parent_name: data.parent_name,
    parent_email: data.parent_email.toLowerCase(),
    parent_phone: data.parent_phone,
    emergency_contact: data.emergency_contact,
    team_name: data.team_name || null,
    teammate_emails: parseTeammates(data.teammate_emails),
    code_of_conduct: data.code_of_conduct,
    photo_release: data.photo_release,
    parent_signature: data.parent_signature,
    user_id: userId,
  };
}

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((payload: { input: RegistrationInput; userId?: string | null }) => ({
    input: registrationSchema.parse(payload.input),
    userId: payload.userId ?? null,
  }))
  .handler(async ({ data }): Promise<SubmitResult> => {
    const supabase = getAdminClient();
    const { input, userId } = data;

    // Block duplicate signups by email across both tables (email is lowercased
    // on insert, so compare against the lowercased input).
    const email = input.email.toLowerCase();
    const [existingReg, existingWait] = await Promise.all([
      supabase.from("registrations").select("id").eq("email", email).maybeSingle(),
      supabase.from("waitlist").select("id").eq("email", email).maybeSingle(),
    ]);
    if (existingReg.data || existingWait.data) {
      return {
        ok: false,
        error:
          "This email is already registered for Dublin Hacx. Check your inbox, or contact us if you think this is a mistake.",
      };
    }

    const { count, error: countErr } = await supabase
      .from("registrations")
      .select("id", { count: "exact", head: true });
    if (countErr) {
      console.error("count error", countErr);
      return { ok: false, error: "Could not check capacity. Please try again." };
    }

    const row = buildRow(input, userId);
    const status: "accepted" | "waitlisted" = (count ?? 0) >= HACKER_CAP ? "waitlisted" : "accepted";

    if (status === "waitlisted") {
      const { error } = await supabase.from("waitlist").insert(row);
      if (error) {
        console.error("waitlist insert error", error);
        return { ok: false, error: "Could not save your waitlist entry." };
      }
    } else {
      const { error } = await supabase.from("registrations").insert({ ...row, status });
      if (error) {
        console.error("registration insert error", error);
        return { ok: false, error: "Could not save your registration." };
      }
    }

    // Email is best-effort: a delivery failure must not fail the registration.
    try {
      await sendRegistrationConfirmation({
        to: row.email,
        firstName: input.first_name,
        status,
      });
    } catch (err) {
      console.error("confirmation email failed", err);
    }

    return { ok: true, status, name: input.first_name };
  });

// Returns the signed-in hacker's registration. Rows are now created manually by
// an organizer (matched to the hacker by email), so the row usually exists with
// the hacker's email but no user_id — whether it was added before or after the
// hacker created their account. Resolution order:
//   (a) by user_id, if this account is already linked to a row, then
//   (b) by email (case-insensitive) against an as-yet-unclaimed row, which we
//       then backfill with user_id so future lookups hit case (a) directly.
export const getUserRegistration = createServerFn({ method: "POST" })
  .inputValidator((payload: { userId: string; email: string }) => ({
    userId: payload.userId,
    email: payload.email.toLowerCase(),
  }))
  .handler(async ({ data }): Promise<UserRegistration | null> => {
    const supabase = getAdminClient();
    const cols = "id, first_name, last_name, email, school, status, team_name, confirmed, devpost_url";

    // (a) Already linked to this account.
    const { data: byUser } = await supabase
      .from("registrations")
      .select(cols)
      .eq("user_id", data.userId)
      .maybeSingle();
    if (byUser) return byUser as UserRegistration;

    // (b) Not linked yet — match the organizer-created row by email. `ilike`
    // (not `eq`) so a manually-typed row with different casing still matches.
    // Restrict to rows with no user_id so we never claim someone else's row.
    const { data: byEmail } = await supabase
      .from("registrations")
      .select(cols)
      .ilike("email", data.email)
      .is("user_id", null)
      .maybeSingle();
    if (!byEmail) return null;

    const row = byEmail as UserRegistration;
    // Backfill so the next lookup resolves via case (a).
    await supabase.from("registrations").update({ user_id: data.userId }).eq("id", row.id);
    return row;
  });

export const setDevpostUrl = createServerFn({ method: "POST" })
  .inputValidator((payload: { userId: string; devpostUrl: string }) => {
    const trimmed = payload.devpostUrl.trim();
    if (trimmed) {
      let host = "";
      try {
        host = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`).hostname;
      } catch {
        throw new Error("Enter a valid Devpost URL");
      }
      if (host !== "devpost.com" && !host.endsWith(".devpost.com")) {
        throw new Error("Enter a devpost.com project URL");
      }
    }
    return { userId: payload.userId, devpostUrl: trimmed };
  })
  .handler(async ({ data }): Promise<{ ok: boolean; devpost_url: string | null }> => {
    const supabase = getAdminClient();
    const value = data.devpostUrl || null;
    const { error } = await supabase
      .from("registrations")
      .update({ devpost_url: value })
      .eq("user_id", data.userId);
    if (error) {
      console.error("devpost update error", error);
      return { ok: false, devpost_url: null };
    }
    return { ok: true, devpost_url: value };
  });
