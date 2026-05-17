import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getGymIdFromSession } from "./auth";

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    ""
  )
    .replace(/\\n/g, "")
    .trim();
  const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "")
    .replace(/\\n/g, "")
    .trim();

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  return supabaseInstance;
}

export async function getGymIdFromRequest(
  _headers?: Headers,
): Promise<string | null> {
  const sessionGymId = getGymIdFromSession();
  if (sessionGymId) return sessionGymId;

  const cookieStore = cookies();
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\\n/g, "").trim() || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\\n/g, "").trim() || "";

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const adminClient = getSupabaseClient();
      if (adminClient) {
        const { data: userData } = await adminClient
          .from("users")
          .select("gym_id")
          .eq("auth_user_id", user.id)
          .single();

        if (userData && (userData as { gym_id: string }).gym_id) {
          return (userData as { gym_id: string }).gym_id;
        }
      }
    }
  }

  return null;
}
