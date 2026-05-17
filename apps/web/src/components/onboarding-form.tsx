"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@gymflow/ui";

const initialState = {
  gym_name: "",
  slug: "",
  owner_name: "",
  owner_email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  city: "",
  state: "",
  subscription_tier: "starter",
};

const requiredFields = [
  "gym_name",
  "slug",
  "owner_name",
  "owner_email",
  "phone",
  "password",
  "city",
  "state",
];

export function OnboardingForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState(
    "Fill in all details to create your gym tenant.",
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    for (const field of requiredFields) {
      if (!form[field as keyof typeof form]) {
        newErrors[field] = "Required";
      }
    }

    if (
      form.owner_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.owner_email)
    ) {
      newErrors.owner_email = "Invalid email";
    }

    if (form.slug && !/^[a-z0-9-]+$/.test(form.slug)) {
      newErrors.slug = "Lowercase letters, numbers, hyphens only";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (form.password && form.password.length < 6) {
      newErrors.password = "At least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validateForm()) {
      setStatus("Please fix the errors below.");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/register-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gym_name: form.gym_name,
          slug: form.slug,
          owner_name: form.owner_name,
          owner_email: form.owner_email,
          phone: form.phone,
          password: form.password,
          city: form.city,
          state: form.state,
          subscription_tier: form.subscription_tier,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store session
        localStorage.setItem("gym_owner_token", result.token);
        localStorage.setItem(
          "gym_owner_data",
          JSON.stringify({
            gym: result.gym,
            user: result.owner,
          }),
        );

        setSuccess(true);
        setStatus("Gym created successfully!");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setStatus(result.error || "Registration failed");
      }
    } catch (error) {
      setStatus("Network error. Please try again.");
    }

    setLoading(false);
  }

  function generateSlug() {
    if (form.gym_name) {
      const slug = form.gym_name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setForm((current) => ({ ...current, slug }));
    }
  }

  if (success) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
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
        <h3 className="text-xl font-bold text-slate-900">
          Welcome to GymFlow!
        </h3>
        <p className="mt-2 text-slate-500">
          Your gym "{form.gym_name}" has been created.
        </p>
        <p className="mt-4 text-sm text-brand-600">
          Redirecting to dashboard...
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Gym Name *
            <Input
              value={form.gym_name}
              onChange={(e) => setForm({ ...form, gym_name: e.target.value })}
              placeholder="My Fitness Gym"
              className={errors.gym_name ? "border-red-300" : ""}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Gym Slug *
            <div className="flex gap-2">
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm({ ...form, slug: e.target.value.toLowerCase() })
                }
                placeholder="my-gym"
                className={errors.slug ? "border-red-300" : ""}
              />
              <Button type="button" variant="outline" onClick={generateSlug}>
                Auto
              </Button>
            </div>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Owner Name *
            <Input
              value={form.owner_name}
              onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
              placeholder="John Doe"
              className={errors.owner_name ? "border-red-300" : ""}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Phone *
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className={errors.phone ? "border-red-300" : ""}
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Email *
          <Input
            value={form.owner_email}
            onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
            placeholder="owner@gymname.com"
            type="email"
            className={errors.owner_email ? "border-red-300" : ""}
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Password *
            <Input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
              type="password"
              className={errors.password ? "border-red-300" : ""}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Confirm Password *
            <Input
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              placeholder="Confirm password"
              type="password"
              className={errors.confirmPassword ? "border-red-300" : ""}
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            City *
            <Input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Mumbai"
              className={errors.city ? "border-red-300" : ""}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            State *
            <Input
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              placeholder="Maharashtra"
              className={errors.state ? "border-red-300" : ""}
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Plan
          <select
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
            value={form.subscription_tier}
            onChange={(e) =>
              setForm({ ...form, subscription_tier: e.target.value })
            }
          >
            <option value="starter">Starter - Free</option>
            <option value="growth">Growth - ₹499/mo</option>
            <option value="scale">Scale - ₹999/mo</option>
          </select>
        </label>

        <div className="flex flex-col gap-3 pt-2">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Creating gym..." : "Create Gym & Get Started"}
          </Button>
          <p
            className={`text-center text-sm ${status.includes("failed") || status.includes("fix") || status.includes("taken") ? "text-red-600 font-medium" : "text-slate-500"}`}
          >
            {status}
          </p>
        </div>
      </form>
    </Card>
  );
}
