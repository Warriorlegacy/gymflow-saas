import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase-api";
import { onboardingGymSchema } from "@gymflow/lib";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = onboardingGymSchema.parse(body);

    const supabase = getSupabaseClient();
    const gymId = crypto.randomUUID();

    const gymRecord = {
      id: crypto.randomUUID(),
      gym_id: gymId,
      name: payload.gym_name,
      slug: payload.slug,
      owner_email: payload.owner_email,
      phone: payload.phone,
      city: payload.city,
      state: payload.state,
      subscription_tier: payload.subscription_tier ?? "starter",
      subscription_status: "trial",
    };

    const ownerRecord = {
      id: crypto.randomUUID(),
      gym_id: gymId,
      full_name: payload.owner_name,
      email: payload.owner_email,
      phone: payload.phone,
      role: "owner",
      is_active: true,
    };

    if (!supabase) {
      return NextResponse.json({
        success: true,
        mode: "demo",
        gym: gymRecord,
        owner: ownerRecord,
      });
    }

    const { data: gym, error: gymError } = await supabase
      .from("gyms")
      .insert(gymRecord)
      .select("*")
      .single();

    if (gymError) {
      throw gymError;
    }

    const { data: owner, error: ownerError } = await supabase
      .from("users")
      .insert(ownerRecord)
      .select("*")
      .single();

    if (ownerError) {
      throw ownerError;
    }

    return NextResponse.json({
      success: true,
      mode: "supabase",
      gym,
      owner,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Invalid onboarding request",
      },
      { status: 400 }
    );
  }
}
