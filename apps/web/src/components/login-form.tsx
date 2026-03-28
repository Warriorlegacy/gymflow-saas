"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendMagicLink } from "@gymflow/services";
import { Button, Card, Input } from "@gymflow/ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@gymflow.demo");
  const [status, setStatus] = useState(
    "Use Supabase magic link or continue with the demo tenant."
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const result = await sendMagicLink(email);
    setStatus(result.message);
    setLoading(false);
  }

  async function handleDemoAccess() {
    setLoading(true);
    const response = await fetch("/api/demo-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: "Demo Owner" }),
    });

    const result = (await response.json()) as {
      ok?: boolean;
      message?: string;
    };
    if (result.ok) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setStatus(result.message ?? "Unable to start demo session.");
    setLoading(false);
  }

  return (
    <Card className="w-full space-y-6 p-8 shadow-card">
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white shadow-sm">
          GF
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {status}
          </p>
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Email address
          </label>
          <Input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="owner@gymflow.demo"
            type="email"
          />
        </div>
        <Button className="w-full" type="submit" disabled={loading} size="lg">
          {loading ? "Sending..." : "Send magic link"}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-medium text-slate-400">
            OR
          </span>
        </div>
      </div>
      <Button
        className="w-full"
        variant="outline"
        size="lg"
        onClick={handleDemoAccess}
        disabled={loading}
      >
        Enter demo tenant
      </Button>
      <p className="text-center">
        <Link
          href="/onboarding"
          className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
        >
          Create a new gym tenant →
        </Link>
      </p>
    </Card>
  );
}
