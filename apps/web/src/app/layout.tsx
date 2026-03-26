import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GymFlow SaaS",
  description: "Free-tier gym management SaaS with AI, WhatsApp, multi-tenant data isolation, and mobile support."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

