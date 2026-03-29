"use client";

import type { Trainer } from "@gymflow/lib";
import { ResourceCrud } from "./resource-crud";

export function TrainersCrud({ trainers }: { trainers: Trainer[] }) {
  return (
    <ResourceCrud
      resource="trainers"
      title="Trainer"
      description="Manage active coaching staff and their specialties."
      initialItems={trainers}
      emptyState="Trainer records support assignment, workouts, and diet plans."
      initialForm={{
        full_name: "",
        email: "",
        phone: "",
        specialty: "",
        bio: "",
        is_active: true,
      }}
      fields={[
        { key: "full_name", label: "Full name" },
        { key: "email", label: "Email", type: "email" },
        { key: "phone", label: "Phone" },
        { key: "specialty", label: "Specialty" },
        { key: "bio", label: "Bio", type: "textarea" },
        { key: "is_active", label: "Active", type: "checkbox" },
      ]}
      columns={[
        {
          label: "Trainer",
          render: (trainer) => trainer.full_name,
          searchable: true,
        },
        {
          label: "Specialty",
          render: (trainer) => trainer.specialty ?? "-",
          searchable: true,
        },
        {
          label: "Phone",
          render: (trainer) => trainer.phone ?? "-",
          searchable: true,
        },
        {
          label: "Status",
          render: (trainer) => (trainer.is_active ? "Active" : "Inactive"),
          searchable: true,
        },
      ]}
    />
  );
}
