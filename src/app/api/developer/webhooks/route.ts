import crypto from "crypto"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const webhookSchema = z.object({
  url: z.string().url(),
})

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  }

  if (session.user.plan !== "business") {
    return NextResponse.json({ error: "Business plan required." }, { status: 403 })
  }

  const webhooks = await prisma.webhookEndpoint.findMany({
    where: { user_id: session.user.id },
    select: { id: true, url: true, created_at: true },
    orderBy: { created_at: "desc" },
  })

  return NextResponse.json({ webhooks })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  }

  if (session.user.plan !== "business") {
    return NextResponse.json({ error: "Business plan required." }, { status: 403 })
  }

  const parsed = webhookSchema.safeParse(await request.json())

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid webhook URL." }, { status: 400 })
  }

  const webhook = await prisma.webhookEndpoint.create({
    data: {
      user_id: session.user.id,
      url: parsed.data.url,
      secret: crypto.randomBytes(32).toString("hex"),
    },
    select: { id: true, url: true, secret: true, created_at: true },
  })

  return NextResponse.json({ webhook })
}
