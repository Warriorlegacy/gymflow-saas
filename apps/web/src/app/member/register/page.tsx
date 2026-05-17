"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerMember } from "@gymflow/services";
import { Button, Card, Input } from "@gymflow/ui";

export default function MemberRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    gymSlug: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters");
      setLoading(false);
      return;
    }

    const result = await registerMember({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      gymSlug: formData.gymSlug || undefined,
    });

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Registration failed");
    }

    setLoading(false);
  }

  if (success) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-surface-50 px-4 py-10">
        <Card className="relative w-full max-w-md space-y-6 p-8 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-8 w-8 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Registration Successful!
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Your account has been created. Please check your phone for
              verification.
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => router.push("/member/login")}
          >
            Sign In Now
          </Button>
        </Card>
      </main>
    );
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
              Member Registration
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Create your member account
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
              Full Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Phone Number *
            </label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+91 98765 43210"
              type="tel"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Email (optional)
            </label>
            <Input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@example.com"
              type="email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Gym (optional)
            </label>
            <Input
              value={formData.gymSlug}
              onChange={(e) =>
                setFormData({ ...formData, gymSlug: e.target.value })
              }
              placeholder="gymflow-demo"
            />
            <p className="text-xs text-slate-400">Leave empty for demo gym</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Password *
            </label>
            <Input
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="At least 4 characters"
              type="password"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Confirm Password *
            </label>
            <Input
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Confirm password"
              type="password"
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={loading} size="lg">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm">
          <span className="text-slate-500">Already have an account? </span>
          <Link
            href="/member/login"
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            Sign in
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
