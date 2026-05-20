import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { registrationSchema, type RegistrationInput, HACKER_CAP } from "@/lib/registration-schema";

function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Server credentials missing");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function parseTeammates(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 3);
}

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((input: RegistrationInput) => registrationSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getAdminClient();

    // Atomically check capacity
    const { count, error: countErr } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });

    if (countErr) {
      console.error("count error", countErr);
      return { ok: false as const, error: "Could not check capacity. Please try again." };
    }

    const teammate_emails = parseTeammates(data.teammate_emails);

    const row = {
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
      teammate_emails,
      code_of_conduct: data.code_of_conduct,
      photo_release: data.photo_release,
      parent_signature: data.parent_signature,
    };

    if ((count ?? 0) >= HACKER_CAP) {
      const { error } = await supabase.from("waitlist").insert(row);
      if (error) {
        console.error("waitlist insert error", error);
        return { ok: false as const, error: "Could not save your waitlist entry." };
      }
      return {
        ok: true as const,
        status: "waitlisted" as const,
        name: data.first_name,
      };
    }

    const { error } = await supabase
      .from("registrations")
      .insert({ ...row, status: "accepted" as const });

    if (error) {
      console.error("registration insert error", error);
      return { ok: false as const, error: "Could not save your registration." };
    }

    return { ok: true as const, status: "accepted" as const, name: data.first_name };
  });

export const getCapacity = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getAdminClient();
  const { data, error } = await supabase.rpc("get_registration_count");
  if (error) {
    console.error("capacity error", error);
    return { count: 0, cap: HACKER_CAP };
  }
  return { count: (data as number) ?? 0, cap: HACKER_CAP };
});

export const adminListRegistrations = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => {
    if (typeof input?.password !== "string") throw new Error("Bad input");
    return input;
  })
  .handler(async ({ data }) => {
    const adminPw = process.env.ADMIN_PASSWORD;
    if (!adminPw) return { ok: false as const, error: "Admin password not configured" };
    if (data.password !== adminPw) return { ok: false as const, error: "Wrong password" };

    const supabase = getAdminClient();
    const [reg, wait] = await Promise.all([
      supabase.from("registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("waitlist").select("*").order("position", { ascending: true }),
    ]);
    if (reg.error || wait.error) {
      return { ok: false as const, error: "Failed to load data" };
    }
    return {
      ok: true as const,
      registrations: reg.data ?? [],
      waitlist: wait.data ?? [],
    };
  });
