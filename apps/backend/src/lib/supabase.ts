import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

function createServiceSupabaseClient() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    console.warn("[Supabase] Missing env vars - using demo mode");
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}

export const supabaseAdmin = createServiceSupabaseClient();

