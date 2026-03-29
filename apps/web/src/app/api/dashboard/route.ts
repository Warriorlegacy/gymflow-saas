import { NextResponse } from "next/server";
import { demoDashboardSnapshot } from "@gymflow/lib";
import { getSupabaseClient, getGymIdFromRequest } from "@/lib/supabase-api";

export async function GET(_request: Request) {
  const gymId = getGymIdFromRequest();
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(demoDashboardSnapshot);
  }

  try {
    const [
      membersResult,
      paymentsResult,
      subscriptionsResult,
      attendanceResult,
      trainersResult,
    ] = await Promise.all([
      supabase.from("members").select("*").eq("gym_id", gymId),
      supabase.from("payments").select("*").eq("gym_id", gymId),
      supabase.from("subscriptions").select("*").eq("gym_id", gymId),
      supabase.from("attendance").select("*").eq("gym_id", gymId),
      supabase.from("trainers").select("*").eq("gym_id", gymId),
    ]);

    const members = membersResult.data ?? [];
    const payments = paymentsResult.data ?? [];
    const subscriptions = subscriptionsResult.data ?? [];
    const attendance = attendanceResult.data ?? [];
    const trainers = trainersResult.data ?? [];

    const monthlyRevenue = payments
      .filter((p: any) => p.status === "paid")
      .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

    return NextResponse.json({
      ...demoDashboardSnapshot,
      metrics: {
        totalMembers: members.length,
        activeMembers: members.filter((m: any) => m.status === "active").length,
        monthlyRevenue,
        expiringSubscriptions: subscriptions.filter(
          (s: any) => s.billing_status === "expiring",
        ).length,
        todayAttendance: attendance.length,
        trainers: trainers.length,
      },
      recentMembers: members.slice(0, 5),
      pendingPayments: payments.filter((p: any) => p.status === "pending"),
      expiringMembers: subscriptions
        .filter((s: any) => s.billing_status === "expiring")
        .map((s: any) => {
          const member = members.find((m: any) => m.id === s.member_id);
          return {
            id: member?.id ?? s.id,
            full_name: member?.full_name ?? "Unknown",
            phone: member?.phone ?? "-",
            end_date: s.end_date,
          };
        }),
    });
  } catch {
    return NextResponse.json(demoDashboardSnapshot);
  }
}
