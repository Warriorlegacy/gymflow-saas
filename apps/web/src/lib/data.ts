import { cookies } from "next/headers";
import type {
  Member,
  Trainer,
  Plan,
  Payment,
  AttendanceRecord,
  Subscription,
  WorkoutPlan,
  DietPlan,
} from "@gymflow/lib";

let supabaseInstance: ReturnType<
  typeof import("@supabase/supabase-js").createClient
> | null = null;

async function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration");
  }

  const { createClient } = await import("@supabase/supabase-js");
  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  return supabaseInstance;
}

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

export async function getDashboardData() {
  const gymId = getGymIdFromCookie();
  if (!gymId) throw new Error("Not authenticated");

  const supabase = await getSupabaseClient();
  const today = new Date().toISOString().split("T")[0];

  const [
    gymResult,
    membersResult,
    trainersResult,
    attendanceResult,
    subscriptionsResult,
    paymentsResult,
  ] = await Promise.all([
    supabase.from("gyms").select("gym_id, name").eq("gym_id", gymId).single(),
    supabase
      .from("members")
      .select(
        "id, gym_id, full_name, phone, email, status, primary_goal, joined_on, trainer_id, notes",
      )
      .eq("gym_id", gymId)
      .order("joined_on", { ascending: false })
      .limit(100),
    supabase.from("trainers").select("id").eq("gym_id", gymId),
    supabase
      .from("attendance")
      .select("id, member_id, attended_on")
      .eq("gym_id", gymId)
      .eq("attended_on", today),
    supabase
      .from("subscriptions")
      .select("id, member_id, amount, end_date, billing_status")
      .eq("gym_id", gymId)
      .eq("billing_status", "active"),
    supabase
      .from("payments")
      .select("id, amount, paid_on, method")
      .eq("gym_id", gymId)
      .order("paid_on", { ascending: false })
      .limit(5),
  ]);

  const gym = gymResult.data;
  const members = (membersResult.data || []) as Member[];
  const trainers = trainersResult.data || [];
  const todayAttendance = attendanceResult.data || [];
  const subscriptions = (subscriptionsResult.data || []) as Subscription[];
  const recentPayments = (paymentsResult.data || []) as Payment[];

  let totalMembers = members.length;
  let activeMembers = 0;
  for (let i = 0; i < members.length; i++) {
    if (members[i].status === "active") activeMembers++;
  }

  let monthlyRevenue = 0;
  let expiringSoon = 0;
  const now = Date.now();

  for (const s of subscriptions) {
    monthlyRevenue += Number(s.amount) || 0;
    const endDate = new Date(s.end_date).getTime();
    const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      expiringSoon++;
    }
  }

  return {
    gym: gym || { name: "Your Gym" },
    metrics: {
      totalMembers,
      activeMembers,
      monthlyRevenue,
      todayAttendance: todayAttendance.length,
      expiringSubscriptions: expiringSoon,
      trainers: trainers.length,
    },
    recentMembers: members.slice(0, 5).map((m) => ({
      id: m.id,
      full_name: m.full_name,
      phone: m.phone,
      status: m.status,
      primary_goal: m.primary_goal,
    })),
    expiringMembers: subscriptions
      .filter((s) => {
        const endDate = new Date(s.end_date).getTime();
        const daysUntilExpiry = Math.ceil(
          (endDate - now) / (1000 * 60 * 60 * 24),
        );
        return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
      })
      .slice(0, 10)
      .map((s) => ({
        id: s.id,
        full_name: "Member",
        end_date: s.end_date,
        phone: "",
      })),
    recentPayments: recentPayments.map((p) => ({
      id: p.id,
      member: "Member",
      amount: p.amount,
      paid_on: p.paid_on,
      method: p.method,
    })),
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export async function getMembersData(
  params?: PaginationParams,
): Promise<Member[]> {
  const gymId = getGymIdFromCookie();
  if (!gymId) return [];

  const supabase = await getSupabaseClient();
  const page = params?.page || 1;
  const limit = params?.limit || 50;
  const offset = (page - 1) * limit;

  const { data } = await supabase
    .from("members")
    .select(
      "id, gym_id, full_name, phone, email, status, primary_goal, joined_on, trainer_id, notes",
    )
    .eq("gym_id", gymId)
    .order("joined_on", { ascending: false })
    .range(offset, offset + limit - 1);
  return (data || []) as Member[];
}

export async function getMembersDataPaginated(
  params?: PaginationParams,
): Promise<PaginatedResult<Member>> {
  const gymId = getGymIdFromCookie();
  if (!gymId)
    return {
      data: [],
      pagination: { page: 1, limit: 50, total: 0, hasMore: false },
    };

  const supabase = await getSupabaseClient();
  const page = params?.page || 1;
  const limit = params?.limit || 50;
  const offset = (page - 1) * limit;

  const [countResult, dataResult] = await Promise.all([
    supabase
      .from("members")
      .select("id", { count: "exact", head: true })
      .eq("gym_id", gymId),
    supabase
      .from("members")
      .select(
        "id, gym_id, full_name, phone, email, status, primary_goal, joined_on, trainer_id, notes",
      )
      .eq("gym_id", gymId)
      .order("joined_on", { ascending: false })
      .range(offset, offset + limit - 1),
  ]);

  const total = countResult.count || 0;
  return {
    data: (dataResult.data || []) as Member[],
    pagination: {
      page,
      limit,
      total,
      hasMore: offset + limit < total,
    },
  };
}

export async function getPlansData(params?: PaginationParams): Promise<Plan[]> {
  const gymId = getGymIdFromCookie();
  if (!gymId) return [];

  const supabase = await getSupabaseClient();
  const page = params?.page || 1;
  const limit = params?.limit || 50;
  const offset = (page - 1) * limit;

  const { data } = await supabase
    .from("plans")
    .select("id, gym_id, name, price, duration_days, description, is_active")
    .eq("gym_id", gymId)
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1);
  return (data || []) as Plan[];
}

export async function getPaymentsData(
  params?: PaginationParams,
): Promise<Payment[]> {
  const gymId = getGymIdFromCookie();
  if (!gymId) return [];

  const supabase = await getSupabaseClient();
  const page = params?.page || 1;
  const limit = params?.limit || 50;
  const offset = (page - 1) * limit;

  const { data } = await supabase
    .from("payments")
    .select(
      "id, gym_id, member_id, plan_id, amount, paid_on, method, status, reference_code",
    )
    .eq("gym_id", gymId)
    .order("paid_on", { ascending: false })
    .range(offset, offset + limit - 1);
  return (data || []) as Payment[];
}

export async function getAttendanceData(
  params?: PaginationParams,
): Promise<AttendanceRecord[]> {
  const gymId = getGymIdFromCookie();
  if (!gymId) return [];

  const supabase = await getSupabaseClient();
  const page = params?.page || 1;
  const limit = params?.limit || 50;
  const offset = (page - 1) * limit;

  const { data } = await supabase
    .from("attendance")
    .select("id, gym_id, member_id, attended_on, check_in_time, source")
    .eq("gym_id", gymId)
    .order("attended_on", { ascending: false })
    .range(offset, offset + limit - 1);
  return (data || []) as AttendanceRecord[];
}

export async function getTrainersData(
  params?: PaginationParams,
): Promise<Trainer[]> {
  const gymId = getGymIdFromCookie();
  if (!gymId) return [];

  const supabase = await getSupabaseClient();
  const page = params?.page || 1;
  const limit = params?.limit || 50;
  const offset = (page - 1) * limit;

  const { data } = await supabase
    .from("trainers")
    .select("id, gym_id, full_name, email, phone, specialty, bio, is_active")
    .eq("gym_id", gymId)
    .order("full_name", { ascending: true })
    .range(offset, offset + limit - 1);
  return (data || []) as Trainer[];
}

export async function getWorkoutsData(
  params?: PaginationParams,
): Promise<WorkoutPlan[]> {
  const gymId = getGymIdFromCookie();
  if (!gymId) return [];

  const supabase = await getSupabaseClient();
  const page = params?.page || 1;
  const limit = params?.limit || 50;
  const offset = (page - 1) * limit;

  const { data } = await supabase
    .from("workouts")
    .select(
      "id, gym_id, member_id, trainer_id, title, goal, schedule, ai_generated",
    )
    .eq("gym_id", gymId)
    .order("title", { ascending: true })
    .range(offset, offset + limit - 1);
  return (data || []) as WorkoutPlan[];
}

export async function getDietPlansData(
  params?: PaginationParams,
): Promise<DietPlan[]> {
  const gymId = getGymIdFromCookie();
  if (!gymId) return [];

  const supabase = await getSupabaseClient();
  const page = params?.page || 1;
  const limit = params?.limit || 50;
  const offset = (page - 1) * limit;

  const { data } = await supabase
    .from("diet_plans")
    .select(
      "id, gym_id, member_id, trainer_id, title, objective, meals, ai_generated",
    )
    .eq("gym_id", gymId)
    .order("title", { ascending: true })
    .range(offset, offset + limit - 1);
  return (data || []) as DietPlan[];
}

export async function getReportsData() {
  const gymId = getGymIdFromCookie();
  if (!gymId)
    return {
      subscriptions: [] as Subscription[],
      workouts: [] as WorkoutPlan[],
      dietPlans: [] as DietPlan[],
    };

  const supabase = await getSupabaseClient();

  const [subscriptionsResult, workoutsResult, dietPlansResult] =
    await Promise.all([
      supabase
        .from("subscriptions")
        .select(
          "id, gym_id, member_id, plan_id, start_date, end_date, amount, billing_status, auto_renew",
        )
        .eq("gym_id", gymId)
        .limit(100),
      supabase
        .from("workouts")
        .select(
          "id, gym_id, member_id, trainer_id, title, goal, schedule, ai_generated",
        )
        .eq("gym_id", gymId)
        .limit(100),
      supabase
        .from("diet_plans")
        .select(
          "id, gym_id, member_id, trainer_id, title, objective, meals, ai_generated",
        )
        .eq("gym_id", gymId)
        .limit(100),
    ]);

  return {
    subscriptions: (subscriptionsResult.data || []) as Subscription[],
    workouts: (workoutsResult.data || []) as WorkoutPlan[],
    dietPlans: (dietPlansResult.data || []) as DietPlan[],
  };
}

export async function getBillingPlans(): Promise<Plan[]> {
  const gymId = getGymIdFromCookie();
  if (!gymId) return [];

  const supabase = await getSupabaseClient();
  const { data } = await supabase
    .from("plans")
    .select("id, gym_id, name, price, duration_days, description, is_active")
    .eq("gym_id", gymId)
    .eq("is_active", true)
    .order("price", { ascending: true });
  return (data || []) as Plan[];
}

export async function getCurrentUser() {
  const gymId = getGymIdFromCookie();
  if (!gymId) return null;

  const supabase = await getSupabaseClient();
  const { data } = await supabase
    .from("gyms")
    .select("gym_id, name")
    .eq("gym_id", gymId)
    .single();
  return data;
}
