import { env } from "../lib/env";

const featurePrompts: Record<string, string> = {
  chatbot: "You are a gym operations assistant. Provide short, tactical business help.",
  diet_plan: "You are a nutrition coach. Create practical Indian diet plans.",
  workout_plan: "You are a strength coach. Generate safe gym workouts with sets and reps.",
  message_generator: "You write concise WhatsApp messages for gym customers."
};

export async function generateAIResponse(feature: string, prompt: string) {
  try {
    const response = await fetch(`${env.ollamaBaseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.ollamaModel,
        prompt: `${featurePrompts[feature] ?? featurePrompts.chatbot}\n\nUser request: ${prompt}`,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error("Ollama request failed");
    }

    const data = (await response.json()) as { response?: string };
    return data.response ?? "No AI output returned.";
  } catch {
    return `Demo ${feature} response: ${prompt}`;
  }
}

