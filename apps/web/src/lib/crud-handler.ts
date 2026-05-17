import { NextResponse } from "next/server";
import { resourceSchemas } from "@gymflow/lib";
import { getGymIdFromRequest } from "@/lib/supabase-api";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

type ResourceType =
  | "members"
  | "plans"
  | "payments"
  | "attendance"
  | "trainers"
  | "workouts"
  | "diet-plans";

function getTableName(resource: ResourceType): string {
  return resource === "diet-plans" ? "diet_plans" : resource;
}

// Singleton Supabase client
let supabaseInstance: ReturnType<
  typeof import("@supabase/supabase-js").createClient
> | null = null;

async function getSupabaseClient() {
  if (!supabaseInstance) {
    const { createClient } = await import("@supabase/supabase-js");
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  }
  return supabaseInstance;
}

function validateInput(resource: ResourceType, data: unknown) {
  const schema = resourceSchemas[resource];
  if (!schema) return { success: true, data };
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map(
        (e) => `${e.path.join(".")}: ${e.message}`,
      ),
    };
  }
  return { success: true, data: result.data };
}

// Column selections for each resource type to avoid SELECT *
const columnSelections: Record<ResourceType, string> = {
  members:
    "id, gym_id, full_name, phone, email, status, primary_goal, joined_on, trainer_id, notes",
  plans: "id, gym_id, name, price, duration_days, description, is_active",
  payments:
    "id, gym_id, member_id, plan_id, amount, paid_on, method, status, reference_code",
  attendance: "id, gym_id, member_id, attended_on, check_in_time, source",
  trainers: "id, gym_id, full_name, email, phone, specialty, bio, is_active",
  workouts:
    "id, gym_id, member_id, trainer_id, title, goal, schedule, ai_generated",
  "diet-plans":
    "id, gym_id, member_id, trainer_id, title, objective, meals, ai_generated",
};

// Cache TTLs per resource (in seconds)
const cacheTTLs: Record<ResourceType, number> = {
  members: 10,
  plans: 30,
  payments: 10,
  attendance: 5,
  trainers: 30,
  workouts: 30,
  "diet-plans": 30,
};

function createCacheHeaders(resource: ResourceType): Record<string, string> {
  const ttl = cacheTTLs[resource] || 10;
  return {
    "Cache-Control": `private, max-age=${ttl}, stale-while-revalidate=${ttl * 2}`,
    Vary: "Cookie",
  };
}

export function createResourceHandler(resource: ResourceType) {
  return {
    GET: async (request: Request) => {
      const gymId = await getGymIdFromRequest();
      if (!gymId) {
        return NextResponse.json(
          { success: false, error: "Not authenticated" },
          { status: 401 },
        );
      }

      try {
        const supabase = await getSupabaseClient();
        const tableName = getTableName(resource);
        const columns = columnSelections[resource];

        // Parse pagination parameters from URL
        const url = new URL(request.url);
        const page = Math.max(
          1,
          parseInt(url.searchParams.get("page") || "1", 10),
        );
        const limit = Math.min(
          100,
          Math.max(1, parseInt(url.searchParams.get("limit") || "50", 10)),
        );
        const offset = (page - 1) * limit;

        // Get count and data in parallel
        const [countResult, dataResult] = await Promise.all([
          supabase
            .from(tableName)
            .select("id", { count: "exact", head: true })
            .eq("gym_id", gymId),
          supabase
            .from(tableName)
            .select(columns)
            .eq("gym_id", gymId)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1),
        ]);

        if (dataResult.error) {
          return NextResponse.json(
            { success: false, error: "Failed to fetch data" },
            { status: 500 },
          );
        }

        const total = countResult.count || 0;
        return NextResponse.json(
          {
            data: dataResult.data || [],
            pagination: {
              page,
              limit,
              total,
              hasMore: offset + limit < total,
            },
          },
          { headers: createCacheHeaders(resource) },
        );
      } catch {
        return NextResponse.json(
          { success: false, error: "Failed to fetch data" },
          { status: 500 },
        );
      }
    },

    POST: async (request: Request) => {
      const gymId = await getGymIdFromRequest();
      if (!gymId) {
        return NextResponse.json(
          { success: false, error: "Not authenticated" },
          { status: 401 },
        );
      }

      try {
        const body = await request.json();

        const validation = validateInput(resource, body);
        if (!validation.success) {
          return NextResponse.json(
            {
              success: false,
              error: `Validation failed: ${(validation as { errors: string[] }).errors.join(", ")}`,
            },
            { status: 400 },
          );
        }

        const supabase = await getSupabaseClient();
        const tableName = getTableName(resource);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from(tableName)
          .insert([{ ...body, gym_id: gymId }])
          .select()
          .single();

        if (error) {
          return NextResponse.json(
            { success: false, error: "Failed to create record" },
            { status: 400 },
          );
        }

        return NextResponse.json(
          { success: true, record: data },
          { headers: { "Cache-Control": "no-store" } },
        );
      } catch {
        return NextResponse.json(
          { success: false, error: "Failed to create record" },
          { status: 500 },
        );
      }
    },

    PUT: async (request: Request, { params }: { params: { id: string } }) => {
      const gymId = await getGymIdFromRequest();
      if (!gymId) {
        return NextResponse.json(
          { success: false, error: "Not authenticated" },
          { status: 401 },
        );
      }

      try {
        const body = await request.json();
        const id = params.id;

        // Validate UUID format
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
          return NextResponse.json(
            { success: false, error: "Invalid ID format" },
            { status: 400 },
          );
        }

        const validation = validateInput(resource, body);
        if (!validation.success) {
          return NextResponse.json(
            {
              success: false,
              error: `Validation failed: ${(validation as { errors: string[] }).errors.join(", ")}`,
            },
            { status: 400 },
          );
        }

        const supabase = await getSupabaseClient();
        const tableName = getTableName(resource);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from(tableName)
          .update(body)
          .eq("id", id)
          .eq("gym_id", gymId)
          .select()
          .single();

        if (error) {
          return NextResponse.json(
            { success: false, error: "Failed to update record" },
            { status: 400 },
          );
        }

        return NextResponse.json(
          { success: true, record: data },
          { headers: { "Cache-Control": "no-store" } },
        );
      } catch {
        return NextResponse.json(
          { success: false, error: "Failed to update record" },
          { status: 500 },
        );
      }
    },

    DELETE: async (
      request: Request,
      { params }: { params: { id: string } },
    ) => {
      const gymId = await getGymIdFromRequest();
      if (!gymId) {
        return NextResponse.json(
          { success: false, error: "Not authenticated" },
          { status: 401 },
        );
      }

      try {
        const id = params.id;

        // Validate UUID format
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
          return NextResponse.json(
            { success: false, error: "Invalid ID format" },
            { status: 400 },
          );
        }

        const supabase = await getSupabaseClient();
        const tableName = getTableName(resource);
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq("id", id)
          .eq("gym_id", gymId);

        if (error) {
          return NextResponse.json(
            { success: false, error: "Failed to delete record" },
            { status: 400 },
          );
        }

        return NextResponse.json(
          { success: true, id },
          { headers: { "Cache-Control": "no-store" } },
        );
      } catch {
        return NextResponse.json(
          { success: false, error: "Failed to delete record" },
          { status: 500 },
        );
      }
    },
  };
}
