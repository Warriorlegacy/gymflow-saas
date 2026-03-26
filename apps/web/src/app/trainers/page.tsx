import { AppShell } from "@/components/app-shell";
import { TrainersCrud } from "@/components/trainers-crud";
import { getTrainersData } from "@/lib/data";

export default async function TrainersPage() {
  const trainers = await getTrainersData();

  return (
    <AppShell heading="Trainer panel" subheading="Manage coaching staff, specialties, and client allocations for each gym.">
      <TrainersCrud trainers={trainers} />
    </AppShell>
  );
}
