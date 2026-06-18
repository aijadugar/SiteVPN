import crypto from "crypto"

import { prisma } from "@/lib/prisma"

export function signWebhookPayload(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex")
}

export async function dispatchUserWebhook(userId: string, event: string, data: unknown) {
  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { user_id: userId },
  })

  await Promise.allSettled(
    endpoints.map(async (endpoint) => {
      const payload = JSON.stringify({
        event,
        created_at: new Date().toISOString(),
        data,
      })

      await fetch(endpoint.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-SiteVPN-Event": event,
          "X-SiteVPN-Signature": `sha256=${signWebhookPayload(payload, endpoint.secret)}`,
        },
        body: payload,
      })
    }),
  )
}
