import { supabase } from "@/integrations/supabase/client";
import { registrationSchema, type RegistrationInput, HACKER_CAP } from "@/lib/registration-schema";

// Client-side registration. The Supabase RLS policies allow anonymous INSERTs
// on `registrations`/`waitlist`, and `get_registration_count()` is a
// SECURITY DEFINER function granted to `anon` — so the whole flow runs in the
// browser with the publishable (anon) key, no server required. This is what
// lets the site live on a static host like GitHub Pages.

function parseTeammates(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 3);
}

export async function getCapacity(): Promise<{ count: number; cap: number }> {
  const { data, error } = await supabase.rpc("get_registration_count");
  if (error) {
    console.error("capacity error", error);
    return { count: 0, cap: HACKER_CAP };
  }
  return { count: (data as number) ?? 0, cap: HACKER_CAP };
}

type SubmitResult =
  | { ok: true; status: "accepted" | "waitlisted"; name: string }
  | { ok: false; error: string };

export async function submitRegistration({
  data: input,
}: {
  data: RegistrationInput;
}): Promise<SubmitResult> {
  const data = registrationSchema.parse(input);

  // Count via the public SECURITY DEFINER RPC (anon can't SELECT rows directly).
  const { data: countData, error: countErr } = await supabase.rpc("get_registration_count");
  if (countErr) {
    console.error("count error", countErr);
    return { ok: false, error: "Could not check capacity. Please try again." };
  }
  const count = (countData as number) ?? 0;

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
    teammate_emails: parseTeammates(data.teammate_emails),
    code_of_conduct: data.code_of_conduct,
    photo_release: data.photo_release,
    parent_signature: data.parent_signature,
  };

  if (count >= HACKER_CAP) {
    const { error } = await supabase.from("waitlist").insert(row);
    if (error) {
      console.error("waitlist insert error", error);
      return { ok: false, error: "Could not save your waitlist entry." };
    }
    return { ok: true, status: "waitlisted", name: data.first_name };
  }

  const { error } = await supabase
    .from("registrations")
    .insert({ ...row, status: "accepted" as const });
  if (error) {
    console.error("registration insert error", error);
    return { ok: false, error: "Could not save your registration." };
  }
  return { ok: true, status: "accepted", name: data.first_name };
}
