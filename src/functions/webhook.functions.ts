import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getAdminClient } from "@/server/supabase-admin";

// Public Google Form → Supabase webhook. UNLIKE the admin functions, this is
// reachable without the admin password (Google Apps Script can't hold it), so
// it is secured by its own shared secret (FORM_WEBHOOK_SECRET) instead. It is
// invoked from the API route at src/routes/api/form-webhook.ts.
//
// It mirrors the old in-app submitRegistration: decide accepted vs waitlisted
// from the live count against the 170 cap, then insert into the matching table.

const HACKER_CAP = 170;

const webhookSchema = z.object({
  secret: z.string(),
  first_name: z.string().trim().min(1).max(80),
  last_name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(255),
});

export const formSubmissionWebhook = createServerFn({ method: "POST" })
  .inputValidator((p: unknown) => webhookSchema.parse(p))
  .handler(
    async ({
      data,
    }): Promise<{ ok: boolean; status?: "accepted" | "waitlisted"; error?: string }> => {
      const expected = process.env.FORM_WEBHOOK_SECRET;
      if (!expected || data.secret !== expected) {
        return { ok: false, error: "Unauthorized" };
      }

      const supabase = getAdminClient();
      const email = data.email; // already trimmed + lowercased by the schema

      // Block duplicates across both tables (email is stored lowercased, so an
      // ilike comparison also catches any manually-entered mixed-case rows).
      const [existingReg, existingWait] = await Promise.all([
        supabase.from("registrations").select("id").ilike("email", email).maybeSingle(),
        supabase.from("waitlist").select("id").ilike("email", email).maybeSingle(),
      ]);
      if (existingReg.data || existingWait.data) {
        return { ok: false, error: "Already registered" };
      }

      // Capacity is measured by accepted registrations against the cap.
      const { count, error: countErr } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true });
      if (countErr) return { ok: false, error: countErr.message };

      const status: "accepted" | "waitlisted" =
        (count ?? 0) >= HACKER_CAP ? "waitlisted" : "accepted";

      // NOT NULL text columns the Google Form doesn't capture are inserted as
      // empty strings (same pattern as createRegistration in admin.functions.ts);
      // user_id stays null so the hacker claims the row by email when they first
      // open their dashboard. The waitlist table has no `status` column —
      // membership in it *is* the waitlisted state — so status is only set on
      // registrations, exactly like the old submitRegistration.
      const row = {
        first_name: data.first_name,
        last_name: data.last_name,
        email,
        phone: "",
        school: "",
        grad_year: "",
        exp_level: "",
        dietary: "",
        tshirt: "",
        parent_name: "",
        parent_email: "",
        parent_phone: "",
        emergency_contact: "",
        team_name: null,
        user_id: null,
      };

      if (status === "waitlisted") {
        const { error } = await supabase.from("waitlist").insert(row);
        if (error) return { ok: false, error: error.message };
      } else {
        const { error } = await supabase.from("registrations").insert({ ...row, status });
        if (error) return { ok: false, error: error.message };
      }

      return { ok: true, status };
    },
  );
