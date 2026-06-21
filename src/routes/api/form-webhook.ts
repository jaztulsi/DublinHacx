import { createFileRoute } from "@tanstack/react-router";
import { formSubmissionWebhook } from "@/functions/webhook.functions";

// Public HTTP endpoint for the Google Form webhook: POST /api/form-webhook with
// a JSON body { secret, first_name, last_name, email }. TanStack Start server
// routes are file routes that expose `server.handlers` keyed by HTTP method; the
// handler runs only on the server (Vercel SSR), where it invokes the server
// function directly and returns its JSON result.
export const Route = createFileRoute("/api/form-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
        }

        try {
          const result = await formSubmissionWebhook({ data: body });
          return Response.json(result, { status: result.ok ? 200 : 400 });
        } catch (err) {
          // Validation (zod) or unexpected failures land here.
          const error = err instanceof Error ? err.message : "Bad request";
          return Response.json({ ok: false, error }, { status: 400 });
        }
      },
    },
  },
});
