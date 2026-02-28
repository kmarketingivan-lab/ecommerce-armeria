// ⚠️ DANGER: This client uses the SERVICE ROLE key and BYPASSES RLS.
// ⚠️ NEVER import this file in client components or expose it to the browser.
// ⚠️ Use ONLY in server-side code for admin operations (audit logs, migrations, etc.)

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Creates a Supabase admin client that bypasses RLS.
 * ONLY for server-side operations that require elevated privileges.
 * @returns Typed Supabase admin client with service role
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
