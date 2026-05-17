import { NextResponse } from "next/server";
import { scryptSync, randomBytes } from "node:crypto";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashedPassword}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, newPassword } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 },
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        { success: false, error: "New password is required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { success: false, error: "Password must be 4+ characters" },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 },
      );
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data: member, error } = await supabase
      .from("members")
      .select("id, full_name, phone, gym_id")
      .eq("phone", phone.replace(/\D/g, ""))
      .single();

    if (error || !member) {
      return NextResponse.json(
        { success: false, error: "Member not found with this phone number." },
        { status: 404 },
      );
    }

    const passwordHash = hashPassword(newPassword);

    const { error: updateError } = await supabase
      .from("members")
      .update({ password_hash: passwordHash })
      .eq("id", member.id);

    if (updateError) {
      console.error("[Member Reset Password] Update error:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update password" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("[Member Reset Password] Error:", error);
    return NextResponse.json(
      { success: false, error: "Password reset failed" },
      { status: 500 },
    );
  }
}
