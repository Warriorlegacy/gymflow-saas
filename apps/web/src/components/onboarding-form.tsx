"use client";

import { useState } from "react";
import { Button, Card, Input } from "@gymflow/ui";

const initialState = {
  gym_name: "Peak Motion Fitness",
  slug: "peak-motion-fitness",
  owner_name: "Sana Kapoor",
  owner_email: "sana@peakmotion.demo",
  phone: "+91 98888 77777",
  city: "Pune",
  state: "Maharashtra",
  subscription_tier: "starter"
};

export function OnboardingForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("Submit to provision a new gym tenant.");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"}/api/onboarding/gym`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const result = (await response.json()) as { success?: boolean; error?: string; gym?: { slug?: string } };
    setStatus(result.success ? `Gym provisioned${result.gym?.slug ? `: ${result.gym.slug}` : ""}.` : result.error ?? "Provisioning failed.");
    setLoading(false);
  }

  return (
    <Card>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        {Object.entries(form).map(([key, value]) =>
          key === "subscription_tier" ? (
            <label key={key} className="grid gap-2 text-sm font-medium text-slate-700">
              Subscription tier
              <select
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                value={value}
                onChange={(event) => setForm((current) => ({ ...current, subscription_tier: event.target.value }))}
              >
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="scale">Scale</option>
              </select>
            </label>
          ) : (
            <label key={key} className="grid gap-2 text-sm font-medium text-slate-700">
              {key.replace(/_/g, " ")}
              <Input value={value} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
            </label>
          )
        )}
        <div className="md:col-span-2 flex flex-col gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Provisioning..." : "Create gym tenant"}
          </Button>
          <p className="text-sm text-slate-500">{status}</p>
        </div>
      </form>
    </Card>
  );
}

