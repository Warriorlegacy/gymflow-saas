import Link from "next/link";
import { demoSubscriptionPlans } from "@gymflow/lib";
import { Badge, Button, Card, CardDescription, CardTitle } from "@gymflow/ui";

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-10 md:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <Badge>Built for free-tier deployment</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Run a gym business with one stack: members, billing, AI coaching, attendance, and WhatsApp.
              </h1>
              <p className="max-w-2xl text-lg text-slate-600">
                GymFlow ships as a sellable SaaS starter with Next.js 14, Supabase, Expo mobile, Ollama AI, and Baileys WhatsApp automation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button>Open Demo Dashboard</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Login Flow</Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {["Multi-tenant by gym_id", "Free AI with Ollama", "Expo mobile included"].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <Card className="relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(51,141,90,0.5),transparent_32%)]" />
            <div className="relative space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Control room</p>
                <h2 className="mt-3 text-3xl font-semibold">Modern gym operations without paid APIs.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Tenant-safe Supabase SQL",
                  "Trainer panel",
                  "Demo subscriptions",
                  "Attendance analytics",
                  "WhatsApp reminders",
                  "Docker + Vercel deploy"
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Demo billing</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Three tiers, zero payment gateway lock-in.</h2>
          </div>
          <p className="max-w-xl text-sm text-slate-600">Switch the logic to Razorpay or Stripe later. For now, the SaaS already supports starter, growth, and scale entitlements.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {demoSubscriptionPlans.map((plan) => (
            <Card key={plan.code} className="space-y-4">
              <div className="space-y-1">
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>Demo tier logic only</CardDescription>
              </div>
              <p className="text-4xl font-semibold">Rs. {plan.amount}</p>
              <ul className="space-y-2 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

