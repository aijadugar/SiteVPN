"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { CheckCircle2, Clock, Lock, Zap, Shield, X } from "lucide-react"

interface ConnectionStep {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: "pending" | "in-progress" | "complete"
}

interface ConnectionFlowModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConnectionFlowModal({ isOpen, onClose }: ConnectionFlowModalProps) {
  const [steps, setSteps] = useState<ConnectionStep[]>([
    {
      id: "1",
      label: "Negotiating secure tunnel",
      description: "Establishing TLS connection with server",
      icon: Clock,
      status: "pending",
    },
    {
      id: "2",
      label: "Authenticating server",
      description: "Verifying server certificate",
      icon: Shield,
      status: "pending",
    },
    {
      id: "3",
      label: "Exchange keys",
      description: "Negotiating AES-256-GCM encryption",
      icon: Lock,
      status: "pending",
    },
    {
      id: "4",
      label: "Secure channel established",
      description: "Connection complete and encrypted",
      icon: CheckCircle2,
      status: "pending",
    },
  ])

  useEffect(() => {
    if (!isOpen) return

    const timestamps = [500, 1200, 2000, 2800]
    const timers = timestamps.map((delay, idx) =>
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) => {
            if (i === idx) return { ...step, status: "in-progress" }
            if (i < idx) return { ...step, status: "complete" }
            return step
          }),
        )

        if (idx === 3) {
          setTimeout(() => {
            setSteps((prev) => prev.map((step) => ({ ...step, status: "complete" })))
          }, 600)
        }
      }, delay),
    )

    return () => timers.forEach(clearTimeout)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Establishing Connection
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Initializing secure VPN tunnel...</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 dark:hover:bg-black/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.id}
                className={`p-4 rounded-lg border transition-all ${
                  step.status === "complete"
                    ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30"
                    : step.status === "in-progress"
                      ? "bg-accent/10 border-accent/50 animate-pulse"
                      : "bg-white/5 dark:bg-black/10 border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0 mt-1">
                    {step.status === "complete" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : step.status === "in-progress" ? (
                      <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-border" />
                    )}

                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute top-5 left-2.5 w-0.5 h-6 transition-colors ${
                          step.status === "complete" ? "bg-green-500" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{step.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/5 dark:bg-black/10 text-center text-xs text-muted-foreground">
          <p>Estimated time: ~3 seconds</p>
        </div>
      </div>
    </div>
  )
}
