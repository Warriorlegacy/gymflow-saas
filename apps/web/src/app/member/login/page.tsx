"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginMember, saveMemberSession } from "@gymflow/services";
import { Button, Card, Input } from "@gymflow/ui";

export default function MemberLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await loginMember(phone, password);

    if (result.success) {
      saveMemberSession(result.token, result.member);
      router.push("/member/dashboard");
    } else {
      setError(result.error || "Login failed");
    }

    setLoading(false);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-surface-50 px-4 py-10">
      <div className="absolute inset-0 bg-hero-glow opacity-60" />
      <Card className="relative w-full max-w-md space-y-6 p-8 shadow-card">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white shadow-sm">
            GF
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Member Login
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Sign in to track your attendance and plan
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              type="tel"
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

        <p className="text-center text-sm">
          <span className="text-slate-500">Don&apos;t have an account? </span>
          <Link
            href="/member/register"
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            Register here
          </Link>
        </p>

        <p className="text-center text-sm">
          <Link
            href="/login"
            className="font-medium text-slate-500 hover:text-slate-700"
          >
            ← Back to gym admin login
          </Link>
        </p>
      </Card>
    </main>
  );
}
