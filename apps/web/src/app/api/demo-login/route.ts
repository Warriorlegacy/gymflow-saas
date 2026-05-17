import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { ok: false, message: "Demo login is not available in production." },
    { status: 404 },
  );
}

export async function POST() {
  return NextResponse.json(
    { ok: false, message: "Demo login is not available in production." },
    { status: 404 },
  );
}
