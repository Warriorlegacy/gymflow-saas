import type {
  AttendanceRecord,
  DashboardSnapshot,
  DietPlan,
  Gym,
  Member,
  Payment,
  Plan,
  Subscription,
  Trainer,
  UserProfile,
  WorkoutPlan
} from "./types";
import { DEMO_GYM_ID } from "./constants";

export const demoGym: Gym = {
  id: DEMO_GYM_ID,
  gym_id: DEMO_GYM_ID,
  name: "GymFlow Demo Fitness",
  slug: "gymflow-demo",
  owner_email: "owner@gymflow.demo",
  phone: "+91 99999 99999",
  city: "Bengaluru",
  state: "Karnataka",
  subscription_tier: "growth",
  subscription_status: "active"
};

export const demoUser: UserProfile = {
  id: "10000000-0000-0000-0000-000000000001",
  gym_id: DEMO_GYM_ID,
  full_name: "Aarav Sharma",
  email: "owner@gymflow.demo",
  role: "owner",
  phone: "+91 99999 99999"
};

export const demoTrainers: Trainer[] = [
  {
    id: "30000000-0000-0000-0000-000000000001",
    gym_id: DEMO_GYM_ID,
    full_name: "Neha Verma",
    email: "neha@gymflow.demo",
    phone: "+91 90000 00001",
    specialty: "Strength & conditioning",
    bio: "Focuses on strength cycles and onboarding assessments.",
    is_active: true
  },
  {
    id: "30000000-0000-0000-0000-000000000002",
    gym_id: DEMO_GYM_ID,
    full_name: "Rohan Das",
    email: "rohan@gymflow.demo",
    phone: "+91 90000 00002",
    specialty: "Fat loss and nutrition",
    bio: "Runs body recomposition and sustainable meal plans.",
    is_active: true
  }
];

export const demoPlans: Plan[] = [
  { id: "40000000-0000-0000-0000-000000000001", gym_id: DEMO_GYM_ID, name: "Monthly", duration_days: 30, price: 1499, description: "Flexible monthly membership", is_active: true },
  { id: "40000000-0000-0000-0000-000000000002", gym_id: DEMO_GYM_ID, name: "Quarterly", duration_days: 90, price: 3999, description: "Best for habit building", is_active: true },
  { id: "40000000-0000-0000-0000-000000000003", gym_id: DEMO_GYM_ID, name: "Annual", duration_days: 365, price: 14999, description: "Highest retention and loyalty", is_active: true }
];

export const demoMembers: Member[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    gym_id: DEMO_GYM_ID,
    full_name: "Priya Nair",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    gender: "Female",
    joined_on: "2026-01-15",
    status: "active",
    primary_goal: "Weight loss",
    trainer_id: demoTrainers[1].id
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    gym_id: DEMO_GYM_ID,
    full_name: "Rahul Mehta",
    email: "rahul@example.com",
    phone: "+91 98765 43211",
    gender: "Male",
    joined_on: "2026-02-11",
    status: "active",
    primary_goal: "Muscle gain",
    trainer_id: demoTrainers[0].id
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    gym_id: DEMO_GYM_ID,
    full_name: "Isha Rao",
    phone: "+91 98765 43212",
    gender: "Female",
    joined_on: "2026-03-01",
    status: "lead",
    primary_goal: "Postpartum fitness"
  }
];

export const demoPayments: Payment[] = [
  {
    id: "50000000-0000-0000-0000-000000000001",
    gym_id: DEMO_GYM_ID,
    member_id: demoMembers[0].id,
    plan_id: demoPlans[1].id,
    amount: 3999,
    paid_on: "2026-03-05",
    method: "upi",
    status: "paid",
    reference_code: "UPI-3934"
  },
  {
    id: "50000000-0000-0000-0000-000000000002",
    gym_id: DEMO_GYM_ID,
    member_id: demoMembers[1].id,
    plan_id: demoPlans[0].id,
    amount: 1499,
    paid_on: "2026-03-20",
    method: "cash",
    status: "pending",
    reference_code: "CASH-104"
  }
];

export const demoAttendance: AttendanceRecord[] = [
  {
    id: "60000000-0000-0000-0000-000000000001",
    gym_id: DEMO_GYM_ID,
    member_id: demoMembers[0].id,
    attended_on: "2026-03-25",
    check_in_time: "2026-03-25T06:35:00.000Z",
    source: "mobile"
  },
  {
    id: "60000000-0000-0000-0000-000000000002",
    gym_id: DEMO_GYM_ID,
    member_id: demoMembers[1].id,
    attended_on: "2026-03-25",
    check_in_time: "2026-03-25T18:10:00.000Z",
    source: "manual"
  }
];

export const demoSubscriptions: Subscription[] = [
  {
    id: "70000000-0000-0000-0000-000000000001",
    gym_id: DEMO_GYM_ID,
    member_id: demoMembers[0].id,
    plan_id: demoPlans[1].id,
    start_date: "2026-03-05",
    end_date: "2026-06-03",
    amount: 3999,
    billing_status: "active",
    auto_renew: false
  },
  {
    id: "70000000-0000-0000-0000-000000000002",
    gym_id: DEMO_GYM_ID,
    member_id: demoMembers[1].id,
    plan_id: demoPlans[0].id,
    start_date: "2026-03-20",
    end_date: "2026-04-19",
    amount: 1499,
    billing_status: "expiring",
    auto_renew: false
  }
];

export const demoWorkouts: WorkoutPlan[] = [
  {
    id: "80000000-0000-0000-0000-000000000001",
    gym_id: DEMO_GYM_ID,
    member_id: demoMembers[1].id,
    trainer_id: demoTrainers[0].id,
    title: "Lean bulk split",
    goal: "Muscle gain",
    ai_generated: true,
    schedule: [
      { day: "Monday", focus: "Push", exercises: ["Bench press", "Shoulder press", "Triceps rope pushdown"] },
      { day: "Wednesday", focus: "Pull", exercises: ["Lat pulldown", "Barbell row", "Hammer curl"] },
      { day: "Friday", focus: "Legs", exercises: ["Squat", "Romanian deadlift", "Walking lunges"] }
    ]
  }
];

export const demoDietPlans: DietPlan[] = [
  {
    id: "90000000-0000-0000-0000-000000000001",
    gym_id: DEMO_GYM_ID,
    member_id: demoMembers[0].id,
    trainer_id: demoTrainers[1].id,
    title: "Fat loss meal rhythm",
    objective: "Weight loss",
    ai_generated: true,
    meals: [
      { time: "7:30 AM", meal: "Breakfast", items: ["Oats", "Greek yogurt", "Berries"] },
      { time: "1:00 PM", meal: "Lunch", items: ["Grilled paneer", "Brown rice", "Salad"] },
      { time: "7:30 PM", meal: "Dinner", items: ["Dal soup", "Sauteed vegetables", "Millet roti"] }
    ]
  }
];

export const demoDashboardSnapshot: DashboardSnapshot = {
  gym: demoGym,
  metrics: {
    totalMembers: 186,
    activeMembers: 143,
    monthlyRevenue: 128400,
    expiringSubscriptions: 12,
    todayAttendance: 67,
    trainers: demoTrainers.length
  },
  recentMembers: demoMembers,
  pendingPayments: demoPayments.filter((payment) => payment.status === "pending"),
  expiringMembers: [
    { id: demoMembers[1].id, full_name: demoMembers[1].full_name, phone: demoMembers[1].phone, end_date: "2026-04-19" }
  ]
};

