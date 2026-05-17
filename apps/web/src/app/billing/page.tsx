import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { SimpleTable } from "@/components/simple-table";
import { Badge, Button } from "@gymflow/ui";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function getGymIdFromCookie(): string | null {
  try {
    const cookieStore = cookies();
    const ownerGym = cookieStore.get("gymflow_owner_gym")?.value;
    if (ownerGym) {
      const parsed = JSON.parse(ownerGym);
      return parsed.gym_id || null;
    }
    return null;
  } catch {
    return null;
  }
}

async function getBillingData() {
  const gymId = getGymIdFromCookie();

  if (!gymId) {
    return { gym: null, plans: [], payments: [] };
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const { data: gym } = await supabase
    .from("gyms")
    .select("*")
    .eq("gym_id", gymId)
    .single();
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("gym_id", gymId)
    .order("created_at", { ascending: false });
  const { data: payments } = await supabase
    .from("payments")
    .select("*, members(full_name)")
    .eq("gym_id", gymId)
    .order("paid_on", { ascending: false })
    .limit(10);

  return { gym, plans: plans || [], payments: payments || [] };
}

export default async function BillingPage() {
  const { gym, plans, payments } = await getBillingData();

  const currentPlan = gym
    ? {
        tier: gym.subscription_tier || "Starter",
        status: gym.subscription_status || "active",
        amount:
          gym.subscription_tier === "scale"
            ? 999
            : gym.subscription_tier === "growth"
              ? 499
              : 0,
        nextBilling: "2026-04-27",
        paymentMethod: "Demo",
      }
    : null;

  return (
    <AppShell
      heading="Billing"
      subheading="Manage your gym's SaaS subscription, view plans, and handle payments."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Current plan"
          description="Your gym's current SaaS subscription tier and status."
        >
          {currentPlan ? (
            <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-950">
                      {currentPlan.tier}
                    </h3>
                    <Badge className="bg-emerald-500/20 text-emerald-600 ring-emerald-500/20">
                      {currentPlan.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Rs. {currentPlan.amount}/month
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-950">
                    Next billing
                  </p>
                  <p className="text-sm text-slate-500">
                    {currentPlan.nextBilling}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button size="sm" variant="outline">
                  Change plan
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 p-6 text-center">
              <p className="text-slate-500">No subscription found</p>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Payment method"
          description="Manage your payment details."
        >
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6 text-slate-600"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-950">Payment Method</p>
                <p className="text-sm text-slate-500">
                  Add your payment method
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="mt-4 w-full">
              Add payment method
            </Button>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Your plans"
          description="Membership plans available at your gym."
        >
          {plans.length > 0 ? (
            <div className="grid gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-950">
                        {plan.name}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500">
                        {plan.duration_days} days
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">Rs. {plan.price}</p>
                      <Badge
                        className={
                          plan.is_active
                            ? "bg-emerald-500/20 text-emerald-600"
                            : "bg-slate-200"
                        }
                      >
                        {plan.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 p-6 text-center">
              <p className="text-slate-500">
                No plans yet. Add plans in the Plans section.
              </p>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Recent payments"
          description="Payment history at your gym."
        >
          {payments.length > 0 ? (
            <SimpleTable
              headers={["Date", "Member", "Amount", "Status"]}
              rows={payments.map((p) => [
                p.paid_on,
                p.members?.full_name || "Unknown",
                `Rs. ${p.amount}`,
                <Badge
                  key={p.id}
                  className={
                    p.status === "paid"
                      ? "bg-emerald-500/20 text-emerald-600"
                      : "bg-amber-500/20 text-amber-600"
                  }
                >
                  {p.status}
                </Badge>,
              ])}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 p-6 text-center">
              <p className="text-slate-500">No payments yet</p>
            </div>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
