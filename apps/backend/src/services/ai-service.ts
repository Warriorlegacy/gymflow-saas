import { env } from "../lib/env";

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
  if (!env.groqApiKey) {
    throw new Error("Groq API key not configured");
  }

  const response = await fetch(`${env.groqBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.groqApiKey}`,
    },
    body: JSON.stringify({
      model: env.groqModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content ?? "No response generated.";
}

async function callGemini(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  if (!env.geminiApiKey) {
    throw new Error("Gemini API key not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.geminiApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${systemPrompt}\n\nUser request: ${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response generated."
  );
}

export async function generateAIResponse(feature: string, prompt: string) {
  const systemPrompt = featurePrompts[feature] ?? featurePrompts.chatbot;

  // Try Groq first (free, fast, OpenAI-compatible)
  try {
    const result = await callGroq(systemPrompt, prompt);
    return result;
  } catch {
    // Groq failed, try Gemini
  }

  // Try Gemini as fallback
  try {
    const result = await callGemini(systemPrompt, prompt);
    return result;
  } catch {
    // Both failed, throw error
  }

  throw new Error(
    "AI service unavailable. Please check API key configuration.",
  );
}
