"use client";

import type { AttendanceRecord, Member } from "@gymflow/lib";
import { ResourceCrud } from "./resource-crud";

export function AttendanceCrud({ attendance, members }: { attendance: AttendanceRecord[]; members: Member[] }) {
  const memberMap = new Map(members.map((member) => [member.id, member.full_name]));

  return (
    <ResourceCrud
      resource="attendance"
      title="Attendance"
      description="Front desk and mobile check-ins can be created or corrected here."
      initialItems={attendance}
      emptyState="Each record is tenant-scoped and keyed by member plus date."
      initialForm={{
        member_id: members[0]?.id ?? "",
        attended_on: new Date().toISOString().slice(0, 10),
        check_in_time: new Date().toISOString(),
        source: "manual"
      }}
      fields={[
        { key: "member_id", label: "Member", type: "select", options: members.map((member) => ({ label: member.full_name, value: member.id })) },
        { key: "attended_on", label: "Attended on", type: "date" },
        { key: "check_in_time", label: "Check in time" },
        { key: "source", label: "Source", type: "select", options: ["manual", "qr", "mobile"].map((value) => ({ label: value, value })) }
      ]}
      columns={[
        { label: "Member", render: (record) => memberMap.get(record.member_id) ?? record.member_id },
        { label: "Date", render: (record) => record.attended_on },
        { label: "Source", render: (record) => record.source },
        { label: "Check in", render: (record) => record.check_in_time ?? "-" }
      ]}
    />
  );
}

