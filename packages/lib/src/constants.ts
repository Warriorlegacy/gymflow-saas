export const subscriptionPlans = [
  {
    code: "starter",
    name: "Starter",
    amount: 1499,
    features: [
      "Up to 150 members",
      "Basic attendance tracking",
      "WhatsApp reminders",
      "Manual payments",
      "Basic reports",
    ],
  },
  {
    code: "growth",
    name: "Growth",
    amount: 3499,
    features: [
      "Up to 500 members",
      "QR code check-ins",
      "AI diet & workout builder",
      "Trainer management",
      "Advanced analytics",
      "Priority WhatsApp support",
    ],
  },
  {
    code: "scale",
    name: "Enterprise",
    amount: 7999,
    features: [
      "Unlimited members",
      "Custom mobile app access",
      "API integrations",
      "Dedicated account manager",
      "SLA 99.9% uptime",
      "Multi-gym sync",
    ],
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
