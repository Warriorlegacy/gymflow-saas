import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "../lib/supabase";

function normalizeTableName(resource: string) {
  return resource === "diet-plans" ? "diet_plans" : resource;
}

export async function createResource(
  resource: string,
  gymId: string,
  payload: Record<string, unknown>,
) {
  const table = normalizeTableName(resource);

  if (!supabaseAdmin) {
    throw new Error("Database not configured");
  }

  const record = {
    id: randomUUID(),
    gym_id: gymId,
    ...payload,
  };

  const { data, error } = await supabaseAdmin
    .from(table)
    .insert(record)
    .select("*")
    .single();
  if (error) {
    throw error;
  }

  return { success: true, record: data };
}

export async function updateResource(
  resource: string,
  gymId: string,
  id: string,
  payload: Record<string, unknown>,
) {
  const table = normalizeTableName(resource);

  if (!supabaseAdmin) {
    throw new Error("Database not configured");
  }

  const { data, error } = await supabaseAdmin
    .from(table)
    .update(payload)
    .eq("id", id)
    .eq("gym_id", gymId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return { success: true, record: data };
}

export async function deleteResource(
  resource: string,
  gymId: string,
  id: string,
) {
  const table = normalizeTableName(resource);

  if (!supabaseAdmin) {
    throw new Error("Database not configured");
  }

  const { error } = await supabaseAdmin
    .from(table)
    .delete()
    .eq("id", id)
    .eq("gym_id", gymId);
  if (error) {
    throw error;
  }

  return { success: true, id };
}
