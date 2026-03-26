import { createBrowserSupabaseClient } from "./supabase";

export async function sendMagicLink(email: string) {
  const client = createBrowserSupabaseClient();
  if (!client) {
    return {
      ok: false,
      message: "Supabase env vars are missing. Demo mode is still available."
    };
  }

  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`
    }
  });

  if (error) {
    return {
      ok: false,
      message: error.message
    };
  }

  return {
    ok: true,
    message: "Magic link sent. Check your inbox to continue."
  };
}

export async function signOutBrowser() {
  const client = createBrowserSupabaseClient();
  if (!client) {
    return;
  }

  await client.auth.signOut();
}

