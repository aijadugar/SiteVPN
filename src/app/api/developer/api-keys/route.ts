import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { createPlainApiKey, hashApiKey } from "@/lib/api-keys"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  }

  if (session.user.plan !== "business") {
    return NextResponse.json({ error: "Business plan required." }, { status: 403 })
  }

  const keys = await prisma.apiKey.findMany({
    where: { user_id: session.user.id },
    select: { id: true, created_at: true, last_used: true },
    orderBy: { created_at: "desc" },
  })

  return NextResponse.json({ keys })
}

export async function POST() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  }

  if (session.user.plan !== "business") {
    return NextResponse.json({ error: "Business plan required." }, { status: 403 })
  }

  const key = createPlainApiKey()

  await prisma.apiKey.create({
    data: {
      key_hash: hashApiKey(key),
      user_id: session.user.id,
    },
  })

  return NextResponse.json({ key })
}
