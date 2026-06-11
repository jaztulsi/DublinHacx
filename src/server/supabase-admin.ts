// Service-role Supabase client. SERVER ONLY — this bypasses Row Level Security,
// so it must never be imported into a client component. It is only ever used
// inside the `.handler()` of server functions in `src/functions/*`, whose bodies
// the TanStack Start compiler strips out of the browser bundle.
//
// Intentionally untyped (no `<Database>` generic) so it can read/write the
// `user_id` and `devpost_url` columns added by later migrations without us
// having to touch the generated `integrations/supabase/types.ts`.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// `SupabaseClient<any>` resolves the schema to `any`, so reads/writes accept the
// user_id / devpost_url columns that aren't in the generated types.
type AdminClient = SupabaseClient<any>;

let _admin: AdminClient | undefined;

export function getAdminClient(): AdminClient {
  if (_admin) return _admin;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    const missing = [
      ...(!url ? ["SUPABASE_URL"] : []),
      ...(!serviceKey ? ["SUPABASE_SERVICE_ROLE_KEY"] : []),
    ];
    throw new Error(`Missing server env var(s): ${missing.join(", ")}`);
  }

  _admin = createClient<any>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}
