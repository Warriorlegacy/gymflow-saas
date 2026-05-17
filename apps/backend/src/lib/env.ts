import "dotenv/config";

export const env = {
  port: Number(process.env.BACKEND_PORT ?? 4000),

  // Supabase
  supabaseUrl:
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    "",
  supabaseServiceRoleKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_KEY ??
    "",

  // AI Providers
  groqApiKey: process.env.GROQ_API_KEY ?? "",
  groqBaseUrl: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
  groqModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",

  // WhatsApp
  sessionPath: process.env.WHATSAPP_SESSION_PATH ?? "./.sessions",

  // API URLs
  webUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};
