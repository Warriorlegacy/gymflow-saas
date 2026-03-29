import { describe, it, expect } from "vitest";
import {
  memberSchema,
  planSchema,
  paymentSchema,
  trainerSchema,
  demoLoginSchema,
} from "@gymflow/lib";

describe("memberSchema", () => {
  it("should validate a valid member", () => {
    const validMember = {
      full_name: "John Doe",
      phone: "+91 98765 43210",
      email: "john@example.com",
      gender: "Male",
      joined_on: "2026-01-15",
      status: "active",
      primary_goal: "Muscle gain",
    };
    const result = memberSchema.safeParse(validMember);
    expect(result.success).toBe(true);
  });

  it("should reject member without required fields", () => {
    const invalidMember = {
      email: "john@example.com",
    };
    const result = memberSchema.safeParse(invalidMember);
    expect(result.success).toBe(false);
  });

  it("should reject invalid email format", () => {
    const invalidMember = {
      full_name: "John Doe",
      phone: "+91 98765 43210",
      email: "invalid-email",
      joined_on: "2026-01-15",
      status: "active",
    };
    const result = memberSchema.safeParse(invalidMember);
    expect(result.success).toBe(false);
  });

  it("should reject invalid status", () => {
    const invalidMember = {
      full_name: "John Doe",
      phone: "+91 98765 43210",
      joined_on: "2026-01-15",
      status: "invalid-status",
    };
    const result = memberSchema.safeParse(invalidMember);
    expect(result.success).toBe(false);
  });
});

describe("planSchema", () => {
  it("should validate a valid plan", () => {
    const validPlan = {
      name: "Monthly Plan",
      duration_days: 30,
      price: 999,
      description: "Monthly gym membership",
      is_active: true,
    };
    const result = planSchema.safeParse(validPlan);
    expect(result.success).toBe(true);
  });

  it("should reject plan with negative price", () => {
    const invalidPlan = {
      name: "Free Plan",
      duration_days: 30,
      price: -100,
    };
    const result = planSchema.safeParse(invalidPlan);
    expect(result.success).toBe(false);
  });

  it("should reject plan with zero duration", () => {
    const invalidPlan = {
      name: "Invalid Plan",
      duration_days: 0,
      price: 100,
    };
    const result = planSchema.safeParse(invalidPlan);
    expect(result.success).toBe(false);
  });
});

describe("paymentSchema", () => {
  it("should validate a valid payment", () => {
    const validPayment = {
      member_id: "123e4567-e89b-12d3-a456-426614174000",
      plan_id: "123e4567-e89b-12d3-a456-426614174001",
      amount: 999,
      paid_on: "2026-03-27",
      method: "cash",
      status: "paid",
    };
    const result = paymentSchema.safeParse(validPayment);
    expect(result.success).toBe(true);
  });

  it("should reject payment with invalid method", () => {
    const invalidPayment = {
      member_id: "123e4567-e89b-12d3-a456-426614174000",
      amount: 999,
      paid_on: "2026-03-27",
      method: "bitcoin",
      status: "paid",
    };
    const result = paymentSchema.safeParse(invalidPayment);
    expect(result.success).toBe(false);
  });

  it("should reject payment with invalid status", () => {
    const invalidPayment = {
      member_id: "123e4567-e89b-12d3-a456-426614174000",
      amount: 999,
      paid_on: "2026-03-27",
      method: "cash",
      status: "completed",
    };
    const result = paymentSchema.safeParse(invalidPayment);
    expect(result.success).toBe(false);
  });
});

describe("trainerSchema", () => {
  it("should validate a valid trainer", () => {
    const validTrainer = {
      full_name: "Neha Sharma",
      email: "neha@gym.com",
      phone: "+91 98765 43210",
      specialty: "Strength Training",
      bio: "5 years experience",
      is_active: true,
    };
    const result = trainerSchema.safeParse(validTrainer);
    expect(result.success).toBe(true);
  });

  it("should reject trainer without name", () => {
    const invalidTrainer = {
      email: "neha@gym.com",
    };
    const result = trainerSchema.safeParse(invalidTrainer);
    expect(result.success).toBe(false);
  });
});

describe("demoLoginSchema", () => {
  it("should validate a valid demo login", () => {
    const validLogin = {
      email: "owner@gymflow.demo",
      name: "Demo Owner",
    };
    const result = demoLoginSchema.safeParse(validLogin);
    expect(result.success).toBe(true);
  });

  it("should reject login without email", () => {
    const invalidLogin = {
      name: "Demo Owner",
    };
    const result = demoLoginSchema.safeParse(invalidLogin);
    expect(result.success).toBe(false);
  });

  it("should reject login with invalid email", () => {
    const invalidLogin = {
      email: "not-an-email",
      name: "Demo Owner",
    };
    const result = demoLoginSchema.safeParse(invalidLogin);
    expect(result.success).toBe(false);
  });
});
