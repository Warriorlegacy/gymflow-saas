import { z } from "zod";

export const demoLoginSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80).default("Demo Owner"),
});

export const memberSchema = z.object({
  full_name: z.string().min(2).max(120),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(8).max(20),
  gender: z.string().max(20).optional().or(z.literal("")),
  joined_on: z.string().min(10),
  status: z.enum(["active", "inactive", "expired", "lead"]),
  primary_goal: z.string().max(160).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  trainer_id: z.string().uuid().optional().or(z.literal("")),
});

export const planSchema = z.object({
  name: z.string().min(2).max(120),
  duration_days: z.coerce.number().int().min(1).max(3650),
  price: z.coerce.number().min(0),
  description: z.string().max(300).optional().or(z.literal("")),
  is_active: z.coerce.boolean().default(true),
});

export const paymentSchema = z.object({
  member_id: z.string().uuid(),
  plan_id: z.string().uuid().optional().or(z.literal("")),
  amount: z.coerce.number().min(0),
  paid_on: z.string().min(10),
  method: z.enum(["cash", "upi", "card", "bank", "demo"]),
  status: z.enum(["paid", "pending", "failed", "refunded"]),
  reference_code: z.string().max(80).optional().or(z.literal("")),
  notes: z.string().max(300).optional().or(z.literal("")),
});

export const attendanceSchema = z.object({
  member_id: z.string().uuid(),
  attended_on: z.string().min(10),
  check_in_time: z.string().optional().or(z.literal("")),
  source: z.enum(["manual", "qr", "mobile"]),
});

export const trainerSchema = z.object({
  full_name: z.string().min(2).max(120),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(8).max(20).optional().or(z.literal("")),
  specialty: z.string().max(120).optional().or(z.literal("")),
  bio: z.string().max(400).optional().or(z.literal("")),
  is_active: z.coerce.boolean().default(true),
});

export const onboardingGymSchema = z.object({
  gym_name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  owner_name: z.string().min(2).max(100),
  owner_email: z.string().email(),
  phone: z.string().min(8).max(20),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  subscription_tier: z.enum(["starter", "growth", "scale"]).default("starter"),
});

export const workoutSchema = z.object({
  member_id: z.string().uuid().optional().or(z.literal("")),
  trainer_id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(2).max(200),
  goal: z.string().max(300).optional().or(z.literal("")),
  schedule: z
    .array(
      z.object({
        day: z.string(),
        focus: z.string(),
        exercises: z.array(z.string()),
      }),
    )
    .default([]),
  ai_generated: z.coerce.boolean().default(false),
});

export const dietPlanSchema = z.object({
  member_id: z.string().uuid().optional().or(z.literal("")),
  trainer_id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(2).max(200),
  objective: z.string().max(300).optional().or(z.literal("")),
  meals: z
    .array(
      z.object({
        time: z.string(),
        meal: z.string(),
        items: z.array(z.string()),
      }),
    )
    .default([]),
  ai_generated: z.coerce.boolean().default(false),
});

export const resourceSchemas = {
  members: memberSchema,
  plans: planSchema,
  payments: paymentSchema,
  attendance: attendanceSchema,
  trainers: trainerSchema,
  workouts: workoutSchema,
  "diet-plans": dietPlanSchema,
} as const;
