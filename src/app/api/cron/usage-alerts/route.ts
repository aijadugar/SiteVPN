import { NextResponse } from "next/server"

import { PLAN_LIMITS } from "@/lib/plans"
import { prisma } from "@/lib/prisma"

function startOfUtcDay() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")

  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      plan: true,
      usageLogs: {
        where: { date: startOfUtcDay() },
      },
    },
  })

  const nudges = users.flatMap((user) =>
    user.usageLogs
      .map((log) => {
        const feature = log.feature as keyof typeof PLAN_LIMITS.free
        const limit = PLAN_LIMITS[user.plan][feature]
        if (!limit || log.count / limit <= 0.9) return null
        return {
          userId: user.id,
          email: user.email,
          feature: log.feature,
          used: log.count,
          limit,
          upgradeUrl: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/dashboard`,
        }
      })
      .filter(Boolean),
  )

  return NextResponse.json({
    ok: true,
    nudges,
    note: "Connect this route to your email provider to send upgrade nudges.",
  })
}
