import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasGroqKey: !!process.env.GROQ_API_KEY,
    groqKeyPrefix: process.env.GROQ_API_KEY?.substring(0, 10) ?? "not-set",
    hasGroqBase: !!process.env.GROQ_BASE_URL,
    groqBase: process.env.GROQ_BASE_URL ?? "not-set",
    hasGroqModel: !!process.env.GROQ_MODEL,
    groqModel: process.env.GROQ_MODEL ?? "not-set",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    geminiKeyPrefix: process.env.GEMINI_API_KEY?.substring(0, 10) ?? "not-set",
  });
}
