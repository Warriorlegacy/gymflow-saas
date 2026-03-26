"use client";

import { useRouter } from "next/navigation";
import { Button } from "@gymflow/ui";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/demo-logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button onClick={handleLogout} variant="outline">
      Logout
    </Button>
  );
}

