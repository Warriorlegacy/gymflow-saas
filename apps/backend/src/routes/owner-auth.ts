import type { FastifyInstance } from "fastify";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      })
    : null;

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

export async function registerGymOwnerRoutes(app: FastifyInstance) {
  if (!supabase) {
    console.error(
      "[Gym Owner Auth] Supabase not configured - auth routes will fail",
    );
  }

  // Register new gym owner with password
  app.post("/api/auth/register-owner", async (request) => {
    const body = request.body as {
      gym_name: string;
      slug: string;
      owner_name: string;
      owner_email: string;
      phone: string;
      password: string;
      city: string;
      state: string;
      subscription_tier?: "starter" | "growth" | "scale";
    };

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
      return { success: false, error: "All fields are required" };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    if (!supabase) {
      return { success: false, error: "Database not configured" };
    }

    try {
      const gymId = randomUUID();
      const userId = randomUUID();
      const passwordHash = hashPassword(password);

      // Check if gym slug already exists
      const { data: existingGym } = await supabase
        .from("gyms")
        .select("id")
        .eq("slug", slug.toLowerCase())
        .single();

      if (existingGym) {
        return { success: false, error: "Gym slug already taken" };
      }

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", owner_email.toLowerCase())
        .single();

      if (existingUser) {
        return { success: false, error: "Email already registered" };
      }

      // Create gym
      const { data: gym, error: gymError } = await supabase
        .from("gyms")
        .insert({
          id: randomUUID(),
          gym_id: gymId,
          name: gym_name,
          slug: slug.toLowerCase(),
          owner_email: owner_email.toLowerCase(),
          phone: phone.replace(/\D/g, ""),
          city,
          state,
          subscription_tier: subscription_tier || "starter",
          subscription_status: "trial",
        })
        .select("*")
        .single();

      if (gymError) throw gymError;

      // Create owner user with password hash
      const { data: owner, error: ownerError } = await supabase
        .from("users")
        .insert({
          id: userId,
          gym_id: gymId,
          full_name: owner_name,
          email: owner_email.toLowerCase(),
          phone: phone.replace(/\D/g, ""),
          role: "owner",
          is_active: true,
          password_hash: passwordHash,
        })
        .select("*")
        .single();

      if (ownerError) throw ownerError;

      const token = Buffer.from(`${userId}:${gymId}:${Date.now()}`).toString(
        "base64",
      );

      return {
        success: true,
        message: "Gym created successfully!",
        token,
        gym: { slug: gym.slug, name: gym.name },
        owner: { name: owner.full_name, email: owner.email },
      };
    } catch (error) {
      console.error("[Register Owner] Error:", error);
      return { success: false, error: "Registration failed" };
    }
  });

  // Login with email/password
  app.post("/api/auth/login-owner", async (request) => {
    const body = request.body as { email: string; password: string };
    const { email, password } = body;

    if (!email || !password) {
      return { success: false, error: "Email and password required" };
    }

    if (!supabase) {
      return { success: false, error: "Database not configured" };
    }

    try {
      const { data: owner, error } = await supabase
        .from("users")
        .select(
          "*, gyms(gym_id, name, slug, subscription_tier, subscription_status)",
        )
        .eq("email", email.toLowerCase())
        .eq("role", "owner")
        .single();

      if (error || !owner) {
        return { success: false, error: "Invalid email or password" };
      }

      // Verify password
      if (!owner.password_hash) {
        return { success: false, error: "Invalid email or password" };
      }

      if (!verifyPassword(password, owner.password_hash)) {
        return { success: false, error: "Invalid email or password" };
      }

      const token = Buffer.from(
        `${owner.id}:${owner.gym_id}:${Date.now()}`,
      ).toString("base64");

      return {
        success: true,
        token,
        gym: {
          id: owner.gyms?.gym_id,
          name: owner.gyms?.name,
          slug: owner.gyms?.slug,
          tier: owner.gyms?.subscription_tier,
          status: owner.gyms?.subscription_status,
        },
        user: {
          id: owner.id,
          name: owner.full_name,
          email: owner.email,
          role: owner.role,
        },
      };
    } catch (error) {
      console.error("[Login Owner] Error:", error);
      return { success: false, error: "Login failed" };
    }
  });
}
