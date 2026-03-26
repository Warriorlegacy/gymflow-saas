import { currency } from "@gymflow/lib";
import { AppShell } from "@/components/app-shell";
import { AIStudio } from "@/components/ai-studio";
import { MetricCard } from "@/components/metric-card";
import { SectionCard } from "@/components/section-card";
import { SimpleTable } from "@/components/simple-table";
import { WhatsAppPanel } from "@/components/whatsapp-panel";
import { getDashboardData } from "@/lib/data";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <AppShell heading={`${data.gym.name} dashboard`} subheading="Daily metrics, renewals, AI tooling, and WhatsApp outreach in one view.">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Total members" value={String(data.metrics.totalMembers)} helper="Across active, expired, and leads" />
        <MetricCard label="Monthly revenue" value={currency(data.metrics.monthlyRevenue)} helper="Demo revenue for the current month" />
        <MetricCard label="Today's attendance" value={String(data.metrics.todayAttendance)} helper="Updated from mobile and front desk" />
        <MetricCard label="Active members" value={String(data.metrics.activeMembers)} helper="Healthy recurring base" />
        <MetricCard label="Expiring soon" value={String(data.metrics.expiringSubscriptions)} helper="Trigger reminders automatically" />
        <MetricCard label="Coaching staff" value={String(data.metrics.trainers)} helper="Trainer panel synced" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Recent members" description="Newest admissions and leads in the current tenant.">
          <SimpleTable
            headers={["Member", "Goal", "Status", "Phone"]}
            rows={data.recentMembers.map((member) => [member.full_name, member.primary_goal ?? "-", member.status, member.phone])}
          />
        </SectionCard>
        <SectionCard title="Pending renewals" description="Members whose payments or plans need attention this week.">
          <SimpleTable
            headers={["Member", "Renew by", "Phone"]}
            rows={data.expiringMembers.map((member) => [member.full_name, member.end_date, member.phone])}
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

