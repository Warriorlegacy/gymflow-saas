import { AppShell } from "@/components/app-shell";
import { AttendanceCrud } from "@/components/attendance-crud";
import { getAttendanceData, getMembersData } from "@/lib/data";

export default async function AttendancePage() {
  const [attendance, members] = await Promise.all([getAttendanceData(), getMembersData()]);

  return (
    <AppShell heading="Attendance" subheading="Manual, QR, or mobile check-ins tracked per tenant and grouped by date.">
      <AttendanceCrud attendance={attendance} members={members} />
    </AppShell>
  );
}
