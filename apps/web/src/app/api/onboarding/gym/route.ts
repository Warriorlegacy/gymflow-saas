import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      gym_name,
      slug,
      owner_name,
      owner_email,
      phone,
      city,
      state,
      subscription_tier,
    } = body;

    if (!gym_name || !slug || !owner_name || !owner_email || !phone) {
      return NextResponse.json(
        { success: false, error: "All fields required" },
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

    const { randomUUID } = await import("crypto");
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const gymId = randomUUID();
    const cleanSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    const { data: existingGym } = await supabase
      .from("gyms")
      .select("id")
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (existingGym) {
      return NextResponse.json(
        { success: false, error: "Gym slug already taken" },
        { status: 400 },
      );
    }

    const { data: gym, error: gymError } = await supabase
      .from("gyms")
      .insert({
        id: randomUUID(),
        gym_id: gymId,
        name: gym_name,
        slug: cleanSlug,
        owner_email: owner_email.toLowerCase(),
        phone: phone.replace(/\D/g, ""),
        city,
        state,
        subscription_tier: subscription_tier || "starter",
        subscription_status: "active",
      })
      .select()
      .single();

    if (gymError) {
      return NextResponse.json(
        { success: false, error: gymError.message },
        { status: 500 },
      );
    }

    const userId = randomUUID();
    const { error: ownerError } = await supabase
      .from("users")
      .insert({
        id: userId,
        gym_id: gymId,
        full_name: owner_name,
        email: owner_email.toLowerCase(),
        phone: phone.replace(/\D/g, ""),
        role: "owner",
        is_active: true,
      })
      .select()
      .single();

    if (ownerError) {
      await supabase.from("gyms").delete().eq("gym_id", gymId);
      return NextResponse.json(
        { success: false, error: ownerError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      gym: { id: gymId, slug: gym.slug, name: gym.name },
      owner: { id: userId, name: owner_name, email: owner_email },
    });
  } catch (error) {
    console.error("[API] Onboarding failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Onboarding failed",
      },
      { status: 500 },
    );
  }
}
