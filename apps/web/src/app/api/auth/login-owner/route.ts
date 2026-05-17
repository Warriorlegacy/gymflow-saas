import { NextResponse } from "next/server";
import { scryptSync, timingSafeEqual } from "node:crypto";
import { checkRateLimit } from "@/lib/security";

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const hashedPassword = scryptSync(password, salt, 64);
    return timingSafeEqual(Buffer.from(key, "hex"), hashedPassword);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(`login-owner:${ip}`, 10, 60000)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      );
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data: owner, error } = await supabase
      .from("users")
      .select(
        "id, gym_id, full_name, email, role, password_hash, gyms(gym_id, name, slug, subscription_tier, subscription_status)",
      )
      .eq("email", email.toLowerCase())
      .eq("role", "owner")
      .single();

    if (error || !owner) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password
    if (!owner.password_hash) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    if (!verifyPassword(password, owner.password_hash)) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // gyms is returned as an array by Supabase when using foreign key select
    const gymData = Array.isArray(owner.gyms) ? owner.gyms[0] : owner.gyms;

    const response = NextResponse.json({
      success: true,
      token: `${owner.id}:${owner.gym_id}:${Date.now()}`,
      gym: {
        id: gymData?.gym_id,
        name: gymData?.name,
        slug: gymData?.slug,
        tier: gymData?.subscription_tier,
        status: gymData?.subscription_status,
      },
      user: {
        id: owner.id,
        name: owner.full_name,
        email: owner.email,
        role: owner.role,
      },
    });

    const cookieValue = JSON.stringify({
      gym_id: owner.gym_id,
      user_id: owner.id,
      email: owner.email,
      name: owner.full_name,
    });

    response.cookies.set("gymflow_owner_gym", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 },
    );
  }
}
