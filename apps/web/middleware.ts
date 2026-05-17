import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { OWNER_GYM_COOKIE } from "./src/lib/auth";
import { updateSession } from "./src/middleware/supabase-middleware";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

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
  "/billing",
  "/settings",
];

export async function middleware(request: NextRequest) {
  let response = await updateSession(request);

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (!isProtected) {
    return response;
  }

  // Check for owner gym cookie
  const ownerGymCookie = request.cookies.get(OWNER_GYM_COOKIE)?.value;
  if (ownerGymCookie) {
    return response;
  }

  // Check for Supabase auth session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return response;
    }
  }

  // Redirect to login if no session
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
    "/billing/:path*",
    "/settings/:path*",
  ],
};
