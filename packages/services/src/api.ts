import type {
  AILog,
  AttendanceRecord,
  DashboardSnapshot,
  DietPlan,
  Member,
  Payment,
  Plan,
  Trainer,
  WorkoutPlan,
} from "@gymflow/lib";
import {
  demoAttendance,
  demoDashboardSnapshot,
  demoDietPlans,
  demoMembers,
  demoPayments,
  demoPlans,
  demoTrainers,
  demoWorkouts,
} from "@gymflow/lib";
import { serviceEnv } from "./config";

async function safeFetch<T>(
  path: string,
  init?: RequestInit,
  fallback?: T,
): Promise<T> {
  try {
    const baseUrl =
      typeof window !== "undefined" ? "" : (serviceEnv.apiBaseUrl ?? "");
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    if (fallback !== undefined) {
      return fallback;
    }

    throw new Error(`Unable to reach ${path}`);
  }
}

export const api = {
  getDashboard: () =>
    safeFetch<DashboardSnapshot>(
      "/api/dashboard",
      undefined,
      demoDashboardSnapshot,
    ),
  getMembers: () => safeFetch<Member[]>("/api/members", undefined, demoMembers),
  getPlans: () => safeFetch<Plan[]>("/api/plans", undefined, demoPlans),
  getPayments: () =>
    safeFetch<Payment[]>("/api/payments", undefined, demoPayments),
  getAttendance: () =>
    safeFetch<AttendanceRecord[]>("/api/attendance", undefined, demoAttendance),
  getTrainers: () =>
    safeFetch<Trainer[]>("/api/trainers", undefined, demoTrainers),
  getWorkouts: () =>
    safeFetch<WorkoutPlan[]>("/api/workouts", undefined, demoWorkouts),
  getDietPlans: () =>
    safeFetch<DietPlan[]>("/api/diet-plans", undefined, demoDietPlans),
  runAI: (feature: AILog["feature"], prompt: string) =>
    safeFetch<{ output: string }>(
      "/api/ai/generate",
      {
        method: "POST",
        body: JSON.stringify({ feature, prompt }),
      },
      { output: `Demo ${feature} response for: ${prompt}` },
    ),
  sendWhatsAppMessage: (payload: {
    to: string;
    message: string;
    type: string;
  }) =>
    safeFetch<{ success: boolean; provider: string }>(
      "/api/whatsapp/send",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      { success: true, provider: "demo" },
    ),
  createDemoSubscription: (payload: { tier: string }) =>
    safeFetch<{ success: boolean; tier: string }>(
      "/api/billing/demo-subscribe",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      { success: true, tier: payload.tier },
    ),
};
