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
    const { email, phone, newPassword } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { success: false, error: "Email or phone is required" },
        { status: 400 },
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        { success: false, error: "New password is required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be 6+ characters" },
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

    let userQuery = supabase
      .from("users")
      .select("id, email, phone, role")
      .eq("role", "owner");

    if (email) {
      userQuery = userQuery.eq("email", email.toLowerCase());
    } else {
      userQuery = userQuery.eq("phone", phone.replace(/\D/g, ""));
    }

    const { data: user, error } = await userQuery.single();

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: "Account not found. Check email or phone." },
        { status: 404 },
      );
    }

    const passwordHash = hashPassword(newPassword);

    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", user.id);

    if (updateError) {
      console.error("[Reset Password] Update error:", updateError);
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
    console.error("[Reset Password] Error:", error);
    return NextResponse.json(
      { success: false, error: "Password reset failed" },
      { status: 500 },
    );
  }
}
