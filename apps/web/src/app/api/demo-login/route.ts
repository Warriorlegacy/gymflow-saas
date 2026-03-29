import { NextResponse } from "next/server";
import { demoLoginSchema, DEMO_GYM_ID } from "@gymflow/lib";
import { DEMO_SESSION_COOKIE, getSecureCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = demoLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid login request." },
        { status: 400 },
      );
    }

    const sessionData = {
      email: parsed.data.email,
      name: parsed.data.name,
      gym_id: DEMO_GYM_ID,
    };

    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      DEMO_SESSION_COOKIE,
      JSON.stringify(sessionData),
      getSecureCookieOptions(),
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Login failed." },
      { status: 500 },
    );
  }
}
