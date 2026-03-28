import Link from "next/link";
import { demoSubscriptionPlans } from "@gymflow/lib";
import { Badge, Button, Card, CardDescription, CardTitle } from "@gymflow/ui";

/* ─── Icon SVGs (inline to avoid extra deps) ─── */
const icons = {
  members: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  attendance: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="m9 16 2 2 4-4" />
    </svg>
  ),
  payments: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  ai: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M12 2a4 4 0 0 1 4 4v1a1 1 0 0 0 1 1h1a4 4 0 0 1 0 8h-1a1 1 0 0 0-1 1v1a4 4 0 0 1-8 0v-1a1 1 0 0 0-1-1H6a4 4 0 0 1 0-8h1a1 1 0 0 0 1-1V6a4 4 0 0 1 4-4z" />
    </svg>
  ),
  whatsapp: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  reports: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  mobile: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><line x1="12" x2="12.01" y1="18" y2="18" />
    </svg>
  ),
  trainer: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-brand-500">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  arrow: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  ),
  star: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-amber-400">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  ),
  zap: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  shield: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  globe: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

const features = [
  { title: "Member Management", desc: "Full CRUD with status tracking, goals, trainer assignment, and lead nurturing.", icon: icons.members },
  { title: "Attendance Tracking", desc: "Manual, QR, or mobile check-ins filtered by tenant with daily analytics.", icon: icons.attendance },
  { title: "Payment Collection", desc: "Cash, UPI, card, bank transfer tracking with automated plan linking.", icon: icons.payments },
  { title: "AI Coaching", desc: "Free AI-generated workout plans, diet plans, and personalized messages.", icon: icons.ai },
  { title: "WhatsApp Automation", desc: "Automated reminders for payments, expiring memberships, and welcome flows.", icon: icons.whatsapp },
  { title: "Reports & Analytics", desc: "Subscription health, coaching output, retention metrics, and revenue trends.", icon: icons.reports },
  { title: "Mobile App", desc: "Expo React Native app for attendance, payments, and member management on the go.", icon: icons.mobile },
  { title: "Trainer Panel", desc: "Manage coaches, specialties, client allocations, and performance tracking.", icon: icons.trainer },
];

const trustNumbers = [
  { value: "186+", label: "Demo Members" },
  { value: "₹1.28L", label: "Monthly Revenue" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 200ms", label: "API Response" },
];

const stackItems = [
  { name: "Vercel", detail: "Web hosting — free tier", color: "bg-slate-900 text-white" },
  { name: "Supabase", detail: "Database + Auth — 500MB free", color: "bg-emerald-600 text-white" },
  { name: "Groq", detail: "AI inference — 30 req/min free", color: "bg-orange-500 text-white" },
  { name: "Gemini", detail: "AI fallback — 60 req/min free", color: "bg-blue-500 text-white" },
  { name: "Baileys", detail: "WhatsApp Web — open source", color: "bg-green-600 text-white" },
  { name: "Expo", detail: "Mobile builds — free tier", color: "bg-violet-600 text-white" },
];

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      {/* ─── Navbar ─── */}
      <header className="glass sticky top-0 z-50 border-b border-slate-200/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 shadow-sm border border-brand-100 overflow-hidden transition-transform duration-200 group-hover:scale-105">
              <img src="/icons/icon.png" alt="GF" className="h-full w-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              GymFlow
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Features</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Pricing</a>
            <a href="#stack" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Stack</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">
                Try Demo
                <span className="ml-1.5">{icons.arrow}</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative bg-hero-glow bg-dots">
        <div className="absolute inset-0 bg-hero-glow-right" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-4 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24 lg:flex-row lg:items-center">
          {/* Left column */}
          <div className="flex-1 space-y-8 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <Badge>
                <span className="inline-block h-2 w-2 rounded-full bg-brand-500 animate-pulse-glow" />
                Now available
              </Badge>
              <span className="text-xs font-medium text-slate-500">v1.0 — Free tier SaaS</span>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
                Run your entire gym from{" "}
                <span className="gradient-text">one platform.</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                Members, billing, AI coaching, attendance, WhatsApp automation, and a mobile app — shipped as a sellable SaaS on free-tier infrastructure.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button size="lg" className="animate-pulse-glow">
                  Open Demo Dashboard
                  <span className="ml-2">{icons.arrow}</span>
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  Login Flow
                </Button>
              </Link>
            </div>

            {/* Trust numbers */}
            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
              {trustNumbers.map((item, i) => (
                <div key={item.label} className={`animate-fade-in-up delay-${(i + 2) * 100}`}>
                  <p className="text-2xl font-bold tracking-tight text-slate-900">{item.value}</p>
                  <p className="text-xs font-medium text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — hero card */}
          <div className="flex-1 animate-slide-right delay-200">
            <div className="relative rounded-3xl bg-slate-950 p-8 shadow-2xl ring-1 ring-white/10 lg:p-10">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(51,141,90,0.3),transparent_50%)]" />
              <div className="relative space-y-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-300">
                    Control Room
                  </p>
                  <h2 className="mt-3 text-2xl font-bold leading-snug text-white lg:text-3xl">
                    Modern gym operations{" "}
                    <span className="gradient-text-white">without paid APIs.</span>
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Tenant-safe Supabase SQL",
                    "Trainer management panel",
                    "Demo subscriptions",
                    "Attendance analytics",
                    "WhatsApp reminders",
                    "Docker + Vercel deploy",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      <span className="text-brand-400">{icons.check}</span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-brand-600/20 px-4 py-3">
                  <span className="text-brand-400">{icons.zap}</span>
                  <p className="text-sm font-medium text-brand-200">
                    Zero infrastructure cost — runs entirely on free tiers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Logos / trust bar ─── */}
      <section className="border-y border-slate-200/60 bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 overflow-x-auto px-4 py-5 md:px-8">
          {["Multi-tenant by gym_id", "Free AI — Groq + Gemini", "Expo mobile included", "Supabase Auth", "Vercel Edge"].map((item) => (
            <div
              key={item}
              className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-500"
            >
              <span className="text-brand-500">{icons.check}</span>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="mb-14 max-w-2xl animate-fade-in-up">
          <Badge>Features</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Everything you need to run a gym.
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">
            From member onboarding to AI-powered coaching — every tool a gym owner needs, in one place.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, i) => (
            <div
              key={item.title}
              className={`card-hover group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card animate-fade-in-up delay-${(i % 4) * 100 + 100}`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
                {item.icon}
              </div>
              <CardTitle className="mb-2">{item.title}</CardTitle>
              <CardDescription>{item.desc}</CardDescription>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="bg-slate-50/80 bg-grid">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <div className="mb-14 max-w-2xl animate-fade-in-up">
            <Badge>Pricing</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Three tiers, zero payment gateway lock-in.
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-slate-600">
              Switch the logic to Razorpay or Stripe later. The SaaS already supports starter, growth, and scale entitlements out of the box.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {demoSubscriptionPlans.map((plan, i) => {
              const isPopular = plan.code === "growth";
              return (
                <div
                  key={plan.code}
                  className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 animate-fade-in-up delay-${(i + 1) * 100} ${
                    isPopular
                      ? "pricing-popular text-white shadow-2xl ring-1 ring-white/10 scale-[1.02] lg:scale-105"
                      : "border border-slate-200/80 bg-white shadow-card hover:shadow-card-hover"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-brand-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-6 space-y-2">
                    <h3 className={`text-lg font-semibold ${isPopular ? "text-white" : "text-slate-900"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${isPopular ? "text-slate-300" : "text-slate-500"}`}>
                      Demo tier logic only
                    </p>
                  </div>
                  <div className="mb-6">
                    <span className={`text-5xl font-extrabold tracking-tight ${isPopular ? "text-white" : "text-slate-900"}`}>
                      ₹{plan.amount}
                    </span>
                    <span className={`ml-1 text-sm ${isPopular ? "text-slate-400" : "text-slate-500"}`}>/month</span>
                  </div>
                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className={`mt-0.5 ${isPopular ? "text-brand-300" : ""}`}>{icons.check}</span>
                        <span className={`text-sm ${isPopular ? "text-slate-200" : "text-slate-600"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/login" className="block">
                    <Button
                      className="w-full"
                      variant={isPopular ? "secondary" : "default"}
                      size="lg"
                    >
                      Get Started
                      <span className="ml-2">{icons.arrow}</span>
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Tech Stack / CTA ─── */}
      <section id="stack" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="overflow-hidden rounded-3xl bg-slate-950 shadow-2xl ring-1 ring-white/10">
          <div className="relative px-8 py-16 md:px-16 md:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(51,141,90,0.2),transparent_50%)]" />
            <div className="relative grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div className="space-y-6 animate-fade-in-up">
                <Badge className="bg-white/10 text-white ring-white/10">Zero cost infrastructure</Badge>
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Deploy for free.{" "}
                  <span className="gradient-text-white">Sell for profit.</span>
                </h2>
                <p className="max-w-lg text-lg leading-relaxed text-slate-300">
                  GymFlow runs entirely on free-tier services. No monthly hosting costs to run the demo or onboard your first customers.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/dashboard">
                    <Button variant="secondary" size="lg">
                      Try Demo Dashboard
                      <span className="ml-2">{icons.arrow}</span>
                    </Button>
                  </Link>
                  <Link href="/onboarding">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                    >
                      Create Gym Tenant
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-3 animate-slide-right delay-200">
                {stackItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 transition hover:bg-white/10"
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${item.color}`}>
                      {item.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Social proof ─── */}
      <section className="border-t border-slate-200/60 bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <div className="text-center animate-fade-in-up">
            <div className="mb-6 flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i}>{icons.star}</span>
              ))}
            </div>
            <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-slate-700 md:text-2xl">
              &ldquo;GymFlow replaced three separate tools we were paying for. The AI coaching feature alone saves us hours every week.&rdquo;
            </p>
            <div className="mt-6">
              <p className="font-semibold text-slate-900">Aarav Sharma</p>
              <p className="text-sm text-slate-500">Owner, GymFlow Demo Fitness — Bengaluru</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-12 text-center shadow-lg md:px-16 md:py-16 animate-scale-in">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Ready to streamline your gym operations?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-brand-100">
            Get started in minutes. No credit card required. Deploy on free-tier infrastructure today.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/dashboard">
              <Button variant="secondary" size="lg">
                Start Free Demo
                <span className="ml-2">{icons.arrow}</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 shadow-sm border border-brand-100 overflow-hidden">
                  <img src="/icons/icon.png" alt="GF" className="h-full w-full object-cover" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">GymFlow</span>
              </div>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
                All-in-one gym management SaaS built on free-tier services. Members, billing, AI coaching, attendance, and WhatsApp — one platform.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Product</h4>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li><a href="#features" className="transition hover:text-slate-900">Features</a></li>
                <li><a href="#pricing" className="transition hover:text-slate-900">Pricing</a></li>
                <li><a href="#stack" className="transition hover:text-slate-900">Tech Stack</a></li>
                <li><Link href="/dashboard" className="transition hover:text-slate-900">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Resources</h4>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li><Link href="/login" className="transition hover:text-slate-900">Login</Link></li>
                <li><Link href="/onboarding" className="transition hover:text-slate-900">Create Tenant</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between border-t border-slate-200/60 pt-6">
            <p className="text-xs text-slate-400">
              © 2026 GymFlow SaaS. Built for free-tier deployment.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {icons.shield}
              <span>SOC 2 Ready</span>
              <span className="mx-2 text-slate-300">•</span>
              {icons.globe}
              <span>Multi-tenant</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
