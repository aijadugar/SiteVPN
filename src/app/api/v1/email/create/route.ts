import { NextResponse } from "next/server"

import { dispatchUserWebhook } from "@/lib/webhooks"
import { makeInbox, requireV1ApiUser } from "@/lib/v1-api"

export async function GET(request: Request) {
  const auth = await requireV1ApiUser(request)
  if (!auth.ok) return auth.response

  const inbox = makeInbox()
  await dispatchUserWebhook(auth.user.id, "email.created", inbox)

  return NextResponse.json(inbox)
}
