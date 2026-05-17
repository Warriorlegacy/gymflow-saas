const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined" ? "" : "http://localhost:4000");

export interface Member {
  id: string;
  name: string;
  phone: string;
  gymId?: string;
}

export async function registerMember(data: {
  phone: string;
  password: string;
  name: string;
  gymSlug?: string;
  email?: string;
}) {
  const response = await fetch(`/api/member/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function loginMember(phone: string, password: string) {
  const response = await fetch(`/api/member/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });
  return response.json();
}

export async function memberCheckin(memberId: string) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("member_token") : null;
  const response = await fetch(`/api/member/checkin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ memberId }),
  });
  return response.json();
}

export async function getMemberDashboard() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("member_token") : null;
  const response = await fetch(`/api/member/dashboard`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return response.json();
}

export function saveMemberSession(token: string, member: Member) {
  if (typeof window !== "undefined") {
    localStorage.setItem("member_token", token);
    localStorage.setItem("member_data", JSON.stringify(member));
  }
}

export function getMemberSession(): {
  token: string | null;
  member: Member | null;
} {
  if (typeof window === "undefined") {
    return { token: null, member: null };
  }
  return {
    token: localStorage.getItem("member_token"),
    member: JSON.parse(localStorage.getItem("member_data") || "null"),
  };
}

export function clearMemberSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("member_token");
    localStorage.removeItem("member_data");
  }
}

export async function resetMemberPassword(phone: string, newPassword: string) {
  const response = await fetch(`/api/member/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, newPassword }),
  });
  return response.json();
}

export async function resetOwnerPassword(
  email: string | null,
  phone: string | null,
  newPassword: string,
) {
  const response = await fetch(`/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, phone, newPassword }),
  });
  return response.json();
}
