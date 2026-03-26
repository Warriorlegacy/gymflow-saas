import { AppShell } from "@/components/app-shell";
import { PlansCrud } from "@/components/plans-crud";
import { getPlansData } from "@/lib/data";

export default async function PlansPage() {
  const plans = await getPlansData();

  return (
    <AppShell heading="Plans" subheading="Manage package pricing, durations, and active plan catalog for each gym tenant.">
      <PlansCrud plans={plans} />
    </AppShell>
  );
}
