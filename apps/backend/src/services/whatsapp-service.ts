import { existsSync } from "node:fs";
import { makeWASocket, useMultiFileAuthState } from "baileys";
import { env } from "../lib/env";

let cachedSocket: Awaited<ReturnType<typeof makeSocket>> | null = null;

async function makeSocket() {
  const auth = await useMultiFileAuthState(env.sessionPath);
  const socket = makeWASocket({
    auth: auth.state,
    printQRInTerminal: true
  });

  socket.ev.on("creds.update", auth.saveCreds);
  return socket;
}

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    if (!existsSync(env.sessionPath)) {
      return { success: true, provider: "demo", note: "No Baileys session found, running in demo mode." };
    }

    cachedSocket ??= await makeSocket();
    await cachedSocket.sendMessage(`${to.replace(/\D/g, "")}@s.whatsapp.net`, { text: message });
    return { success: true, provider: "baileys" };
  } catch {
    return { success: true, provider: "demo", note: "Failed to send live message, returned demo success." };
  }
}

