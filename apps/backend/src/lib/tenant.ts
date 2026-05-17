export function getGymIdFromRequest(
  headers: Record<string, string | string[] | undefined>,
): string | null {
  const value = headers["x-gym-id"];
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}
