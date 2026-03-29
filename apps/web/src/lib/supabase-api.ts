import { createClient } from "@supabase/supabase-js";
import { DEMO_GYM_ID } from "@gymflow/lib";
import { getGymIdFromSession } from "./auth";

export function getSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "";

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

export function getGymIdFromRequest(_headers?: Headers): string {
  return getGymIdFromSession() ?? DEMO_GYM_ID;
}

export { DEMO_GYM_ID };
