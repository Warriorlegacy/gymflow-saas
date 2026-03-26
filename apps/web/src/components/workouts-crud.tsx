"use client";

import type { Member, Trainer, WorkoutPlan } from "@gymflow/lib";
import { ResourceCrud } from "./resource-crud";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function WorkoutsCrud({
  workouts,
  members,
  trainers,
}: {
  workouts: WorkoutPlan[];
  members: Member[];
  trainers: Trainer[];
}) {
  const memberMap = new Map(members.map((m) => [m.id, m.full_name]));
  const trainerMap = new Map(trainers.map((t) => [t.id, t.full_name]));

  return (
    <ResourceCrud
      resource="workouts"
      title="Workout"
      description="Create workout plans and assign to members or let AI generate them."
      initialItems={workouts}
      emptyState="Workout plans support day-by-day scheduling with exercises."
      initialForm={{
        member_id: "",
        trainer_id: "",
        title: "",
        goal: "",
        ai_generated: false,
      }}
      fields={[
        { key: "title", label: "Title" },
        { key: "goal", label: "Goal" },
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
        { label: "Title", render: (w) => w.title },
        { label: "Goal", render: (w) => w.goal ?? "-" },
        {
          label: "Member",
          render: (w) =>
            w.member_id ? (memberMap.get(w.member_id) ?? "-") : "-",
        },
        {
          label: "Trainer",
          render: (w) =>
            w.trainer_id ? (trainerMap.get(w.trainer_id) ?? "-") : "-",
        },
        { label: "Days", render: (w) => String(w.schedule?.length ?? 0) },
        { label: "AI", render: (w) => (w.ai_generated ? "Yes" : "No") },
      ]}
    />
  );
}
