import { AppShell } from "@/components/app-shell";
import { WorkoutsCrud } from "@/components/workouts-crud";
import { getMembersData, getTrainersData, getWorkoutsData } from "@/lib/data";

export default async function WorkoutsPage() {
  const [workouts, members, trainers] = await Promise.all([
    getWorkoutsData(),
    getMembersData(),
    getTrainersData(),
  ]);

  return (
    <AppShell
      heading="Workouts"
      subheading="Manage workout plans, assign to members, and leverage AI generation."
    >
      <WorkoutsCrud workouts={workouts} members={members} trainers={trainers} />
    </AppShell>
  );
}
