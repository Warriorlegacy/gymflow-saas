"use client";

import type { Plan } from "@gymflow/lib";
import { currency } from "@gymflow/lib";
import { ResourceCrud } from "./resource-crud";

export function PlansCrud({ plans }: { plans: Plan[] }) {
  return (
    <ResourceCrud
      resource="plans"
      title="Plan"
      description="Create and maintain the packages each gym sells."
      initialItems={plans}
      emptyState="Monthly, quarterly, and annual plans with editable pricing."
      initialForm={{
        name: "",
        duration_days: "30",
        price: "0",
        description: "",
        is_active: true,
      }}
      fields={[
        { key: "name", label: "Plan name" },
        { key: "duration_days", label: "Duration days", type: "number" },
        { key: "price", label: "Price", type: "number" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "is_active", label: "Active", type: "checkbox" },
      ]}
      columns={[
        { label: "Plan", render: (plan) => plan.name, searchable: true },
        { label: "Duration", render: (plan) => `${plan.duration_days} days` },
        { label: "Price", render: (plan) => currency(plan.price) },
        {
          label: "Status",
          render: (plan) => (plan.is_active ? "Active" : "Inactive"),
          searchable: true,
        },
      ]}
    />
  );
}
