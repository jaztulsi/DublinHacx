import { supabase } from "@/integrations/supabase/client";
import { type RegistrationInput, HACKER_CAP } from "@/lib/registration-schema";
import {
  submitRegistration as submitRegistrationFn,
  getUserRegistration as getUserRegistrationFn,
  type SubmitResult,
  type UserRegistration,
} from "@/functions/registrations.functions";

// Public client-side API for the registration flow. The actual insert now runs
// in a TanStack Start server function (service-role key) so it can stamp the
// hacker's user_id and send a Resend confirmation. Capacity is still read
// through the anon-accessible SECURITY DEFINER RPC so the live count works
// without a round-trip to the server function.

export type { SubmitResult, UserRegistration };

export async function getCapacity(): Promise<{ count: number; cap: number }> {
  const { data, error } = await supabase.rpc("get_registration_count");
  if (error) {
    console.error("capacity error", error);
    return { count: 0, cap: HACKER_CAP };
  }
  return { count: (data as number) ?? 0, cap: HACKER_CAP };
}

export async function submitRegistration({
  data,
}: {
  data: RegistrationInput;
}): Promise<SubmitResult> {
  // Attach the signed-in user (if any) so the row is linked to their account.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return submitRegistrationFn({ data: { input: data, userId: user?.id ?? null } });
}

export async function getUserRegistration(): Promise<UserRegistration | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id || !user.email) return null;

  return getUserRegistrationFn({ data: { userId: user.id, email: user.email } });
}
