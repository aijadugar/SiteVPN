import { NextResponse } from "next/server"

import { dispatchUserWebhook } from "@/lib/webhooks"
import { mockEmailMessages, requireV1ApiUser } from "@/lib/v1-api"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireV1ApiUser(request)
  if (!auth.ok) return auth.response

  const { id } = await params
  const messages = mockEmailMessages(id)
  await dispatchUserWebhook(auth.user.id, "email.received", { inbox_id: id, message: messages[0] })

  return NextResponse.json({ inbox_id: id, messages })
}
