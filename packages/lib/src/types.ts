export type BillingTier = "starter" | "growth" | "scale";
export type BillingStatus = "trial" | "active" | "past_due" | "cancelled";
export type MemberStatus = "active" | "inactive" | "expired" | "lead";
export type PaymentMethod = "cash" | "upi" | "card" | "bank" | "demo";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type UserRole = "owner" | "manager" | "trainer" | "staff";

export interface Gym {
  id: string;
  gym_id: string;
  name: string;
  slug: string;
  owner_email: string;
  phone: string;
  city: string;
  state: string;
  subscription_tier: BillingTier;
  subscription_status: BillingStatus;
}

export interface UserProfile {
  id: string;
  gym_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface Trainer {
  id: string;
  gym_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  specialty?: string;
  bio?: string;
  is_active: boolean;
}

export interface Plan {
  id: string;
  gym_id: string;
  name: string;
  duration_days: number;
  price: number;
  description?: string;
  is_active: boolean;
}

export interface Member {
  id: string;
  gym_id: string;
  full_name: string;
  email?: string;
  phone: string;
  gender?: string;
  joined_on: string;
  status: MemberStatus;
  primary_goal?: string;
  notes?: string;
  trainer_id?: string;
}

export interface Payment {
  id: string;
  gym_id: string;
  member_id: string;
  plan_id?: string;
  amount: number;
  paid_on: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference_code?: string;
}

export interface AttendanceRecord {
  id: string;
  gym_id: string;
  member_id: string;
  attended_on: string;
  check_in_time?: string;
  source: "manual" | "qr" | "mobile";
}

export interface Subscription {
  id: string;
  gym_id: string;
  member_id?: string;
  plan_id?: string;
  start_date: string;
  end_date: string;
  amount: number;
  billing_status: "trial" | "active" | "expiring" | "expired" | "cancelled";
  auto_renew: boolean;
}

export interface MessageLog {
  id: string;
  gym_id: string;
  member_id?: string;
  channel: "whatsapp" | "sms" | "email";
  message_type: "welcome" | "payment_reminder" | "expiry_reminder" | "campaign";
  recipient: string;
  content: string;
  delivery_status: "queued" | "sent" | "failed";
  sent_at?: string;
}

export interface WorkoutPlan {
  id: string;
  gym_id: string;
  member_id?: string;
  trainer_id?: string;
  title: string;
  goal?: string;
  schedule: Array<{
    day: string;
    focus: string;
    exercises: string[];
  }>;
  ai_generated: boolean;
}

export interface DietPlan {
  id: string;
  gym_id: string;
  member_id?: string;
  trainer_id?: string;
  title: string;
  objective?: string;
  meals: Array<{
    time: string;
    meal: string;
    items: string[];
  }>;
  ai_generated: boolean;
}

export interface AILog {
  id: string;
  gym_id: string;
  feature:
    | "chatbot"
    | "diet_plan"
    | "workout_plan"
    | "message_generator"
    | "report_summary";
  prompt: string;
  response?: string;
  created_at?: string;
}

export interface DashboardSnapshot {
  gym: Gym;
  metrics: {
    totalMembers: number;
    activeMembers: number;
    monthlyRevenue: number;
    expiringSubscriptions: number;
    todayAttendance: number;
    trainers: number;
  };
  recentMembers: Member[];
  pendingPayments: Payment[];
  expiringMembers: Array<
    Pick<Member, "id" | "full_name" | "phone"> & { end_date: string }
  >;
}
