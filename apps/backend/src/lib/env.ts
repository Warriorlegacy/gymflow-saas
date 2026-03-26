import "dotenv/config";

export const env = {
  port: Number(process.env.BACKEND_PORT ?? 4000),
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
  ollamaModel: process.env.OLLAMA_MODEL ?? "llama3.2:3b",
  sessionPath: process.env.WHATSAPP_SESSION_PATH ?? "./.sessions"
};

