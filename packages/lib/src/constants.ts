export const DEMO_GYM_ID = "00000000-0000-0000-0000-000000000001";

export const demoSubscriptionPlans = [
  {
    code: "starter",
    name: "Starter Demo",
    amount: 299,
    features: ["Up to 150 members", "WhatsApp reminders", "Basic reports"],
  },
  {
    code: "growth",
    name: "Growth Demo",
    amount: 499,
    features: ["Up to 500 members", "AI generator tools", "Trainer panel"],
  },
  {
    code: "scale",
    name: "Scale Demo",
    amount: 999,
    features: ["Unlimited members", "Mobile app access", "Advanced analytics"],
  },
] as const;

export const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/members", label: "Members" },
  { href: "/plans", label: "Plans" },
  { href: "/payments", label: "Payments" },
  { href: "/attendance", label: "Attendance" },
  { href: "/trainers", label: "Trainers" },
  { href: "/workouts", label: "Workouts" },
  { href: "/diet-plans", label: "Diet Plans" },
  { href: "/reports", label: "Reports" },
  { href: "/billing", label: "Billing" },
  { href: "/settings", label: "Settings" },
];
