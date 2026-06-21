import { createFileRoute } from "@tanstack/react-router";
import { getAdminClient } from "@/server/supabase-admin";
import { webhookSchema, HACKER_CAP } from "@/functions/webhook.functions";

// Public HTTP endpoint for the Google Form webhook: POST /api/form-webhook with
// a JSON body { secret, first_name, last_name, email }.
//
// The business logic is inlined here (rather than calling the createServerFn
// `formSubmissionWebhook`) on purpose: createServerFn-wrapped functions are only
// reliably invokable through their build-time RPC registration — calling one as
// a plain function from inside another server route handler fails in production
// with "Server function info not found for [hash]". The validation schema and
// cap are imported from webhook.functions.ts so there's a single source of truth.
export const Route = createFileRoute("/api/form-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Parse the JSON body.
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
        }

        // Validate shape with the shared schema (trims + lowercases email).
        const parsed = webhookSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
        }
        const data = parsed.data;

        // Authenticate via the shared secret.
        const expected = process.env.FORM_WEBHOOK_SECRET;
        if (!expected || data.secret !== expected) {
          return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
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
          return Response.json({ ok: false, error: "Already registered" }, { status: 409 });
        }

        // Capacity is measured by accepted registrations against the cap.
        const { count, error: countErr } = await supabase
          .from("registrations")
          .select("id", { count: "exact", head: true });
        if (countErr) {
          return Response.json({ ok: false, error: countErr.message }, { status: 500 });
        }

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
          if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
        } else {
          const { error } = await supabase.from("registrations").insert({ ...row, status });
          if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
        }

        return Response.json({ ok: true, status }, { status: 200 });
      },
    },
  },
});
