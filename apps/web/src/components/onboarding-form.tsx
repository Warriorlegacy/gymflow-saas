"use client";

import { useState } from "react";
import { Button, Card, Input } from "@gymflow/ui";

function toTitleCase(str: string): string {
  return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

const initialState = {
  gym_name: "",
  slug: "",
  owner_name: "",
  owner_email: "",
  phone: "",
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
  "city",
  "state",
];

export function OnboardingForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("Submit to provision a new gym tenant.");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of requiredFields) {
      if (!form[field as keyof typeof form]) {
        newErrors[field] = `${toTitleCase(field)} is required`;
      }
    }
    if (
      form.owner_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.owner_email)
    ) {
      newErrors.owner_email = "Invalid email format";
    }
    if (form.slug && !/^[a-z0-9-]+$/.test(form.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm()) {
      setStatus("Please fix the errors below.");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/onboarding/gym", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
        gym?: { slug?: string };
      };
      setStatus(
        result.success
          ? `Gym provisioned${result.gym?.slug ? `: ${result.gym.slug}` : ""}.`
          : (result.error ?? "Provisioning failed."),
      );
      if (result.success) {
        setForm(initialState);
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

  return (
    <Card>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        {Object.entries(form).map(([key, value]) =>
          key === "subscription_tier" ? (
            <label
              key={key}
              className="grid gap-2 text-sm font-medium text-slate-700"
            >
              {toTitleCase(key)}
              <select
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                value={value}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    subscription_tier: event.target.value,
                  }))
                }
              >
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="scale">Scale</option>
              </select>
            </label>
          ) : key === "slug" ? (
            <label
              key={key}
              className="grid gap-2 text-sm font-medium text-slate-700"
            >
              {toTitleCase(key)}
              <div className="flex gap-2">
                <Input
                  value={value}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      slug: event.target.value,
                    }))
                  }
                  className={errors[key] ? "border-red-300" : ""}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSlug}
                  className="whitespace-nowrap"
                >
                  Auto
                </Button>
              </div>
              {errors[key] ? (
                <span className="text-xs text-red-500">{errors[key]}</span>
              ) : null}
            </label>
          ) : (
            <label
              key={key}
              className="grid gap-2 text-sm font-medium text-slate-700"
            >
              <span>
                {toTitleCase(key)}
                {requiredFields.includes(key) ? (
                  <span className="ml-1 text-red-500">*</span>
                ) : null}
              </span>
              <Input
                value={value}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
                className={errors[key] ? "border-red-300" : ""}
              />
              {errors[key] ? (
                <span className="text-xs text-red-500">{errors[key]}</span>
              ) : null}
            </label>
          ),
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
