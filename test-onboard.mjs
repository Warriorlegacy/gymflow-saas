import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const gymId = crypto.randomUUID();

const payload = {
  gym_name: "Test Gym",
  slug: "test-gym-" + Date.now(),
  owner_name: "Test User",
  owner_email: "test@example.com",
  phone: "1234567890",
  city: "Test City",
  state: "Test State",
  subscription_tier: "starter"
};

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

async function test() {
  const { data: gym, error: gymError } = await supabase
    .from("gyms")
    .insert(gymRecord)
    .select("*")
    .single();

  if (gymError) {
    console.error("GYM ERROR:", gymError);
    return;
  }

  const { data: owner, error: ownerError } = await supabase
    .from("users")
    .insert(ownerRecord)
    .select("*")
    .single();

  if (ownerError) {
    console.error("OWNER ERROR:", ownerError);
    return;
  }

  console.log("SUCCESS!", { gym, owner });
}

test();
