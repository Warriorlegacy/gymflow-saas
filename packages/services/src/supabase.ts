import { createClient } from "@supabase/supabase-js";
import { serviceEnv } from "./config";

export function createBrowserSupabaseClient() {
  if (!serviceEnv.supabaseUrl || !serviceEnv.supabaseAnonKey) {
    return null;
  }

  return createClient(serviceEnv.supabaseUrl, serviceEnv.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
}

export function createServiceSupabaseClient() {
  if (!serviceEnv.supabaseUrl || !serviceEnv.supabaseServiceRoleKey) {
    return null;
  }

  return createClient(serviceEnv.supabaseUrl, serviceEnv.supabaseServiceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}

