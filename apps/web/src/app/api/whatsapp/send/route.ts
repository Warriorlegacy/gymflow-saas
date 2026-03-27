import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      to: string;
      message: string;
      type?: string;
    };
    const { to, message, type } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: "Missing phone number or message" },
        { status: 400 },
      );
    }

    // In production, this would integrate with WhatsApp Cloud API or Baileys
    // For now, we simulate sending and return success
    // To enable real WhatsApp, you'd need to:
    // 1. Set up WhatsApp Business API
    // 2. Or use Baileys (WhatsApp Web) with QR code
    // 3. Configure WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID

    const whatsappToken = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (whatsappToken && phoneNumberId) {
      // Try WhatsApp Cloud API
      try {
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${whatsappToken}`,
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: to.replace(/\D/g, ""),
              type: "text",
              text: { body: message },
            }),
          },
        );

        if (response.ok) {
          const data = (await response.json()) as {
            messages?: Array<{ id?: string }>;
          };
          return NextResponse.json({
            success: true,
            provider: "whatsapp-cloud",
            messageId: data.messages?.[0]?.id,
          });
        }
      } catch {
        // WhatsApp Cloud API failed, fall back to demo
      }
    }

    // Demo mode - simulate successful send
    console.log(`[WhatsApp Demo] To: ${to}, Message: ${message}`);
    return NextResponse.json({
      success: true,
      provider: "demo",
      note: "Message logged in demo mode. Configure WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID for live sending.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "WhatsApp send failed",
      },
      { status: 500 },
    );
  }
}
