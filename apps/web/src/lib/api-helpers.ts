import { NextResponse } from "next/server";
import { getGymIdFromRequest } from "@/lib/supabase-api";

export function getApiBaseUrl(): string {
  return process.env.API_BASE_URL ?? "http://localhost:4000";
}

export async function proxyRequest(
  endpoint: string,
  request: Request,
  method: string = "POST",
): Promise<NextResponse> {
  const gymId = await getGymIdFromRequest();
  const apiUrl = getApiBaseUrl();
  const body = await request.json();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (gymId) {
    headers["x-gym-id"] = gymId;
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    method,
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json(data);
}
