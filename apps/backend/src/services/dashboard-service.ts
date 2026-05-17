import { supabaseAdmin } from "../lib/supabase";

async function listOrEmpty<T>(table: string, gymId: string): Promise<T[]> {
  if (!supabaseAdmin) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from(table)
    .select("*")
    .eq("gym_id", gymId);
  if (error || !data) {
    return [];
  }

  return data as T[];
}

export async function getDashboardSnapshot(gymId: string) {
  const [members, payments, subscriptions, attendance, trainers, gym] =
    await Promise.all([
      listOrEmpty<Record<string, unknown>>("members", gymId),
      listOrEmpty<Record<string, unknown>>("payments", gymId),
      listOrEmpty<Record<string, unknown>>("subscriptions", gymId),
      listOrEmpty<Record<string, unknown>>("attendance", gymId),
      listOrEmpty<Record<string, unknown>>("trainers", gymId),
      supabaseAdmin
        ? supabaseAdmin
            .from("gyms")
            .select("*")
            .eq("gym_id", gymId)
            .single()
            .then((r) => r.data)
        : null,
    ]);

  const gymData = gym || { name: "Your Gym", id: gymId, gym_id: gymId };

  const monthlyRevenue = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  return {
    gym: gymData,
    metrics: {
      totalMembers: members.length,
      activeMembers: members.filter((member) => member.status === "active")
        .length,
      monthlyRevenue,
      expiringSubscriptions: subscriptions.filter(
        (sub) => sub.billing_status === "expiring",
      ).length,
      todayAttendance: attendance.length,
      trainers: trainers.length,
    },
    recentMembers: members.slice(0, 5),
    pendingPayments: payments.filter((payment) => payment.status === "pending"),
    expiringMembers: subscriptions
      .filter((sub) => sub.billing_status === "expiring")
      .map((sub) => {
        const member = members.find((m) => m.id === sub.member_id);
        return {
          id: (member?.id as string) ?? (sub.id as string),
          full_name: (member?.full_name as string) ?? "Unknown member",
          phone: (member?.phone as string) ?? "-",
          end_date: sub.end_date as string,
        };
      }),
  };
}

export async function getResourceCollection(resource: string, gymId: string) {
  const tableName = resource === "diet-plans" ? "diet_plans" : resource;
  return listOrEmpty(tableName, gymId);
}
