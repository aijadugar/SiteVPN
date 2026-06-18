import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getPriceIdForPlan, getStripe } from "@/lib/stripe"

const checkoutSchema = z.object({
  plan: z.enum(["pro", "business"]),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  }

  const parsed = checkoutSchema.safeParse(await request.json())

  if (!parsed.success) {
    return NextResponse.json({ error: "Choose Pro or Business." }, { status: 400 })
  }

  const priceId = getPriceIdForPlan(parsed.data.plan)

  if (!priceId) {
    return NextResponse.json({ error: "Stripe price ID is not configured." }, { status: 500 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true, email: true },
  })

  const baseUrl = process.env.NEXTAUTH_URL ?? new URL(request.url).origin

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer: user?.stripeCustomerId ?? undefined,
    customer_email: user?.stripeCustomerId ? undefined : session.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url: `${baseUrl}/dashboard?checkout=cancelled`,
    metadata: {
      userId: session.user.id,
      plan: parsed.data.plan,
    },
    subscription_data: {
      metadata: {
        userId: session.user.id,
        plan: parsed.data.plan,
      },
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
