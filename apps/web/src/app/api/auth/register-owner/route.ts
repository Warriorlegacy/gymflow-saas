import { NextResponse } from "next/server";
import { randomUUID, scryptSync, randomBytes } from "node:crypto";
import { checkRateLimit } from "@/lib/security";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashedPassword}`;
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(`register-owner:${ip}`, 5, 60000)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const {
      gym_name,
      slug,
      owner_name,
      owner_email,
      phone,
      password,
      city,
      state,
      subscription_tier,
    } = body;

    if (
      !gym_name ||
      !slug ||
      !owner_name ||
      !owner_email ||
      !phone ||
      !password
    ) {
      return NextResponse.json(
        { success: false, error: "All fields required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be 6+ chars" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(owner_email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate phone
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number" },
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

    const gymId = randomUUID();
    const userId = randomUUID();
    const cleanSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50); // Limit slug length

    const { data: existingGym } = await supabase
      .from("gyms")
      .select("id")
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (existingGym) {
      return NextResponse.json(
        {
          success: false,
          error: "Gym slug already taken. Try a different name.",
        },
        { status: 400 },
      );
    }

    const { data: existingEmail } = await supabase
      .from("users")
      .select("id")
      .eq("email", owner_email.toLowerCase())
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 },
      );
    }

    const passwordHash = hashPassword(password);

    const { data: gym, error: gymError } = await supabase
      .from("gyms")
      .insert({
        id: randomUUID(),
        gym_id: gymId,
        name: gym_name.slice(0, 100),
        slug: cleanSlug,
        owner_email: owner_email.toLowerCase(),
        phone: cleanPhone,
        city: city?.slice(0, 50),
        state: state?.slice(0, 50),
        subscription_tier: subscription_tier || "starter",
        subscription_status: "active",
      })
      .select()
      .single();

    if (gymError) {
      return NextResponse.json(
        { success: false, error: "Failed to create gym" },
        { status: 500 },
      );
    }

    const { data: owner, error: ownerError } = await supabase
      .from("users")
      .insert({
        id: userId,
        gym_id: gymId,
        full_name: owner_name.slice(0, 100),
        email: owner_email.toLowerCase(),
        phone: cleanPhone,
        role: "owner",
        is_active: true,
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (ownerError) {
      await supabase.from("gyms").delete().eq("gym_id", gymId);
      return NextResponse.json(
        { success: false, error: "Failed to create owner account" },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Gym created successfully!",
      token: `${userId}:${gymId}:${Date.now()}`,
      gym: { id: gymId, slug: gym.slug, name: gym.name },
      owner: { name: owner.full_name, email: owner.email },
    });

    const cookieValue = JSON.stringify({
      gym_id: gymId,
      user_id: userId,
      email: owner_email.toLowerCase(),
      name: owner_name,
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
      { success: false, error: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}
