import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const DEMO_SESSION_COOKIE = "gymflow_demo_session";

export function getDemoSession() {
  const store = cookies();
  return store.get(DEMO_SESSION_COOKIE)?.value ?? null;
}

export function requireDemoSession() {
  if (!getDemoSession()) {
    redirect("/login");
  }
}

