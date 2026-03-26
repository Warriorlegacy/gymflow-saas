"use client";

import type { DietPlan, Member, Trainer } from "@gymflow/lib";
import { ResourceCrud } from "./resource-crud";

export function DietPlansCrud({
  dietPlans,
  members,
  trainers,
}: {
  dietPlans: DietPlan[];
  members: Member[];
  trainers: Trainer[];
}) {
  const memberMap = new Map(members.map((m) => [m.id, m.full_name]));
  const trainerMap = new Map(trainers.map((t) => [t.id, t.full_name]));

  return (
    <ResourceCrud
      resource="diet-plans"
      title="Diet Plan"
      description="Create nutrition plans and assign to members or let AI generate them."
      initialItems={dietPlans}
      emptyState="Diet plans support meal-by-meal scheduling with food items."
      initialForm={{
        member_id: "",
        trainer_id: "",
        title: "",
        objective: "",
        ai_generated: false,
      }}
      fields={[
        { key: "title", label: "Title" },
        { key: "objective", label: "Objective" },
        {
          key: "member_id",
          label: "Member",
          type: "select",
          options: members.map((m) => ({ label: m.full_name, value: m.id })),
        },
        {
          key: "trainer_id",
          label: "Trainer",
          type: "select",
          options: trainers.map((t) => ({ label: t.full_name, value: t.id })),
        },
        { key: "ai_generated", label: "AI Generated", type: "checkbox" },
      ]}
      columns={[
        { label: "Title", render: (d) => d.title },
        { label: "Objective", render: (d) => d.objective ?? "-" },
        {
          label: "Member",
          render: (d) =>
            d.member_id ? (memberMap.get(d.member_id) ?? "-") : "-",
        },
        {
          label: "Trainer",
          render: (d) =>
            d.trainer_id ? (trainerMap.get(d.trainer_id) ?? "-") : "-",
        },
        { label: "Meals", render: (d) => String(d.meals?.length ?? 0) },
        { label: "AI", render: (d) => (d.ai_generated ? "Yes" : "No") },
      ]}
    />
  );
}
