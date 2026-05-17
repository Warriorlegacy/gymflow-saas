import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// Singleton Supabase client for reuse
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  }
  return supabaseInstance;
}

function getGymIdFromHeaders(headers: Headers): string | null {
  const headerGymId = headers.get("x-gym-id");
  if (headerGymId) return headerGymId;

  try {
    const cookieStore = cookies();
    const ownerGym = cookieStore.get("gymflow_owner_gym")?.value;
    if (ownerGym) {
      const parsed = JSON.parse(ownerGym);
      return parsed.gym_id || null;
    }
    return null;
  } catch {
    return null;
  }
}

// Cache for dashboard data (10 second TTL)
const dashboardCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 10000; // 10 seconds

export async function GET(request: Request) {
  try {
    const gymId = getGymIdFromHeaders(request.headers);

    if (!gymId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check cache
    const cached = dashboardCache.get(gymId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "private, max-age=10, stale-while-revalidate=20",
          Vary: "Cookie",
          "X-Cache": "HIT",
        },
      });
    }

    const supabase = getSupabaseClient();
    const today = new Date().toISOString().split("T")[0];

    // Execute all queries in parallel for maximum performance
    const [
      gymResult,
      membersResult,
      trainersResult,
      attendanceResult,
      subscriptionsResult,
      paymentsResult,
    ] = await Promise.all([
      supabase.from("gyms").select("gym_id, name").eq("gym_id", gymId).single(),
      supabase
        .from("members")
        .select("id, full_name, phone, status, primary_goal, created_at")
        .eq("gym_id", gymId)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("trainers").select("id").eq("gym_id", gymId),
      supabase
        .from("attendance")
        .select("id, member_id, attended_on")
        .eq("gym_id", gymId)
        .eq("attended_on", today),
      supabase
        .from("subscriptions")
        .select("id, member_id, amount, end_date, billing_status")
        .eq("gym_id", gymId)
        .eq("billing_status", "active"),
      supabase
        .from("payments")
        .select("id, amount, paid_on, method")
        .eq("gym_id", gymId)
        .order("paid_on", { ascending: false })
        .limit(5),
    ]);

    const gym = gymResult.data;
    const members = membersResult.data || [];
    const trainers = trainersResult.data || [];
    const todayAttendance = attendanceResult.data || [];
    const subscriptions = subscriptionsResult.data || [];
    const recentPayments = paymentsResult.data || [];

    // Calculate metrics efficiently in single pass
    const totalMembers = members.length;
    let activeMembers = 0;
    for (let i = 0; i < members.length; i++) {
      if ((members[i] as { status: string }).status === "active")
        activeMembers++;
    }

    // Single pass through subscriptions for both metrics
    let monthlyRevenue = 0;
    let expiringSoon = 0;
    const now = Date.now();

    for (const s of subscriptions) {
      monthlyRevenue += Number((s as { amount: number }).amount) || 0;
      const endDate = new Date((s as { end_date: string }).end_date).getTime();
      const daysUntilExpiry = Math.ceil(
        (endDate - now) / (1000 * 60 * 60 * 24),
      );
      if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
        expiringSoon++;
      }
    }

    const responseData = {
      gym: gym || { name: "Unknown Gym" },
      metrics: {
        totalMembers,
        activeMembers,
        monthlyRevenue,
        todayAttendance: todayAttendance.length,
        expiringSubscriptions: expiringSoon,
        trainers: trainers.length,
      },
      recentMembers: members.slice(0, 5).map((m: Record<string, unknown>) => ({
        id: m.id,
        full_name: m.full_name,
        phone: m.phone,
        status: m.status,
        primary_goal: m.primary_goal,
      })),
      expiringMembers: subscriptions
        .filter((s: Record<string, unknown>) => {
          const endDate = new Date(s.end_date as string).getTime();
          const daysUntilExpiry = Math.ceil(
            (endDate - now) / (1000 * 60 * 60 * 24),
          );
          return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
        })
        .slice(0, 10)
        .map((s: Record<string, unknown>) => ({
          id: s.id,
          full_name: "Member",
          end_date: s.end_date,
          phone: "",
        })),
      recentPayments: recentPayments.map((p: Record<string, unknown>) => ({
        id: p.id,
        member: "Member",
        amount: p.amount,
        paid_on: p.paid_on,
        method: p.method,
      })),
    };

    // Update cache
    dashboardCache.set(gymId, { data: responseData, timestamp: Date.now() });

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "private, max-age=10, stale-while-revalidate=20",
        Vary: "Cookie",
        "X-Cache": "MISS",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch dashboard" },
      { status: 500 },
    );
  }
}
