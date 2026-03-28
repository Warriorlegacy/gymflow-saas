import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "GymFlow — All-in-One Gym Management SaaS",
  description:
    "Run your entire gym business from one platform. Members, billing, AI coaching, attendance tracking, WhatsApp automation, and a mobile app — all on free-tier infrastructure.",
  keywords: [
    "gym management software",
    "gym SaaS",
    "fitness business",
    "member management",
    "AI coaching",
    "attendance tracking",
    "WhatsApp automation",
    "gym billing",
  ],
  openGraph: {
    title: "GymFlow — All-in-One Gym Management SaaS",
    description:
      "Members, billing, AI coaching, attendance, WhatsApp — one platform, zero cost to start.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-50 font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
