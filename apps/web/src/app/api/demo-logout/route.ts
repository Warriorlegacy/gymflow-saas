import { NextResponse } from "next/server";
import { DEMO_SESSION_COOKIE, getSecureCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const cookieOptions = getSecureCookieOptions();
  response.cookies.set(DEMO_SESSION_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });
  return response;
}
