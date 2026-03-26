import { AppShell } from "@/components/app-shell";
import { DietPlansCrud } from "@/components/diet-plans-crud";
import { getDietPlansData, getMembersData, getTrainersData } from "@/lib/data";

export default async function DietPlansPage() {
  const [dietPlans, members, trainers] = await Promise.all([
    getDietPlansData(),
    getMembersData(),
    getTrainersData(),
  ]);

  return (
    <AppShell
      heading="Diet Plans"
      subheading="Manage nutrition plans, assign to members, and leverage AI generation."
    >
      <DietPlansCrud
        dietPlans={dietPlans}
        members={members}
        trainers={trainers}
      />
    </AppShell>
  );
}
