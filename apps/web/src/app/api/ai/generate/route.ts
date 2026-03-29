import { NextResponse } from "next/server";

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
  const apiKey = process.env.GROQ_API_KEY ?? "";
  const baseUrl = process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1";
  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

  if (!apiKey) {
    throw new Error("Groq API key not configured");
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
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
  const apiKey = process.env.GEMINI_API_KEY ?? "";

  if (!apiKey) {
    throw new Error("Gemini API key not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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

function generateDemoResponse(feature: string, prompt: string): string {
  const demos: Record<string, string> = {
    chatbot: `Here's a quick tip for your gym: Focus on member retention by sending personalized check-ins. Track attendance patterns and reach out when members miss 3+ sessions. This alone can reduce churn by 15-20%.`,
    diet_plan: `**Sample High-Protein Indian Diet Plan**

**Early Morning (6 AM):** Warm water with lemon + 5 soaked almonds
**Breakfast (8 AM):** 2 moong dal chillas + mint chutney + 1 glass buttermilk
**Mid-Morning (10:30 AM):** 1 apple + 10 walnuts
**Lunch (1 PM):** 1 cup brown rice + 1 bowl rajma + 1 cup mixed veg salad + 1 glass chaas
**Evening Snack (4 PM):** 1 cup green tea + 2 tbsp roasted chana
**Dinner (7:30 PM):** 2 multigrain rotis + grilled paneer tikka + sautéed broccoli
**Bedtime:** 1 cup turmeric milk

*Total: ~1,800 kcal | Protein: 85g | Carbs: 220g | Fat: 55g*`,
    workout_plan: `**3-Day Beginner Full Body Workout**

**Day 1 - Push Focus**
1. Barbell Bench Press: 3x10
2. Overhead Dumbbell Press: 3x12
3. Tricep Pushdowns: 3x15
4. Leg Press: 3x12
5. Plank: 3x30s

**Day 2 - Pull Focus**
1. Lat Pulldown: 3x10
2. Seated Cable Row: 3x12
3. Dumbbell Bicep Curls: 3x12
4. Leg Curl: 3x12
5. Face Pulls: 3x15

**Day 3 - Legs & Core**
1. Goblet Squats: 3x12
2. Romanian Deadlift: 3x10
3. Walking Lunges: 3x10 each
4. Leg Extensions: 3x15
5. Cable Woodchops: 3x12 each side

*Rest 60-90s between sets. Warm up 5 min before each session.*`,
    message_generator: `Hi {name}! Your gym membership expires on {date}. Renew today to continue your fitness journey without interruption. Reply YES for quick renewal!`,
    report_summary: `**Weekly Gym Report Summary**

Key highlights:
- Attendance up 8% this week
- 3 new members joined
- Revenue: Rs. 45,000 (+12% vs last week)
- Top trainer: Neha with 28 sessions

Recommendation: Focus on converting 5 leads who haven't renewed yet.`,
  };

  return demos[feature] ?? demos.chatbot;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { feature: string; prompt: string };
    const { feature, prompt } = body;

    if (!feature || !prompt) {
      return NextResponse.json(
        { error: "Missing feature or prompt" },
        { status: 400 },
      );
    }

    const systemPrompt = featurePrompts[feature] ?? featurePrompts.chatbot;

    // Try Groq first
    try {
      const result = await callGroq(systemPrompt, prompt);
      return NextResponse.json({ output: result, provider: "groq" });
    } catch (groqError) {
      console.error("Groq failed:", groqError);
      // Groq failed, try Gemini
    }

    // Try Gemini as fallback
    try {
      const result = await callGemini(systemPrompt, prompt);
      return NextResponse.json({ output: result, provider: "gemini" });
    } catch (geminiError) {
      console.error("Gemini failed:", geminiError);
      // Both failed, return demo
    }

    return NextResponse.json({
      output: generateDemoResponse(feature, prompt),
      provider: "demo",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "AI generation failed",
      },
      { status: 500 },
    );
  }
}
