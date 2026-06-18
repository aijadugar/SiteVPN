import { NextResponse } from "next/server"

import { dispatchUserWebhook } from "@/lib/webhooks"
import { mockSms, requireV1ApiUser } from "@/lib/v1-api"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireV1ApiUser(request)
  if (!auth.ok) return auth.response

  const { id } = await params
  const messages = mockSms(id)
  await dispatchUserWebhook(auth.user.id, "sms.received", { number_id: id, message: messages[0] })

  return NextResponse.json({ number_id: id, messages })
}
