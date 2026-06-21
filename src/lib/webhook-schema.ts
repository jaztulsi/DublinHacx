import { z } from "zod";

// Shared, server-function-free webhook validation. This file MUST NOT import or
// define any createServerFn — the public API route (src/routes/api/form-webhook.ts)
// imports from here so it never transitively pulls in a server function's RPC
// chunk (which broke production with "Server function info not found for [hash]").
// Both this file and src/functions/webhook.functions.ts source these from here.

export const HACKER_CAP = 170;

export const webhookSchema = z.object({
  secret: z.string(),
  first_name: z.string().trim().min(1).max(80),
  last_name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(255),
});

export type WebhookInput = z.infer<typeof webhookSchema>;
