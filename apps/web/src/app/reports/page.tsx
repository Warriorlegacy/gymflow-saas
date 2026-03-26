import { currency } from "@gymflow/lib";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { SimpleTable } from "@/components/simple-table";
import { getReportsData } from "@/lib/data";

export default async function ReportsPage() {
  const reports = await getReportsData();

  return (
    <AppShell heading="Reports" subheading="Retention, coaching output, and subscription health across the current gym tenant.">
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Subscription health" description="Spot active versus expiring subscriptions before churn happens.">
          <SimpleTable
            headers={["Status", "End date", "Auto renew", "Amount"]}
            rows={reports.subscriptions.map((subscription) => [
              subscription.billing_status,
              subscription.end_date,
              subscription.auto_renew ? "Yes" : "No",
              currency(subscription.amount)
            ])}
          />
        </SectionCard>
        <SectionCard title="Coach output" description="AI-generated workouts and diet plans assigned to members.">
          <SimpleTable
            headers={["Type", "Title", "AI", "Entries"]}
            rows={[
              ...reports.workouts.map((workout) => ["Workout", workout.title, workout.ai_generated ? "Yes" : "No", String(workout.schedule.length)]),
              ...reports.dietPlans.map((plan) => ["Diet", plan.title, plan.ai_generated ? "Yes" : "No", String(plan.meals.length)])
            ]}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}

