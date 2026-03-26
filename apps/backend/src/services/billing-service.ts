import { demoSubscriptionPlans } from "@gymflow/lib";

export function createDemoSubscription(tier: string) {
  const plan = demoSubscriptionPlans.find((entry) => entry.code === tier);
  if (!plan) {
    throw new Error("Invalid demo tier");
  }

  return {
    success: true,
    tier: plan.code,
    amount: plan.amount,
    message: `Demo subscription for ${plan.name} activated.`
  };
}

