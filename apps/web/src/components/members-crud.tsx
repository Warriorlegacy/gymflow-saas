"use client";

import type { Member, Trainer } from "@gymflow/lib";
import { ResourceCrud } from "./resource-crud";

export function MembersCrud({ members, trainers }: { members: Member[]; trainers: Trainer[] }) {
  const trainerMap = new Map(trainers.map((trainer) => [trainer.id, trainer.full_name]));

  return (
    <ResourceCrud
      resource="members"
      title="Member"
      description="Create and update members directly from the SaaS dashboard."
      initialItems={members}
      emptyState="Admissions, lead conversion, and trainer assignment all live here."
      initialForm={{
        full_name: "",
        email: "",
        phone: "",
        gender: "",
        joined_on: new Date().toISOString().slice(0, 10),
        status: "active",
        primary_goal: "",
        notes: "",
        trainer_id: ""
      }}
      fields={[
        { key: "full_name", label: "Full name" },
        { key: "email", label: "Email", type: "email" },
        { key: "phone", label: "Phone" },
        { key: "gender", label: "Gender" },
        { key: "joined_on", label: "Joined on", type: "date" },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive", "expired", "lead"].map((value) => ({ label: value, value }))
        },
        { key: "primary_goal", label: "Primary goal" },
        { key: "notes", label: "Notes", type: "textarea" },
        {
          key: "trainer_id",
          label: "Trainer",
          type: "select",
          options: trainers.map((trainer) => ({ label: trainer.full_name, value: trainer.id }))
        }
      ]}
      columns={[
        { label: "Name", render: (member) => member.full_name },
        { label: "Phone", render: (member) => member.phone },
        { label: "Status", render: (member) => member.status },
        { label: "Goal", render: (member) => member.primary_goal ?? "-" },
        { label: "Trainer", render: (member) => (member.trainer_id ? trainerMap.get(member.trainer_id) ?? "-" : "-") }
      ]}
    />
  );
}

