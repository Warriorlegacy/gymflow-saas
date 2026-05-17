import { currency } from "@gymflow/lib";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { SectionCard } from "@/components/section-card";
import { SimpleTable } from "@/components/simple-table";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";

// Dynamic imports for heavy client components
const AIStudio = dynamic(
  () =>
    import("@/components/ai-studio").then((mod) => ({ default: mod.AIStudio })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
    ),
  },
);

const WhatsAppPanel = dynamic(
  () =>
    import("@/components/whatsapp-panel").then((mod) => ({
      default: mod.WhatsAppPanel,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
    ),
  },
);

async function getDashboardData() {
  const cookieStore = cookies();

  // Get gym_id from cookie or localStorage (passed via header)
  let gymId: string | null = null;

  // Check owner gym cookie
  const ownerGym = cookieStore.get("gymflow_owner_gym")?.value;
  if (ownerGym) {
    const parsed = JSON.parse(ownerGym);
    gymId = parsed.gym_id;
  }

  // If we have a gymId, fetch from database
  if (gymId) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const today = new Date().toISOString().split("T")[0];

    // Execute all queries in parallel
    const [
      gymResult,
      membersResult,
      trainersResult,
      attendanceResult,
      subscriptionsResult,
      paymentsResult,
    ] = await Promise.all([
      supabase.from("gyms").select("gym_id, name").eq("gym_id", gymId).single(),
      supabase
        .from("members")
        .select("id, gym_id, full_name, phone, status, primary_goal, joined_on")
        .eq("gym_id", gymId)
        .order("joined_on", { ascending: false })
        .limit(100),
      supabase.from("trainers").select("id").eq("gym_id", gymId),
      supabase
        .from("attendance")
        .select("id, member_id, attended_on")
        .eq("gym_id", gymId)
        .eq("attended_on", today),
      supabase
        .from("subscriptions")
        .select("id, member_id, amount, end_date, billing_status")
        .eq("gym_id", gymId)
        .eq("billing_status", "active"),
      supabase
        .from("payments")
        .select("id, amount, paid_on, method")
        .eq("gym_id", gymId)
        .order("paid_on", { ascending: false })
        .limit(5),
    ]);

    const gym = gymResult.data;
    const members = membersResult.data || [];
    const trainers = trainersResult.data || [];
    const todayAttendance = attendanceResult.data || [];
    const subscriptions = subscriptionsResult.data || [];
    const recentPayments = paymentsResult.data || [];

    // Calculate metrics efficiently
    const totalMembers = members.length;
    const activeMembers = members.filter(
      (m: Record<string, unknown>) => m.status === "active",
    ).length;

    // Single pass through subscriptions for both metrics
    let monthlyRevenue = 0;
    let expiringSoon = 0;
    const now = Date.now();

    for (const s of subscriptions) {
      monthlyRevenue += Number((s as Record<string, unknown>).amount) || 0;
      const endDate = new Date(
        (s as Record<string, unknown>).end_date as string,
      ).getTime();
      const daysUntilExpiry = Math.ceil(
        (endDate - now) / (1000 * 60 * 60 * 24),
      );
      if (daysUntilExpiry <= 7) {
        expiringSoon++;
      }
    }

    return {
      gym: gym || { name: "Your Gym" },
      metrics: {
        totalMembers,
        activeMembers,
        monthlyRevenue,
        todayAttendance: todayAttendance.length,
        expiringSubscriptions: expiringSoon,
        trainers: trainers.length,
      },
      recentMembers: members.slice(0, 5).map((m: Record<string, unknown>) => ({
        id: m.id,
        full_name: m.full_name,
        phone: m.phone,
        status: m.status,
        primary_goal: m.primary_goal,
      })),
      expiringMembers: subscriptions
        .filter((s: Record<string, unknown>) => {
          const endDate = new Date(s.end_date as string).getTime();
          const daysUntilExpiry = Math.ceil(
            (endDate - now) / (1000 * 60 * 60 * 24),
          );
          return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
        })
        .slice(0, 10)
        .map((s: Record<string, unknown>) => ({
          id: s.id,
          full_name: "Unknown",
          end_date: s.end_date,
          phone: "",
        })),
      recentPayments: recentPayments.map((p: Record<string, unknown>) => ({
        id: p.id,
        member: "Unknown",
        amount: p.amount,
        paid_on: p.paid_on,
        method: p.method,
      })),
    };
  }

  // Fallback - redirect to login if no gym_id found
  return {
    gym: { name: "Your Gym" },
    metrics: {
      totalMembers: 0,
      activeMembers: 0,
      monthlyRevenue: 0,
      expiringSubscriptions: 0,
      todayAttendance: 0,
      trainers: 0,
    },
    recentMembers: [],
    expiringMembers: [],
    recentPayments: [],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <AppShell
      heading={`${data.gym.name} dashboard`}
      subheading="Daily metrics, renewals, AI tooling, and WhatsApp outreach in one view."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Total members"
          value={String(data.metrics.totalMembers)}
          helper="Across active, expired, and leads"
        />
        <MetricCard
          label="Monthly revenue"
          value={currency(data.metrics.monthlyRevenue)}
          helper="Demo revenue for the current month"
        />
        <MetricCard
          label="Today's attendance"
          value={String(data.metrics.todayAttendance)}
          helper="Updated from mobile and front desk"
        />
        <MetricCard
          label="Active members"
          value={String(data.metrics.activeMembers)}
          helper="Healthy recurring base"
        />
        <MetricCard
          label="Expiring soon"
          value={String(data.metrics.expiringSubscriptions)}
          helper="Trigger reminders automatically"
        />
        <MetricCard
          label="Coaching staff"
          value={String(data.metrics.trainers)}
          helper="Trainer panel synced"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Recent members"
          description="Newest admissions and leads in the current tenant."
        >
          <SimpleTable
            headers={["Member", "Goal", "Status", "Phone"]}
            rows={data.recentMembers.map(
              (member) =>
                [
                  member.full_name,
                  member.primary_goal ?? "-",
                  member.status,
                  member.phone,
                ] as string[],
            )}
          />
        </SectionCard>
        <SectionCard
          title="Pending renewals"
          description="Members whose payments or plans need attention this week."
        >
          <SimpleTable
            headers={["Member", "Renew by", "Phone"]}
            rows={data.expiringMembers.map(
              (member) =>
                [member.full_name, member.end_date, member.phone] as string[],
            )}
          />
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AIStudio />
        <WhatsAppPanel />
      </section>
    </AppShell>
  );
}
