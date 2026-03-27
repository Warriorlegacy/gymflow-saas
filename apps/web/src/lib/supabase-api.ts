import { createClient } from "@supabase/supabase-js";

const DEMO_GYM_ID = "00000000-0000-0000-0000-000000000001";

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

export function getGymIdFromHeaders(headers: Headers): string {
  return headers.get("x-gym-id") ?? DEMO_GYM_ID;
}

export { DEMO_GYM_ID };
