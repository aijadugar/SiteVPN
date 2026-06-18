"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function UpgradeButton({ plan }: { plan: "pro" | "business" }) {
  const [isLoading, setIsLoading] = useState(false)

  const startCheckout = async () => {
    setIsLoading(true)
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })
    const data = await response.json()
    setIsLoading(false)

    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <Button onClick={startCheckout} disabled={isLoading} className="w-full">
      <ArrowUpRight className="w-4 h-4" />
      {isLoading ? "Opening checkout..." : `Upgrade to ${plan}`}
    </Button>
  )
}
