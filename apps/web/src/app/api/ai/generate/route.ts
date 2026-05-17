import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security";

const featurePrompts: Record<string, string> = {
  chatbot:
    "You are a gym operations assistant. Provide short, tactical business help for gym owners and managers. Be concise and actionable.",
  diet_plan:
    "You are a certified nutrition coach. Create practical, Indian-friendly diet plans with meals, quantities, and timing. Format with clear sections.",
  workout_plan:
    "You are a certified strength and conditioning coach. Generate safe, structured gym workouts with exercises, sets, reps, and rest periods. Format clearly.",
  message_generator:
    "You are a customer communication specialist for fitness businesses. Write concise, friendly WhatsApp messages for gym members. Keep messages under 160 characters when possible.",
  report_summary:
    "You are a business analyst for gym management. Summarize KPIs, trends, and provide actionable recommendations.",
};

async function callGroq(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq API key not configured");

  const baseUrl = process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1";
  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content ?? "No response generated.";
  } finally {
    clearTimeout(timeout);
  }
}

async function callGemini(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemPrompt}\n\nUser request: ${userPrompt}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No response generated."
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function generateAIResponse(
  feature: string,
  prompt: string,
): Promise<string> {
  const systemPrompt = featurePrompts[feature] ?? featurePrompts.chatbot;

  try {
    return await callGroq(systemPrompt, prompt);
  } catch {
    // Groq failed, try Gemini
  }

  try {
    return await callGemini(systemPrompt, prompt);
  } catch {
    // Both failed
  }

  throw new Error("AI service unavailable. Please try again later.");
}

export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(`ai-generate:${ip}`, 20, 60000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = (await request.json()) as { feature: string; prompt: string };
    if (!body.feature || !body.prompt) {
      return NextResponse.json(
        { error: "Feature and prompt are required" },
        { status: 400 },
      );
    }

    // Validate prompt length
    if (body.prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt is too long. Maximum 2000 characters." },
        { status: 400 },
      );
    }

    // Validate feature
    if (!featurePrompts[body.feature]) {
      return NextResponse.json(
        { error: "Invalid feature type" },
        { status: 400 },
      );
    }

    const output = await generateAIResponse(body.feature, body.prompt);
    return NextResponse.json(
      { output },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "AI generation failed. Please try again." },
      { status: 500 },
    );
  }
}
