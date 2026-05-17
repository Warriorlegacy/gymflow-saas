import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// Reuse Supabase client instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase URL or Service Role Key");
    }
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  }
  return supabaseInstance;
}

export async function GET(request: Request) {
  try {
    // 1. Verify Vercel Cron authorization if CRON_SECRET is configured
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Perform a fast database query to generate activity
    const supabase = getSupabaseClient();
    const startTime = Date.now();
    
    // We execute a simple select query on gyms table to keep DB active
    const { data, error } = await supabase
      .from("gyms")
      .select("gym_id")
      .limit(1);

    if (error) {
      console.error("Keep-alive database query failed:", error);
      return NextResponse.json(
        { 
          status: "error", 
          message: "Database query failed", 
          error: error.message 
        }, 
        { status: 500 }
      );
    }

    const duration = Date.now() - startTime;
    
    return NextResponse.json({
      status: "success",
      message: "Database ping completed successfully. Keep-alive active.",
      timestamp: new Date().toISOString(),
      latencyMs: duration,
      recordsFound: data?.length || 0,
    });
  } catch (error: any) {
    console.error("Keep-alive endpoint error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: error.message || "An unexpected error occurred" 
      }, 
      { status: 500 }
    );
  }
}
