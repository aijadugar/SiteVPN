import { prisma } from "@/lib/prisma"
import { PLAN_LIMITS, type Feature } from "@/lib/plans"

function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

export async function checkUsageLimit(userId: string, feature: Feature, incrementBy = 1) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })

  if (!user) {
    return { allowed: false, limit: 0, used: 0, remaining: 0 }
  }

  const limit = PLAN_LIMITS[user.plan][feature]

  if (limit === null) {
    return { allowed: true, limit, used: 0, remaining: null }
  }

  const today = startOfUtcDay()
  const usage = await prisma.usageLog.findUnique({
    where: {
      userId_feature_date: {
        userId,
        feature,
        date: today,
      },
    },
  })

  const used = usage?.count ?? 0
  const allowed = used + incrementBy <= limit

  return {
    allowed,
    limit,
    used,
    remaining: Math.max(limit - used, 0),
  }
}

export async function recordUsage(userId: string, feature: Feature, incrementBy = 1) {
  return prisma.usageLog.upsert({
    where: {
      userId_feature_date: {
        userId,
        feature,
        date: startOfUtcDay(),
      },
    },
    create: {
      userId,
      feature,
      count: incrementBy,
      date: startOfUtcDay(),
    },
    update: {
      count: {
        increment: incrementBy,
      },
    },
  })
}
