"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
  { name: "Free", monthly: 0, annual: 0, features: ["1 VPN server", "5 temp emails/day", "3 OTPs/day"] },
  { name: "Pro", monthly: 9, annual: 90, features: ["20 VPN servers", "Unlimited temp emails", "50 OTPs/day"], popular: true },
  { name: "Business", monthly: 29, annual: 290, features: ["Unlimited usage", "Developer API", "Signed webhooks"] },
]

export function LandingPricing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly")

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-cyan-200">Simple pricing</p>
          <h2 className="mt-2 text-3xl font-semibold text-zinc-100">Start free, upgrade when you need more privacy</h2>
        </div>
        <div className="inline-flex w-fit rounded-md border border-white/10 bg-zinc-900 p-1">
          {(["monthly", "annual"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setBilling(option)}
              className={cn(
                "rounded px-4 py-2 text-sm capitalize text-zinc-400",
                billing === option && "bg-cyan-300 text-zinc-950",
              )}
            >
              {option === "annual" ? "Annual - 2 months free" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={cn(
              "relative rounded-lg border border-white/10 bg-zinc-900/70 p-6",
              plan.popular && "border-cyan-300/40 shadow-2xl shadow-cyan-950/20",
            )}
          >
            {plan.popular && (
              <span className="absolute right-4 top-4 rounded-full bg-cyan-300 px-3 py-1 text-xs font-semibold text-zinc-950">
                Most popular
              </span>
            )}
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-4 text-4xl font-bold">
              ${billing === "monthly" ? plan.monthly : plan.annual}
              <span className="text-sm font-normal text-zinc-500">/{billing === "monthly" ? "mo" : "yr"}</span>
            </p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-zinc-300">
                  <Check className="size-4 text-emerald-300" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full bg-cyan-300 text-zinc-950 hover:bg-cyan-200">
              <Link href="/signup">{plan.name === "Free" ? "Start free" : `Choose ${plan.name}`}</Link>
            </Button>
          </article>
        ))}
      </div>
    </section>
  )
}
