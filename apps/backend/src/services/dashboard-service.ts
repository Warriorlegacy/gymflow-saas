import {
  demoAttendance,
  demoDashboardSnapshot,
  demoDietPlans,
  demoMembers,
  demoPayments,
  demoPlans,
  demoSubscriptions,
  demoTrainers,
  demoWorkouts
} from "@gymflow/lib";
import { supabaseAdmin } from "../lib/supabase";

async function listOrFallback<T>(table: string, fallback: T[], gymId: string) {
  if (!supabaseAdmin) {
    return fallback;
  }

  const { data, error } = await supabaseAdmin.from(table).select("*").eq("gym_id", gymId);
  if (error || !data) {
    return fallback;
  }

  return data as T[];
}

export async function getDashboardSnapshot(gymId: string) {
  const [members, payments, subscriptions, attendance, trainers] = await Promise.all([
    listOrFallback("members", demoMembers, gymId),
    listOrFallback("payments", demoPayments, gymId),
    listOrFallback("subscriptions", demoSubscriptions, gymId),
    listOrFallback("attendance", demoAttendance, gymId),
    listOrFallback("trainers", demoTrainers, gymId)
  ]);

  const monthlyRevenue = payments
    .filter((payment: any) => payment.status === "paid")
    .reduce((sum: number, payment: any) => sum + Number(payment.amount), 0);

  return {
    ...demoDashboardSnapshot,
    metrics: {
      totalMembers: members.length,
      activeMembers: members.filter((member: any) => member.status === "active").length,
      monthlyRevenue,
      expiringSubscriptions: subscriptions.filter((subscription: any) => subscription.billing_status === "expiring").length,
      todayAttendance: attendance.length,
      trainers: trainers.length
    },
    recentMembers: members.slice(0, 5),
    pendingPayments: payments.filter((payment: any) => payment.status === "pending"),
    expiringMembers: subscriptions
      .filter((subscription: any) => subscription.billing_status === "expiring")
      .map((subscription: any) => {
        const member = members.find((entry: any) => entry.id === subscription.member_id);
        return {
          id: member?.id ?? subscription.id,
          full_name: member?.full_name ?? "Unknown member",
          phone: member?.phone ?? "-",
          end_date: subscription.end_date
        };
      })
  };
}

export async function getResourceCollection(resource: string, gymId: string) {
  const fallbacks: Record<string, unknown[]> = {
    members: demoMembers,
    plans: demoPlans,
    payments: demoPayments,
    trainers: demoTrainers,
    workouts: demoWorkouts,
    "diet-plans": demoDietPlans
  };

  const tableName = resource === "diet-plans" ? "diet_plans" : resource;
  return listOrFallback(tableName, fallbacks[resource] ?? [], gymId);
}
