import "server-only";

import "server-only";

import { z } from "zod";

const whatsappEnvSchema = z.object({
  WHATSAPP_PROVIDER: z.string().trim().min(1),
  WHATSAPP_API_URL: z.url(),
  WHATSAPP_API_TOKEN: z.string().min(1),
});

export type WhatsAppMessage = {
  outboxId: string;
  recipient: string;
  body: string;
};

export type WhatsAppDelivery = {
  providerMessageId: string;
  sentAt: string;
};

export interface WhatsAppProvider {
  send(message: WhatsAppMessage): Promise<WhatsAppDelivery>;
}

export function getWhatsAppProviderConfig() {
  const result = whatsappEnvSchema.safeParse({
    WHATSAPP_PROVIDER: process.env.WHATSAPP_PROVIDER,
    WHATSAPP_API_URL: process.env.WHATSAPP_API_URL,
    WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN,
  });
  return result.success ? result.data : null;
}

export function createWhatsAppProvider(): WhatsAppProvider | null {
  // O adapter concreto será escolhido quando a API for definida. Até lá, a
  // automação financeira grava itens idempotentes no outbox sem tentar enviar.
  return null;
}
