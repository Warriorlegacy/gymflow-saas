import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const OWNER_GYM_COOKIE = "gymflow_owner_gym";
const isProduction = process.env.NODE_ENV === "production";

export interface OwnerSession {
  gym_id: string;
  user_id: string;
  email: string;
  name: string;
}

export function getOwnerSession(): OwnerSession | null {
  try {
    const store = cookies();
    const sessionCookie = store.get(OWNER_GYM_COOKIE)?.value;
    if (!sessionCookie) return null;

    const parsed = JSON.parse(sessionCookie) as OwnerSession;
    if (!parsed.gym_id || !parsed.user_id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function requireOwnerSession(): OwnerSession {
  const session = getOwnerSession();
  if (!session) {
    redirect("/login");
  }
  return session!;
}

export function getGymIdFromSession(): string | null {
  const ownerSession = getOwnerSession();
  if (ownerSession) return ownerSession.gym_id;
  return null;
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
