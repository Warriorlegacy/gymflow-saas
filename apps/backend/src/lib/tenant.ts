import { DEMO_GYM_ID } from "@gymflow/lib";

export function getGymIdFromRequest(headers: Record<string, string | string[] | undefined>) {
  const value = headers["x-gym-id"];
  if (Array.isArray(value)) {
    return value[0] ?? DEMO_GYM_ID;
  }

  return value ?? DEMO_GYM_ID;
}

