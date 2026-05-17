import { NextResponse } from "next/server";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { checkRateLimit } from "@/lib/security";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// Singleton Supabase client
let supabaseInstance: ReturnType<
  typeof import("@supabase/supabase-js").createClient
> | null = null;

async function getSupabase() {
  if (!supabaseInstance) {
    const { createClient } = await import("@supabase/supabase-js");
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  }
  return supabaseInstance;
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashedPassword}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    const hashedPassword = scryptSync(password, salt, 64);
    return timingSafeEqual(Buffer.from(key, "hex"), hashedPassword);
  } catch {
    return false;
  }
}

export async function POST(
  request: Request,
  { params }: { params: { action: string } },
) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 },
    );
  }

  const body = await request.json();
  const supabase = await getSupabase();

  if (params.action === "register") {
    const { phone, password, name, gymSlug, email } = body;
    if (!phone || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Phone, password, and name are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 },
      );
    }

    let gymId: string | null = null;

    if (gymSlug) {
      const { data: gym } = await supabase
        .from("gyms")
        .select("gym_id")
        .eq("slug", gymSlug)
        .single();
      gymId = (gym as { gym_id: string } | null)?.gym_id || null;
    }

    if (!gymId) {
      const { data: defaultGym } = await supabase
        .from("gyms")
        .select("gym_id")
        .limit(1)
        .single();
      gymId = (defaultGym as { gym_id: string } | null)?.gym_id || null;
    }

    if (!gymId) {
      return NextResponse.json(
        { success: false, error: "No gym found" },
        { status: 400 },
      );
    }

    const passwordHash = hashPassword(password);

    const { data: existing } = await supabase
      .from("members")
      .select("id")
      .eq("phone", cleanPhone)
      .eq("gym_id", gymId)
      .maybeSingle();

    if (existing) {
      await (supabase as any)
        .from("members")
        .update({
          password_hash: passwordHash,
          full_name: name,
          email: email || null,
        })
        .eq("id", (existing as { id: string }).id)
        .eq("gym_id", gymId);
    } else {
      await (supabase as any).from("members").insert({
        full_name: name,
        phone: cleanPhone,
        email: email || null,
        password_hash: passwordHash,
        gym_id: gymId,
        status: "active",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful",
    });
  }

  if (params.action === "login") {
    // Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const { phone, password } = body;

    if (!checkRateLimit(`member-login:${ip}`, 10, 60000)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: "Phone and password are required" },
        { status: 400 },
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");

    const { data: member } = await supabase
      .from("members")
      .select("id, full_name, phone, password_hash, gym_id, status")
      .eq("phone", cleanPhone)
      .single();

    const memberData = member as {
      id: string;
      full_name: string;
      phone: string;
      password_hash: string | null;
      gym_id: string;
      status: string;
    } | null;

    if (!memberData || !memberData.password_hash) {
      return NextResponse.json(
        { success: false, error: "Invalid phone or password" },
        { status: 401 },
      );
    }

    if (!verifyPassword(password, memberData.password_hash)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone or password" },
        { status: 401 },
      );
    }

    const token = Buffer.from(
      `${memberData.id}:${memberData.gym_id}:${Date.now()}`,
    ).toString("base64");

    return NextResponse.json({
      success: true,
      token,
      member: {
        id: memberData.id,
        name: memberData.full_name,
        phone: memberData.phone,
        gymId: memberData.gym_id,
      },
    });
  }

  if (params.action === "checkin") {
    const { memberId } = body;
    if (!memberId) {
      return NextResponse.json(
        { success: false, error: "Member ID is required" },
        { status: 400 },
      );
    }

    // Validate UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(memberId)) {
      return NextResponse.json(
        { success: false, error: "Invalid member ID" },
        { status: 400 },
      );
    }

    const today = new Date().toISOString().split("T")[0];

    const [memberResult, attendanceResult] = await Promise.all([
      supabase.from("members").select("gym_id").eq("id", memberId).single(),
      supabase
        .from("attendance")
        .select("id")
        .eq("member_id", memberId)
        .eq("attended_on", today)
        .maybeSingle(),
    ]);

    const memberInfo = memberResult.data as { gym_id: string } | null;

    if (!memberInfo) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 },
      );
    }

    if (attendanceResult.data) {
      return NextResponse.json(
        { success: false, error: "Already checked in today" },
        { status: 400 },
      );
    }

    await (supabase.from("attendance") as any).insert({
      gym_id: memberInfo.gym_id,
      member_id: memberId,
      attended_on: today,
      check_in_time: new Date().toISOString(),
      source: "mobile",
    });

    return NextResponse.json({
      success: true,
      message: "Check-in successful!",
    });
  }

  if (params.action === "reset-password") {
    const { phone, newPassword } = body;
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 },
      );
    }
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const { data: member } = await supabase
      .from("members")
      .select("id, full_name, gym_id")
      .eq("phone", cleanPhone)
      .single();

    const memberData = member as {
      id: string;
      full_name: string;
      gym_id: string;
    } | null;

    if (!memberData) {
      return NextResponse.json(
        { success: false, error: "Member not found with this phone number." },
        { status: 404 },
      );
    }

    const passwordHash = hashPassword(newPassword);
    const { error: updateError } = await (supabase as any)
      .from("members")
      .update({ password_hash: passwordHash })
      .eq("id", memberData.id)
      .eq("gym_id", memberData.gym_id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: "Failed to update password" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  }

  return NextResponse.json(
    { success: false, error: "Unknown action" },
    { status: 400 },
  );
}

// Cache for member dashboard data
const dashboardCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 10000; // 10 seconds

export async function GET(request: Request) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const supabase = await getSupabase();

  try {
    const token = Buffer.from(
      authHeader.replace("Bearer ", ""),
      "base64",
    ).toString();
    const [memberId, gymId] = token.split(":");

    if (!memberId || !gymId) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 },
      );
    }

    // Check cache
    const cacheKey = `${memberId}:${gymId}`;
    const cached = dashboardCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          "Cache-Control": "private, max-age=10, stale-while-revalidate=20",
          "X-Cache": "HIT",
        },
      });
    }

    // Execute all queries in parallel
    const [
      memberResult,
      subscriptionResult,
      monthlyAttendanceResult,
      todayAttendanceResult,
    ] = await Promise.all([
      supabase
        .from("members")
        .select("full_name, phone, email, status, gym_id")
        .eq("id", memberId)
        .eq("gym_id", gymId)
        .single(),
      supabase
        .from("subscriptions")
        .select("billing_status, end_date, plans(name)")
        .eq("member_id", memberId)
        .eq("gym_id", gymId)
        .eq("billing_status", "active")
        .maybeSingle(),
      (() => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        return supabase
          .from("attendance")
          .select("id", { count: "exact", head: true })
          .eq("member_id", memberId)
          .eq("gym_id", gymId)
          .gte("attended_on", startOfMonth.toISOString().split("T")[0]);
      })(),
      supabase
        .from("attendance")
        .select("id", { count: "exact", head: true })
        .eq("member_id", memberId)
        .eq("gym_id", gymId)
        .eq("attended_on", new Date().toISOString().split("T")[0]),
    ]);

    const memberData = memberResult.data as {
      full_name: string;
      phone: string;
      email: string | null;
      status: string;
      gym_id: string;
    } | null;

    if (!memberData) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 },
      );
    }

    const subscription = subscriptionResult.data as {
      billing_status: string;
      end_date: string;
      plans: { name: string } | null;
    } | null;

    const monthlyAttendance = monthlyAttendanceResult.count || 0;
    const todayAttendance = todayAttendanceResult.count || 0;

    const responseData = {
      success: true,
      member: {
        name: memberData.full_name,
        phone: memberData.phone,
        email: memberData.email,
        status: memberData.status,
      },
      subscription: subscription
        ? {
            planName: subscription.plans?.name || "Unknown",
            status: subscription.billing_status,
            endDate: subscription.end_date,
            daysLeft: Math.ceil(
              (new Date(subscription.end_date).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24),
            ),
          }
        : null,
      attendance: {
        todayCheckedIn: todayAttendance > 0,
        totalThisMonth: monthlyAttendance,
        streak: 0,
      },
    };

    // Update cache
    dashboardCache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "private, max-age=10, stale-while-revalidate=20",
        "X-Cache": "MISS",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard" },
      { status: 500 },
    );
  }
}
