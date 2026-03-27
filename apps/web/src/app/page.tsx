import Link from "next/link";
import { demoSubscriptionPlans } from "@gymflow/lib";
import { Badge, Button, Card, CardDescription, CardTitle } from "@gymflow/ui";

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
            GF
          </div>
          <span className="text-lg font-semibold text-slate-950">GymFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Try Demo</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-10 md:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <Badge>Free-tier gym SaaS</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Run a gym business with one stack: members, billing, AI
                coaching, attendance, and WhatsApp.
              </h1>
              <p className="max-w-2xl text-lg text-slate-600">
                GymFlow ships as a sellable SaaS with Next.js 14, Supabase, Expo
                mobile, free AI (Groq + Gemini), and WhatsApp automation. Zero
                cost to run.
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
              {[
                "Multi-tenant by gym_id",
                "Free AI with Groq + Gemini",
                "Expo mobile included",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <Card className="relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(51,141,90,0.5),transparent_32%)]" />
            <div className="relative space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-200">
                  Control room
                </p>
                <h2 className="mt-3 text-3xl font-semibold">
                  Modern gym operations without paid APIs.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Tenant-safe Supabase SQL",
                  "Trainer panel",
                  "Demo subscriptions",
                  "Attendance analytics",
                  "WhatsApp reminders",
                  "Docker + Vercel deploy",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-20">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">
            Features
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">
            Everything you need to run a gym.
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-4">
          {[
            {
              title: "Member Management",
              desc: "CRUD with status tracking, goals, and trainer assignment.",
            },
            {
              title: "Attendance Tracking",
              desc: "Manual, QR, or mobile check-ins per tenant.",
            },
            {
              title: "Payment Collection",
              desc: "Cash, UPI, card, bank tracking with plan linking.",
            },
            {
              title: "AI Coaching",
              desc: "Free AI workout plans, diet plans, and message generation.",
            },
            {
              title: "WhatsApp Automation",
              desc: "Reminders for payments, expiring memberships, welcome.",
            },
            {
              title: "Reports & Analytics",
              desc: "Subscription health, coaching output, retention metrics.",
            },
            {
              title: "Mobile App",
              desc: "Expo React Native for attendance, payments, members on the go.",
            },
            {
              title: "Trainer Panel",
              desc: "Manage coaches, specialties, and client allocations.",
            },
          ].map((item) => (
            <Card key={item.title} className="space-y-2">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.desc}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-20">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">
            Demo billing
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">
            Three tiers, zero payment gateway lock-in.
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Switch the logic to Razorpay or Stripe later. For now, the SaaS
            already supports starter, growth, and scale entitlements.
          </p>
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
              <Link href="/login">
                <Button className="w-full">Get Started</Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-20">
        <Card className="bg-slate-950 text-white">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div className="space-y-4">
              <Badge className="bg-white/10 text-white">Zero cost stack</Badge>
              <h2 className="text-3xl font-semibold">
                Deploy for free. Sell for profit.
              </h2>
              <p className="text-slate-300">
                GymFlow uses only free-tier services: Vercel (web), Supabase
                (database + auth), Groq + Gemini (AI), Baileys (WhatsApp), and
                Expo (mobile). No monthly costs to run the demo or first
                customers.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard">
                  <Button variant="secondary">Try Demo</Button>
                </Link>
                <Link href="/onboarding">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Create Gym Tenant
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-3 text-sm text-slate-300">
              {[
                "Vercel free tier - web hosting",
                "Supabase free tier - 500MB DB + auth",
                "Groq free tier - 30 req/min AI",
                "Gemini free tier - 60 req/min AI",
                "Baileys - WhatsApp Web, free",
                "Expo free tier - mobile builds",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <footer className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          GymFlow SaaS - Built for free-tier deployment
        </div>
      </footer>
    </main>
  );
}
