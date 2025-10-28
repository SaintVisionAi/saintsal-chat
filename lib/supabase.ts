/**
 * lib/supabase.ts
 * Minimal supabase client singleton (browser-safe server usage via service key)
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;

if (!url || !anon) {
  // If you intend to only call Supabase server-side with service_role key,
  // swap to process.env.SUPABASE_SERVICE_ROLE_KEY below.
  // We'll still throw early so it's obvious to set envs.
  console.warn("Warning: SUPABASE_URL or SUPABASE_ANON_KEY not set");
}

export const supabase = createClient(url ?? "", anon ?? "");
