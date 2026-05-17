import { subscriptionPlans } from "@gymflow/lib";

export function createDemoSubscription(tier: string) {
  const plan = subscriptionPlans.find((entry) => entry.code === tier);
  if (!plan) {
    throw new Error("Invalid subscription tier");
  }

  return {
    success: true,
    tier: plan.code,
    amount: plan.amount,
    message: `Subscription for ${plan.name} activated.`,
  };
}
