import { NextResponse } from "next/server"

import { validateApiBearerToken } from "@/lib/api-keys"

export async function requireV1ApiUser(request: Request) {
  const result = await validateApiBearerToken(request.headers.get("authorization"))

  if (!result.ok) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: result.error }, { status: result.status }),
    }
  }

  return result
}

export const vpnServers = [
  { id: "nl-ams-01", country: "Netherlands", city: "Amsterdam", latency_ms: 12, uptime_pct: 99.98, load_score: 0.92 },
  { id: "in-mum-01", country: "India", city: "Mumbai", latency_ms: 8, uptime_pct: 99.91, load_score: 0.74 },
  { id: "jp-tyo-01", country: "Japan", city: "Tokyo", latency_ms: 33, uptime_pct: 99.96, load_score: 0.86 },
  { id: "us-nyc-01", country: "United States", city: "New York", latency_ms: 42, uptime_pct: 99.94, load_score: 0.88 },
]

export function makeInbox() {
  const id = `inbox_${crypto.randomUUID()}`
  return {
    inbox_id: id,
    address: `${id.slice(6, 14)}@sitevpn.email`,
  }
}

export function mockEmailMessages(inboxId: string) {
  return [
    {
      id: `msg_${inboxId.slice(-8)}`,
      sender: "verify@example.com",
      subject: "Your verification code",
      body: "Your OTP is 493812. It expires in 10 minutes.",
      received_at: new Date().toISOString(),
    },
  ]
}

export function mockSms(numberId: string) {
  return [
    {
      id: `sms_${numberId.slice(-8)}`,
      from: "VERIFY",
      body: "Your SiteVPN test code is 849201.",
      received_at: new Date().toISOString(),
    },
  ]
}
