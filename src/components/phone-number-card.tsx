"use client"

import { Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface PhoneNumberCardProps {
  phoneNumber: string
  status: "online" | "receiving" | "paused"
}

export function PhoneNumberCard({ phoneNumber, status }: PhoneNumberCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case "online":
        return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300"
      case "receiving":
        return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
      default:
        return "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="p-6 bg-white dark:bg-card border-2 border-primary/30 rounded-xl">
      <div className="text-center mb-6">
        <p className="text-xs text-muted-foreground mb-2">Your Temporary Number</p>
        <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
          <p className="font-mono text-2xl font-bold text-primary">{phoneNumber}</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6 flex justify-center">
        <span className={`px-4 py-2 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status === "online"
            ? "🟢 Online - Receiving SMS"
            : status === "receiving"
              ? "🔵 Receiving SMS"
              : "⚫ Paused"}
        </span>
      </div>

      {/* Action */}
      <Button onClick={handleCopy} className="w-full gap-2 bg-primary">
        {copied ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy Number
          </>
        )}
      </Button>
    </div>
  )
}
