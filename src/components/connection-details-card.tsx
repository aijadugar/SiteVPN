"use client"

import { useState } from "react"
import { ChevronDown, Lock, Server, Briefcase as Certificate, Shield } from "lucide-react"
import type { ConnectionDetails } from "@/hooks/use-connection"

interface ConnectionDetailsCardProps {
  details: ConnectionDetails | null
}

export function ConnectionDetailsCard({ details }: ConnectionDetailsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!details) return null

  return (
    <div className="mt-6 p-4 rounded-lg border border-border bg-white/50 dark:bg-black/10">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between hover:text-primary transition-colors"
      >
        <div className="flex items-center gap-2 font-medium text-sm">
          <Certificate className="w-4 h-4" />
          Connection Details
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Protocol
            </span>
            <span className="font-medium">{details.protocol}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Encryption
            </span>
            <span className="font-medium">{details.encryption}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Certificate className="w-4 h-4" />
              Cert Expiry
            </span>
            <span className="font-medium text-xs">{details.serverCertExpiry}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Server className="w-4 h-4" />
              Location
            </span>
            <span className="font-medium">{details.serverLocation}</span>
          </div>

          {details.noLogs && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-200 dark:border-green-500/30">
              <p className="text-xs text-green-800 dark:text-green-300">
                ✓ No-logs policy enforced. Your connection is not stored or tracked.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
