import { existsSync } from "node:fs";
import { makeWASocket, useMultiFileAuthState } from "baileys";
import { env } from "../lib/env";

let cachedSocket: Awaited<ReturnType<typeof makeSocket>> | null = null;

async function makeSocket() {
  const auth = await useMultiFileAuthState(env.sessionPath);
  const socket = makeWASocket({
    auth: auth.state,
    printQRInTerminal: true,
  });

  socket.ev.on("creds.update", auth.saveCreds);
  return socket;
}

export async function sendWhatsAppMessage(to: string, message: string) {
  if (!existsSync(env.sessionPath)) {
    throw new Error("WhatsApp not configured. No Baileys session found.");
  }

  cachedSocket ??= await makeSocket();
  await cachedSocket.sendMessage(`${to.replace(/\D/g, "")}@s.whatsapp.net`, {
    text: message,
  });
  return { success: true, provider: "baileys" };
}
