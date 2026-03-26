import { demoGym, demoSubscriptionPlans } from "@gymflow/lib";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { SimpleTable } from "@/components/simple-table";

export default function SettingsPage() {
  return (
    <AppShell heading="Settings" subheading="Gym profile, demo subscription state, and deployment environment checklist.">
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Gym profile" description="Core tenant metadata mirrored into JWT claims for row-level security.">
          <SimpleTable
            headers={["Field", "Value"]}
            rows={[
              ["Gym name", demoGym.name],
              ["Slug", demoGym.slug],
              ["City", demoGym.city],
              ["State", demoGym.state],
              ["Subscription", `${demoGym.subscription_tier} / ${demoGym.subscription_status}`]
            ]}
          />
        </SectionCard>
        <SectionCard title="Demo billing plans" description="Logic-first subscriptions with no payment provider dependency.">
          <SimpleTable
            headers={["Tier", "Price", "Positioning"]}
            rows={demoSubscriptionPlans.map((plan) => [plan.name, `Rs. ${plan.amount}`, plan.features[0]])}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
