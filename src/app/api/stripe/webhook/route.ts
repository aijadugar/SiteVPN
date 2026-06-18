import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { prisma } from "@/lib/prisma"
import { STRIPE_PRICE_TO_PLAN, type Plan } from "@/lib/plans"
import { getStripe } from "@/lib/stripe"

async function updateUserPlanFromSubscription(subscription: Stripe.Subscription, fallbackUserId?: string) {
  const item = subscription.items.data[0]
  const priceId = item?.price.id
  const plan = (priceId && STRIPE_PRICE_TO_PLAN[priceId]) || (subscription.metadata.plan as Plan | undefined)
  const userId = subscription.metadata.userId || fallbackUserId

  if (!userId || !plan) {
    return
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: subscription.status === "active" || subscription.status === "trialing" ? plan : "free",
      stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
    },
  })
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing Stripe webhook configuration." }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 },
    )
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session

    if (checkoutSession.subscription) {
      const subscription = await getStripe().subscriptions.retrieve(checkoutSession.subscription.toString())
      await updateUserPlanFromSubscription(subscription, checkoutSession.metadata?.userId)
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.created"
  ) {
    await updateUserPlanFromSubscription(event.data.object as Stripe.Subscription)
  }

  return NextResponse.json({ received: true })
}
