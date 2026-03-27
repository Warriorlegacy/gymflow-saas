import { demoSubscriptionPlans } from "@gymflow/lib";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { SimpleTable } from "@/components/simple-table";

export default function BillingPage() {
  return (
    <AppShell
      heading="Billing"
      subheading="Manage your gym's SaaS subscription, view plans, and handle payments."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Current plan"
          description="Your gym's current SaaS subscription tier and status."
        >
          <SimpleTable
            headers={["Field", "Value"]}
            rows={[
              ["Tier", "Growth"],
              ["Status", "Active"],
              ["Amount", "Rs. 499/month"],
              ["Next billing", "2026-04-27"],
              ["Payment method", "Demo"],
            ]}
          />
        </SectionCard>
        <SectionCard
          title="Available plans"
          description="Upgrade or change your subscription tier."
        >
          <div className="grid gap-4">
            {demoSubscriptionPlans.map((plan) => (
              <div
                key={plan.code}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-950">
                      {plan.name}
                    </h4>
                    <p className="text-sm text-slate-500">{plan.features[0]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">Rs. {plan.amount}</p>
                    <p className="text-xs text-slate-500">per month</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <SectionCard
        title="Billing history"
        description="Recent transactions for your gym's SaaS subscription."
      >
        <SimpleTable
          headers={["Date", "Description", "Amount", "Status"]}
          rows={[
            ["2026-03-27", "Growth plan - Monthly", "Rs. 499", "Paid"],
            ["2026-02-27", "Growth plan - Monthly", "Rs. 499", "Paid"],
            ["2026-01-27", "Starter plan - Monthly", "Rs. 299", "Paid"],
          ]}
        />
      </SectionCard>
    </AppShell>
  );
}
