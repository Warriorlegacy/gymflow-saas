import { AppShell } from "@/components/app-shell";
import { MembersCrud } from "@/components/members-crud";
import { getMembersData, getTrainersData } from "@/lib/data";

export default async function MembersPage() {
  const [members, trainers] = await Promise.all([getMembersData(), getTrainersData()]);

  return (
    <AppShell heading="Members" subheading="Tenant-safe member management with trainer assignment, status tracking, and goals.">
      <MembersCrud members={members} trainers={trainers} />
    </AppShell>
  );
}
