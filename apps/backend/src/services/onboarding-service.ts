import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "../lib/supabase";

export async function createGymOnboarding(payload: {
  gym_name: string;
  slug: string;
  owner_name: string;
  owner_email: string;
  phone: string;
  city: string;
  state: string;
  subscription_tier?: "starter" | "growth" | "scale";
}) {
  const gymId = randomUUID();

  const gymRecord = {
    id: randomUUID(),
    gym_id: gymId,
    name: payload.gym_name,
    slug: payload.slug,
    owner_email: payload.owner_email,
    phone: payload.phone,
    city: payload.city,
    state: payload.state,
    subscription_tier: payload.subscription_tier ?? "starter",
    subscription_status: "trial"
  };

  const ownerRecord = {
    id: randomUUID(),
    gym_id: gymId,
    full_name: payload.owner_name,
    email: payload.owner_email,
    phone: payload.phone,
    role: "owner",
    is_active: true
  };

  if (!supabaseAdmin) {
    return {
      success: true,
      mode: "demo",
      gym: gymRecord,
      owner: ownerRecord
    };
  }

  const { data: gym, error: gymError } = await supabaseAdmin.from("gyms").insert(gymRecord).select("*").single();
  if (gymError) {
    throw gymError;
  }

  const { data: owner, error: ownerError } = await supabaseAdmin.from("users").insert(ownerRecord).select("*").single();
  if (ownerError) {
    throw ownerError;
  }

  return {
    success: true,
    mode: "supabase",
    gym,
    owner
  };
}
