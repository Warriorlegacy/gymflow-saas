"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMemberDashboard,
  memberCheckin,
  clearMemberSession,
  getMemberSession,
} from "@gymflow/services";
import { Button, Card } from "@gymflow/ui";

interface DashboardData {
  success: boolean;
  demo?: boolean;
  member?: {
    name: string;
    phone: string;
    email?: string;
    status: string;
  };
  subscription?: {
    planName: string;
    status: string;
    endDate: string;
    daysLeft: number;
  };
  attendance?: {
    todayCheckedIn: boolean;
    totalThisMonth: number;
    streak: number;
  };
}

export default function MemberDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkinMessage, setCheckinMessage] = useState("");

  useEffect(() => {
    const session = getMemberSession();
    if (!session.token) {
      router.push("/member/login");
      return;
    }

    getMemberDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, [router]);

  async function handleCheckin() {
    const session = getMemberSession();
    if (!session.member?.id) return;

    setCheckingIn(true);
    setCheckinMessage("");

    const result = await memberCheckin(session.member.id);

    if (result.success) {
      setCheckinMessage("✓ Checked in successfully!");
      getMemberDashboard().then(setData);
    } else {
      setCheckinMessage(result.error || "Check-in failed");
    }

    setCheckingIn(false);
  }

  function handleLogout() {
    clearMemberSession();
    router.push("/member/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-surface-50">
        <div className="mx-auto max-w-md px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-20 rounded-2xl bg-slate-200" />
            <div className="h-32 rounded-2xl bg-slate-200" />
            <div className="h-24 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!data?.success) {
    return (
      <main className="min-h-screen bg-surface-50 flex items-center justify-center">
        <Card className="max-w-md p-6 text-center">
          <p className="text-red-600">Failed to load dashboard</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-50">
      <div className="mx-auto max-w-md px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome, {data.member?.name}!
            </h1>
            <p className="text-sm text-slate-500">
              {data.demo && <span className="text-amber-600">[Demo Mode]</span>}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Today&apos;s Check-in
            </h2>
            <span
              className={`text-sm font-medium ${data.attendance?.todayCheckedIn ? "text-emerald-600" : "text-slate-500"}`}
            >
              {data.attendance?.todayCheckedIn ? "✓ Checked In" : "Not Yet"}
            </span>
          </div>

          {checkinMessage && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                checkinMessage.includes("success")
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {checkinMessage}
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={data.attendance?.todayCheckedIn || checkingIn}
            onClick={handleCheckin}
          >
            {checkingIn
              ? "Checking in..."
              : data.attendance?.todayCheckedIn
                ? "Already Checked In"
                : "Check In Now"}
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Your Plan
          </h2>
          {data.subscription ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Plan</span>
                <span className="font-medium text-slate-900">
                  {data.subscription.planName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span
                  className={`font-medium ${
                    data.subscription.status === "active"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {data.subscription.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expires</span>
                <span className="font-medium text-slate-900">
                  {data.subscription.endDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Days Remaining</span>
                <span className="font-medium text-slate-900">
                  {data.subscription.daysLeft}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">No active subscription</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Attendance Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <p className="text-3xl font-bold text-brand-600">
                {data.attendance?.totalThisMonth || 0}
              </p>
              <p className="text-sm text-slate-500">This Month</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <p className="text-3xl font-bold text-brand-600">
                {data.attendance?.streak || 0}
              </p>
              <p className="text-sm text-slate-500">Day Streak</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Your Info
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Phone</span>
              <span className="font-medium text-slate-900">
                {data.member?.phone}
              </span>
            </div>
            {data.member?.email && (
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-900">
                  {data.member.email}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className="font-medium text-emerald-600">
                {data.member?.status}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
