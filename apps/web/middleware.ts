import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE } from "./src/lib/auth";

const protectedRoutes = [
  "/dashboard",
  "/members",
  "/plans",
  "/payments",
  "/attendance",
  "/trainers",
  "/workouts",
  "/diet-plans",
  "/reports",
  "/settings",
];

export function middleware(request: NextRequest) {
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  const session = request.cookies.get(DEMO_SESSION_COOKIE)?.value;
  if (session) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/members/:path*",
    "/plans/:path*",
    "/payments/:path*",
    "/attendance/:path*",
    "/trainers/:path*",
    "/workouts/:path*",
    "/diet-plans/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
