"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@gymflow/services";

export function AuthDetector() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;

    // Supabase handles the hash/fragment exchange automatically on instantiation.
    // If we land with a hash, we want to know when the session is actually set.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        // If we just signed in and there's a hash in the URL, this was likely a magic link entry.
        // We need to refresh the server components to see the real data.
        if (typeof window !== "undefined" && window.location.hash) {
           // We might want to remove the hash to keep the URL clean
           window.history.replaceState(null, "", window.location.pathname);
           router.refresh();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
