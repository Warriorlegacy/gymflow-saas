import type { FastifyInstance } from "fastify";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_JWT_SECRET ||
  "";
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

function generateVerificationCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function registerMemberRoutes(app: FastifyInstance) {
  if (!supabase) {
    console.error(
      "[Member Auth] Supabase not configured - member routes will fail",
    );
  }

  app.post("/api/member/register", async (request) => {
    const body = request.body as {
      phone: string;
      password: string;
      name: string;
      gymSlug?: string;
      email?: string;
    };

    const { phone, password, name, gymSlug, email } = body;

    if (!phone || !password || !name) {
      return {
        success: false,
        error: "Phone, password, and name are required",
      };
    }

    if (!supabase) {
      return { success: false, error: "Database not configured" };
    }

    const cleanPhone = phone.replace(/\D/g, "");

    try {
      let gymId: string | null = null;

      if (gymSlug) {
        const { data: gym } = await supabase
          .from("gyms")
          .select("gym_id")
          .eq("slug", gymSlug)
          .single();
        gymId = gym?.gym_id || null;
      }

      if (!gymId) {
        return { success: false, error: "Gym not found" };
      }

      const verificationCode = generateVerificationCode();
      const passwordHash = hashPassword(password);

      const { data: existing } = await supabase
        .from("members")
        .select("id")
        .eq("phone", cleanPhone)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("members")
          .update({
            password_hash: passwordHash,
            full_name: name,
            email: email || null,
            is_verified: false,
            verification_code: verificationCode,
            verification_expires_at: new Date(
              Date.now() + 10 * 60 * 1000,
            ).toISOString(),
            gym_id: gymId,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("members").insert({
          full_name: name,
          phone: cleanPhone,
          email: email || null,
          password_hash: passwordHash,
          is_verified: false,
          verification_code: verificationCode,
          verification_expires_at: new Date(
            Date.now() + 10 * 60 * 1000,
          ).toISOString(),
          gym_id: gymId,
          status: "active",
        });
      }

      return {
        success: true,
        message: "Registration successful. Please verify your phone number.",
      };
    } catch (error) {
      console.error("[Member Register] Error:", error);
      return { success: false, error: "Registration failed" };
    }
  });

  app.post("/api/member/login", async (request) => {
    const body = request.body as { phone: string; password: string };
    const { phone, password } = body;

    if (!phone || !password) {
      return { success: false, error: "Phone and password are required" };
    }

    if (!supabase) {
      return { success: false, error: "Database not configured" };
    }

    const cleanPhone = phone.replace(/\D/g, "");

    try {
      const { data: member } = await supabase
        .from("members")
        .select("id, full_name, phone, password_hash, gym_id, status")
        .eq("phone", cleanPhone)
        .single();

      if (!member) {
        return { success: false, error: "Invalid phone or password" };
      }

      if (!member.password_hash) {
        return { success: false, error: "Please reset your password" };
      }

      if (!verifyPassword(password, member.password_hash)) {
        return { success: false, error: "Invalid phone or password" };
      }

      if (member.status !== "active") {
        return { success: false, error: "Your membership is not active" };
      }

      const token = Buffer.from(
        `${member.id}:${member.gym_id}:${Date.now()}`,
      ).toString("base64");

      return {
        success: true,
        token,
        member: {
          id: member.id,
          name: member.full_name,
          phone: member.phone,
          gymId: member.gym_id,
        },
      };
    } catch (error) {
      console.error("[Member Login] Error:", error);
      return { success: false, error: "Login failed" };
    }
  });

  app.post("/api/member/checkin", async (request) => {
    const body = request.body as { memberId: string };
    const { memberId } = body;

    if (!memberId) {
      return { success: false, error: "Member ID is required" };
    }

    if (!supabase) {
      return { success: false, error: "Database not configured" };
    }

    try {
      const today = new Date().toISOString().split("T")[0];

      const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("member_id", memberId)
        .eq("attended_on", today)
        .single();

      if (existing) {
        return { success: false, error: "Already checked in today" };
      }

      const { data: member } = await supabase
        .from("members")
        .select("gym_id")
        .eq("id", memberId)
        .single();

      if (!member) {
        return { success: false, error: "Member not found" };
      }

      await supabase.from("attendance").insert({
        gym_id: member.gym_id,
        member_id: memberId,
        attended_on: today,
        check_in_time: new Date().toISOString(),
        source: "mobile",
      });

      return { success: true, message: "Check-in successful!" };
    } catch (error) {
      console.error("[Member Checkin] Error:", error);
      return { success: false, error: "Check-in failed" };
    }
  });

  app.get("/api/member/dashboard", async (request) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return { success: false, error: "Unauthorized" };
    }

    if (!supabase) {
      return { success: false, error: "Database not configured" };
    }

    try {
      const token = Buffer.from(
        authHeader.replace("Bearer ", ""),
        "base64",
      ).toString();
      const [memberId, gymId] = token.split(":");

      if (!memberId) {
        return { success: false, error: "Invalid token" };
      }

      const { data: member } = await supabase
        .from("members")
        .select("full_name, phone, email, status, gym_id")
        .eq("id", memberId)
        .single();

      if (!member) {
        return { success: false, error: "Member not found" };
      }

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*, plans(name)")
        .eq("member_id", memberId)
        .eq("billing_status", "active")
        .maybeSingle();

      const startOfMonth = new Date();
      startOfMonth.setDate(1);

      const { count: monthlyAttendance } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .eq("member_id", memberId)
        .gte("attended_on", startOfMonth.toISOString().split("T")[0]);

      const today = new Date().toISOString().split("T")[0];
      const { count: todayAttendance } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .eq("member_id", memberId)
        .eq("attended_on", today);

      return {
        success: true,
        member: {
          name: member.full_name,
          phone: member.phone,
          email: member.email,
          status: member.status,
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
          todayCheckedIn: (todayAttendance || 0) > 0,
          totalThisMonth: monthlyAttendance || 0,
          streak: 0,
        },
      };
    } catch (error) {
      console.error("[Member Dashboard] Error:", error);
      return { success: false, error: "Failed to load dashboard" };
    }
  });
}
