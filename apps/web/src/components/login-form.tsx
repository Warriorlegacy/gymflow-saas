"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@gymflow/ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Sign in with your email and password.");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/auth/login-owner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem("gym_owner_token", result.token);
      localStorage.setItem(
        "gym_owner_data",
        JSON.stringify({
          gym: result.gym,
          user: result.user,
        }),
      );
      router.push("/dashboard");
      router.refresh();
    } else {
      setStatus(result.error || "Login failed");
    }
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
            Gym Owner Login
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {status}
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@mygym.com"
            type="email"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <Link
              href="/reset-password"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            type="password"
            required
          />
        </div>
        <Button className="w-full" type="submit" disabled={loading} size="lg">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-medium text-slate-400">
            FOR MEMBERS
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/member/login">
          <Button variant="outline" className="w-full">
            Member Login
          </Button>
        </Link>
        <Link href="/member/register">
          <Button variant="outline" className="w-full">
            Member Register
          </Button>
        </Link>
      </div>

      <p className="text-center">
        <Link
          href="/onboarding"
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Create new gym &rarr;
        </Link>
      </p>
    </Card>
  );
}
