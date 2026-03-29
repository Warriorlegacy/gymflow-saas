import { NextResponse } from "next/server";
import { resourceSchemas } from "@gymflow/lib";
import { getSupabaseClient, getGymIdFromRequest } from "@/lib/supabase-api";

type ResourceType =
  | "members"
  | "plans"
  | "payments"
  | "attendance"
  | "trainers"
  | "workouts"
  | "diet-plans";

const fallbackData: Record<ResourceType, any[]> = {
  members: [],
  plans: [],
  payments: [],
  attendance: [],
  trainers: [],
  workouts: [],
  "diet-plans": [],
};

function getTableName(resource: ResourceType): string {
  return resource === "diet-plans" ? "diet_plans" : resource;
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

export function createResourceHandler(resource: ResourceType) {
  return {
    GET: async (request: Request) => {
      const gymId = getGymIdFromRequest();
      const supabase = getSupabaseClient();

      if (!supabase) {
        return NextResponse.json(fallbackData[resource] ?? []);
      }

      try {
        const { data, error } = await supabase
          .from(getTableName(resource))
          .select("*")
          .eq("gym_id", gymId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json(data ?? []);
      } catch {
        return NextResponse.json(fallbackData[resource] ?? []);
      }
    },

    POST: async (request: Request) => {
      const gymId = getGymIdFromRequest();
      const supabase = getSupabaseClient();

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

        const record = { ...body, gym_id: gymId };

        if (!supabase) {
          return NextResponse.json({
            success: true,
            mode: "demo",
            record: { id: crypto.randomUUID(), ...record },
          });
        }

        const { data, error } = await supabase
          .from(getTableName(resource))
          .insert(record)
          .select("*")
          .single();

        if (error) throw error;
        return NextResponse.json({
          success: true,
          mode: "supabase",
          record: data,
        });
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : "Create failed",
          },
          { status: 400 },
        );
      }
    },

    PUT: async (request: Request, { params }: { params: { id: string } }) => {
      const gymId = getGymIdFromRequest();
      const supabase = getSupabaseClient();

      try {
        const body = await request.json();
        const id = params.id;

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

        if (!supabase) {
          return NextResponse.json({
            success: true,
            mode: "demo",
            record: { id, gym_id: gymId, ...body },
          });
        }

        const { data, error } = await supabase
          .from(getTableName(resource))
          .update(body)
          .eq("id", id)
          .eq("gym_id", gymId)
          .select("*")
          .single();

        if (error) throw error;
        return NextResponse.json({
          success: true,
          mode: "supabase",
          record: data,
        });
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : "Update failed",
          },
          { status: 400 },
        );
      }
    },

    DELETE: async (
      request: Request,
      { params }: { params: { id: string } },
    ) => {
      const gymId = getGymIdFromRequest();
      const supabase = getSupabaseClient();

      try {
        const id = params.id;

        if (!supabase) {
          return NextResponse.json({ success: true, mode: "demo", id });
        }

        const { error } = await supabase
          .from(getTableName(resource))
          .delete()
          .eq("id", id)
          .eq("gym_id", gymId);

        if (error) throw error;
        return NextResponse.json({ success: true, mode: "supabase", id });
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : "Delete failed",
          },
          { status: 400 },
        );
      }
    },
  };
}
