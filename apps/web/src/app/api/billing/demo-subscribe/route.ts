import { demoSubscriptionPlans } from "@gymflow/lib";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { tier: string };
    const { tier } = body;

    if (!tier) {
      return NextResponse.json(
        { error: "Missing tier parameter" },
        { status: 400 },
      );
    }

    const plan = demoSubscriptionPlans.find((entry) => entry.code === tier);
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid subscription tier" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      tier: plan.code,
      amount: plan.amount,
      message: `Demo subscription for ${plan.name} activated.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Subscription failed",
      },
      { status: 500 },
    );
  }
}
