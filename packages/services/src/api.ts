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
import { serviceEnv } from "./config";

async function safeFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl =
    typeof window !== "undefined" ? "" : (serviceEnv.apiBaseUrl ?? "");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Request failed with status ${response.status}`,
      );
    }

    const data = await response.json();
    // Handle paginated responses
    if (data.data !== undefined && data.pagination !== undefined) {
      return data.data as T;
    }
    return data as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout for ${path}`);
    }
    throw new Error(
      `Unable to reach ${path}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  getDashboard: () => safeFetch<DashboardSnapshot>("/api/dashboard"),
  getMembers: (page = 1, limit = 50) =>
    safeFetch<Member[]>(`/api/members?page=${page}&limit=${limit}`),
  getPlans: (page = 1, limit = 50) =>
    safeFetch<Plan[]>(`/api/plans?page=${page}&limit=${limit}`),
  getPayments: (page = 1, limit = 50) =>
    safeFetch<Payment[]>(`/api/payments?page=${page}&limit=${limit}`),
  getAttendance: (page = 1, limit = 50) =>
    safeFetch<AttendanceRecord[]>(
      `/api/attendance?page=${page}&limit=${limit}`,
    ),
  getTrainers: (page = 1, limit = 50) =>
    safeFetch<Trainer[]>(`/api/trainers?page=${page}&limit=${limit}`),
  getWorkouts: (page = 1, limit = 50) =>
    safeFetch<WorkoutPlan[]>(`/api/workouts?page=${page}&limit=${limit}`),
  getDietPlans: (page = 1, limit = 50) =>
    safeFetch<DietPlan[]>(`/api/diet-plans?page=${page}&limit=${limit}`),
  runAI: (feature: AILog["feature"], prompt: string) =>
    safeFetch<{ output: string }>("/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({ feature, prompt }),
    }),
  sendWhatsAppMessage: (payload: {
    to: string;
    message: string;
    type: string;
  }) =>
    safeFetch<{ success: boolean; provider: string }>("/api/whatsapp/send", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createDemoSubscription: (payload: { tier: string }) =>
    safeFetch<{ success: boolean; tier: string }>(
      "/api/billing/demo-subscribe",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ),
};
