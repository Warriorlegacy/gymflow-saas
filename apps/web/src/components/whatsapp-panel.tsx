"use client";

import { useState } from "react";
import { api } from "@gymflow/services";
import { Button, Card, Input } from "@gymflow/ui";

export function WhatsAppPanel() {
  const [phone, setPhone] = useState("+919876543210");
  const [message, setMessage] = useState("Hi Priya, your membership is expiring in 3 days. Reply to renew.");
  const [status, setStatus] = useState("No message sent yet.");

  async function handleSend() {
    const result = await api.sendWhatsAppMessage({
      to: phone,
      message,
      type: "expiry_reminder"
    });

    setStatus(result.success ? `Message queued via ${result.provider}.` : "Send failed.");
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-950">WhatsApp automation</h3>
        <p className="text-sm text-slate-500">Baileys-powered reminders for onboarding, payment follow-up, and expiry alerts.</p>
      </div>
      <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
      <textarea
        className="min-h-28 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-200"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <Button onClick={handleSend}>Send demo WhatsApp</Button>
      <p className="text-sm text-slate-600">{status}</p>
    </Card>
  );
}

