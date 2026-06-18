import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { draftEmailReply } from "@/lib/ai"
import { authOptions } from "@/lib/auth"

const schema = z.object({
  fromAddress: z.string().email(),
  sender: z.string().min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  }

  if (session.user.plan === "free") {
    return NextResponse.json({ error: "AI Reply is available on Pro and Business plans." }, { status: 403 })
  }

  const parsed = schema.safeParse(await request.json())

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reply request." }, { status: 400 })
  }

  const draft = await draftEmailReply(parsed.data)
  return NextResponse.json({ draft })
}
