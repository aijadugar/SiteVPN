import crypto from "crypto"

import { prisma } from "@/lib/prisma"

export function hashApiKey(key: string) {
  return crypto.createHash("sha256").update(key).digest("hex")
}

export function createPlainApiKey() {
  return `svpn_${crypto.randomBytes(32).toString("base64url")}`
}

export async function validateApiBearerToken(authorization: string | null) {
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]

  if (!token) {
    return { ok: false as const, status: 401, error: "Missing Bearer token." }
  }

  const apiKey = await prisma.apiKey.findUnique({
    where: { key_hash: hashApiKey(token) },
    include: { user: { select: { id: true, email: true, plan: true } } },
  })

  if (!apiKey) {
    return { ok: false as const, status: 401, error: "Invalid API key." }
  }

  if (apiKey.user.plan !== "business") {
    return { ok: false as const, status: 403, error: "Business plan required." }
  }

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { last_used: new Date() },
  })

  return { ok: true as const, user: apiKey.user, apiKeyId: apiKey.id }
}
