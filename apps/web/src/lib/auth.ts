import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_GYM_ID } from "@gymflow/lib";

export const DEMO_SESSION_COOKIE = "gymflow_demo_session";
const isProduction = process.env.NODE_ENV === "production";

export interface DemoSession {
  email: string;
  name: string;
  gym_id: string;
}

export function getDemoSession(): DemoSession | null {
  try {
    const store = cookies();
    const sessionCookie = store.get(DEMO_SESSION_COOKIE)?.value;
    if (!sessionCookie) return null;

    const parsed = JSON.parse(sessionCookie) as DemoSession;
    if (!parsed.email || !parsed.gym_id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function requireDemoSession(): DemoSession {
  const session = getDemoSession();
  if (!session) {
    redirect("/login");
  }
  return session!;
}

export function getGymIdFromSession(): string {
  const session = getDemoSession();
  return session?.gym_id ?? DEMO_GYM_ID;
}

export function getSecureCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export { DEMO_GYM_ID };
