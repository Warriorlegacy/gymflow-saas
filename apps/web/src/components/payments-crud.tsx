"use client";

import type { Member, Payment, Plan } from "@gymflow/lib";
import { currency } from "@gymflow/lib";
import { ResourceCrud } from "./resource-crud";

export function PaymentsCrud({ payments, members, plans }: { payments: Payment[]; members: Member[]; plans: Plan[] }) {
  const memberMap = new Map(members.map((member) => [member.id, member.full_name]));

  return (
    <ResourceCrud
      resource="payments"
      title="Payment"
      description="Manage collections and due tracking from the billing desk."
      initialItems={payments}
      emptyState="Cash, UPI, card, bank, or demo transaction records."
      initialForm={{
        member_id: members[0]?.id ?? "",
        plan_id: plans[0]?.id ?? "",
        amount: "0",
        paid_on: new Date().toISOString().slice(0, 10),
        method: "cash",
        status: "paid",
        reference_code: "",
        notes: ""
      }}
      fields={[
        { key: "member_id", label: "Member", type: "select", options: members.map((member) => ({ label: member.full_name, value: member.id })) },
        { key: "plan_id", label: "Plan", type: "select", options: plans.map((plan) => ({ label: plan.name, value: plan.id })) },
        { key: "amount", label: "Amount", type: "number" },
        { key: "paid_on", label: "Paid on", type: "date" },
        { key: "method", label: "Method", type: "select", options: ["cash", "upi", "card", "bank", "demo"].map((value) => ({ label: value, value })) },
        { key: "status", label: "Status", type: "select", options: ["paid", "pending", "failed", "refunded"].map((value) => ({ label: value, value })) },
        { key: "reference_code", label: "Reference code" },
        { key: "notes", label: "Notes", type: "textarea" }
      ]}
      columns={[
        { label: "Member", render: (payment) => memberMap.get(payment.member_id) ?? payment.member_id },
        { label: "Amount", render: (payment) => currency(payment.amount) },
        { label: "Method", render: (payment) => payment.method },
        { label: "Status", render: (payment) => payment.status },
        { label: "Paid on", render: (payment) => payment.paid_on }
      ]}
    />
  );
}

