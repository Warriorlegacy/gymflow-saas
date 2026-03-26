"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendMagicLink } from "@gymflow/services";
import { Button, Card, Input } from "@gymflow/ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@gymflow.demo");
  const [status, setStatus] = useState("Use Supabase magic link or continue with the demo tenant.");
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, name: "Demo Owner" })
    });

    const result = (await response.json()) as { ok?: boolean; message?: string };
    if (result.ok) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setStatus(result.message ?? "Unable to start demo session.");
    setLoading(false);
  }

  return (
    <Card className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-slate-950">GymFlow login</h1>
        <p className="text-sm text-slate-500">{status}</p>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="owner@gymflow.demo" type="email" />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send magic link"}
        </Button>
      </form>
      <Button className="w-full" variant="outline" onClick={handleDemoAccess} disabled={loading}>
        Enter demo tenant
      </Button>
      <Link href="/onboarding" className="text-center text-sm text-brand-700">
        Create a new gym tenant
      </Link>
    </Card>
  );
}
