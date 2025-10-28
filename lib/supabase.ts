/**
 * lib/supabase.ts
 * Minimal supabase client singleton (browser-safe server usage via service key)
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;

// Create a dummy client if env vars are not set (for builds without Supabase)
const dummyUrl = "https://placeholder.supabase.co";
const dummyKey = "placeholder-key";

if (!url || !anon) {
  console.warn("Warning: SUPABASE_URL or SUPABASE_ANON_KEY not set - using placeholder client");
}

export const supabase = createClient(url || dummyUrl, anon || dummyKey);
