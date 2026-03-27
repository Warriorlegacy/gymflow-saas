import "dotenv/config";

export const env = {
  port: Number(process.env.BACKEND_PORT ?? 4000),
  groqApiKey: process.env.GROQ_API_KEY ?? "",
  groqBaseUrl: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
  groqModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  sessionPath: process.env.WHATSAPP_SESSION_PATH ?? "./.sessions",
};
