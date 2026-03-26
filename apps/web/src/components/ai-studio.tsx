"use client";

import { useState } from "react";
import { api } from "@gymflow/services";
import { Badge, Button, Card, Input } from "@gymflow/ui";

const features = [
  { key: "chatbot", label: "Chatbot assistant", placeholder: "Ask the AI how to improve member retention..." },
  { key: "diet_plan", label: "Diet plan generator", placeholder: "Generate a high-protein vegetarian plan for a 29-year-old female..." },
  { key: "workout_plan", label: "Workout generator", placeholder: "Create a 3-day beginner hypertrophy workout..." },
  { key: "message_generator", label: "Message generator", placeholder: "Write a friendly payment reminder in WhatsApp style..." }
] as const;

export function AIStudio() {
  const [feature, setFeature] = useState<(typeof features)[number]["key"]>("chatbot");
  const [prompt, setPrompt] = useState<string>(features[0].placeholder);
  const [output, setOutput] = useState("AI output will appear here. Connect Ollama locally for live generation.");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const result = await api.runAI(feature, prompt);
      setOutput(result.output);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {features.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setFeature(item.key);
              setPrompt(item.placeholder);
            }}
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${feature === item.key ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3">
        <Input value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate with Ollama"}
        </Button>
      </div>
      <div className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
        <Badge className="mb-3 bg-white/10 text-white">Free AI</Badge>
        <pre className="whitespace-pre-wrap font-sans">{output}</pre>
      </div>
    </Card>
  );
}
