import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { checkUsageLimit, recordUsage } from "@/lib/usage"

const usageSchema = z.object({
  feature: z.enum(["vpn", "temp_emails", "otps", "api_keys"]),
  amount: z.number().int().positive().max(100).default(1),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  }

  const parsed = usageSchema.safeParse(await request.json())

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid usage request." }, { status: 400 })
  }

  const usage = await checkUsageLimit(session.user.id, parsed.data.feature, parsed.data.amount)

  if (!usage.allowed) {
    return NextResponse.json(
      {
        error: "Usage limit reached for your plan.",
        usage,
      },
      { status: 429 },
    )
  }

  await recordUsage(session.user.id, parsed.data.feature, parsed.data.amount)

  return NextResponse.json({ ok: true, usage })
}
