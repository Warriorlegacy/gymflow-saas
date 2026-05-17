import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { SimpleTable } from "@/components/simple-table";
import { Badge, Button } from "@gymflow/ui";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const subscriptionTiers = [
  {
    code: "starter",
    name: "Starter",
    amount: 0,
    features: ["Up to 50 members", "Basic analytics", "Email support"],
  },
  {
    code: "growth",
    name: "Growth",
    amount: 499,
    features: [
      "Up to 200 members",
      "AI features",
      "WhatsApp automation",
      "Priority support",
    ],
  },
  {
    code: "scale",
    name: "Scale",
    amount: 999,
    features: [
      "Unlimited members",
      "All features",
      "Dedicated support",
      "Custom branding",
    ],
  },
];

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

async function getSettingsData() {
  const gymId = getGymIdFromCookie();

  if (!gymId) {
    return { gym: null };
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

  return { gym };
}

export default async function SettingsPage() {
  const { gym } = await getSettingsData();

  if (!gym) {
    return (
      <AppShell
        heading="Settings"
        subheading="Manage your gym profile and settings."
      >
        <div className="rounded-2xl border border-slate-200 p-6 text-center">
          <p className="text-slate-500">
            Unable to load settings. Please log in again.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      heading="Settings"
      subheading="Manage your gym profile, preferences, and account settings."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Gym profile"
          description="Your gym's basic information and contact details."
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-2xl font-bold text-brand-600">
                  {gym.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-950">
                    {gym.name}
                  </h3>
                  <p className="text-sm text-slate-500">@{gym.slug}</p>
                </div>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            </div>
            <SimpleTable
              headers={["Field", "Value"]}
              rows={[
                ["City", gym.city || "-"],
                ["State", gym.state || "-"],
                ["Phone", gym.phone || "-"],
                [
                  "Subscription",
                  `${gym.subscription_tier} / ${gym.subscription_status}`,
                ],
                ["Gym ID", gym.gym_id.slice(0, 8) + "..."],
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Account settings"
          description="Manage your account preferences and security."
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-950">
                    Email notifications
                  </h4>
                  <p className="text-sm text-slate-500">
                    Receive updates about your gym
                  </p>
                </div>
                <div className="h-6 w-11 rounded-full bg-brand-500 p-1 cursor-pointer">
                  <div className="h-4 w-4 rounded-full bg-white transition-transform translate-x-5" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-950">
                    WhatsApp alerts
                  </h4>
                  <p className="text-sm text-slate-500">
                    Get notified via WhatsApp
                  </p>
                </div>
                <div className="h-6 w-11 rounded-full bg-slate-200 p-1 cursor-pointer">
                  <div className="h-4 w-4 rounded-full bg-white transition-transform" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-950">
                    Two-factor auth
                  </h4>
                  <p className="text-sm text-slate-500">
                    Add extra security to your account
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Enable
                </Button>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Subscription plans"
          description="Available SaaS subscription tiers for your gym."
        >
          <div className="grid gap-3">
            {subscriptionTiers.map((plan) => {
              const isCurrent = plan.code === gym.subscription_tier;
              return (
                <div
                  key={plan.code}
                  className={`rounded-xl border p-4 ${isCurrent ? "border-brand-300 bg-brand-50/50" : "border-slate-200"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-950">
                          {plan.name}
                        </h4>
                        {isCurrent && (
                          <Badge className="bg-brand-500/20 text-brand-600 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {plan.features[0]}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      Rs. {plan.amount}
                      <span className="text-xs text-slate-500">/mo</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Danger zone"
          description="Irreversible actions for your account."
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-900">Delete gym</h4>
                  <p className="text-sm text-red-600">
                    Permanently delete all data
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-950">Export data</h4>
                  <p className="text-sm text-slate-500">
                    Download all your gym data
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Export
                </Button>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
