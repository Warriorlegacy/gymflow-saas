import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { to: string; message: string };
    if (!body.to || !body.message) {
      return NextResponse.json(
        { success: false, error: "Phone number and message are required" },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      const gymId =
        request.headers.get("x-gym-id") ??
        "00000000-0000-0000-0000-000000000001";
      await supabase.from("messages").insert({
        gym_id: gymId,
        channel: "whatsapp",
        message_type: "campaign",
        recipient: body.to,
        content: body.message,
        delivery_status: "queued",
      });
    }

    return NextResponse.json({
      success: true,
      provider: "queued",
      note: "Message queued for delivery. WhatsApp automation requires the backend server.",
    });
  } catch (error) {
    console.error("[API] WhatsApp send failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "WhatsApp send failed",
      },
      { status: 500 },
    );
  }
}
