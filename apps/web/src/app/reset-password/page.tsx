"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@gymflow/ui";

type AccountType = "owner" | "member";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("member");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < (accountType === "owner" ? 6 : 4)) {
      setStatus(
        `Password must be at least ${accountType === "owner" ? 6 : 4} characters`,
      );
      setLoading(false);
      return;
    }

    try {
      const isOwner = accountType === "owner";
      const url = isOwner
        ? "/api/auth/reset-password"
        : "/api/member/reset-password";

      const payload = isOwner
        ? {
            email: formData.email,
            phone: formData.phone,
            newPassword: formData.newPassword,
          }
        : { phone: formData.phone, newPassword: formData.newPassword };

      if (isOwner && !formData.email && !formData.phone) {
        setStatus("Please provide your email or phone number");
        setLoading(false);
        return;
      }

      if (!isOwner && !formData.phone) {
        setStatus("Please provide your phone number");
        setLoading(false);
        return;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setStatus(result.message);
      } else {
        setStatus(result.error || "Reset failed");
      }
    } catch (error) {
      setStatus("Network error. Please try again.");
    }

    setLoading(false);
  }

  if (success) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-surface-50 bg-dots px-4 py-10">
        <div className="absolute inset-0 bg-hero-glow opacity-60" />
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
              Password Reset!
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {status}
            </p>
          </div>
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() =>
                router.push(
                  accountType === "owner" ? "/login" : "/member/login",
                )
              }
            >
              {accountType === "owner" ? "Go to Login" : "Go to Member Login"}
            </Button>
            <Link
              href="/"
              className="block text-sm text-slate-500 hover:text-slate-700"
            >
              Back to Home
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-surface-50 bg-dots px-4 py-10">
      <div className="absolute inset-0 bg-hero-glow opacity-60" />
      <Card className="relative w-full max-w-md space-y-6 p-8 shadow-card">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white shadow-sm">
            GF
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reset Password
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Reset your account password
            </p>
          </div>
        </div>

        {status && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {status}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType("member")}
                className={`rounded-xl border-2 p-3 text-center transition ${
                  accountType === "member"
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="text-sm font-semibold">Member</span>
              </button>
              <button
                type="button"
                onClick={() => setAccountType("owner")}
                className={`rounded-xl border-2 p-3 text-center transition ${
                  accountType === "owner"
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="text-sm font-semibold">Gym Owner</span>
              </button>
            </div>
          </div>

          {accountType === "owner" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="owner@mygym.com"
                type="email"
              />
              <p className="text-xs text-slate-400">
                Or provide your phone number below
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {accountType === "owner" ? "Phone (if no email)" : "Phone Number"}
            </label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+91 98765 43210"
              type="tel"
              required={accountType === "member"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              New Password
            </label>
            <Input
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              placeholder={`At least ${accountType === "owner" ? 6 : 4} characters`}
              type="password"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Confirm New Password
            </label>
            <Input
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Confirm your new password"
              type="password"
              required
            />
          </div>

          <Button className="w-full" type="submit" disabled={loading} size="lg">
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        <p className="text-center text-sm">
          <Link
            href="/login"
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            ← Back to Login
          </Link>
        </p>
      </Card>
    </main>
  );
}
