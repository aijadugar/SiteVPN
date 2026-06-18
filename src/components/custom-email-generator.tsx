"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface CustomEmailGeneratorProps {
  onGenerate: (prefix: string) => void
  isLoading: boolean
}

const DOMAINS = ["@temp123.net", "@tempmail.pro", "@privacy.dev"]

export function CustomEmailGenerator({ onGenerate, isLoading }: CustomEmailGeneratorProps) {
  const [prefix, setPrefix] = useState("")
  const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0])
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)

  const validatePrefix = (value: string) => {
    setError(null)
    setIsValid(false)

    if (!value.trim()) {
      return
    }

    // Validate email prefix (alphanumeric, dots, hyphens, underscores)
    const regex = /^[a-zA-Z0-9._-]+$/
    if (!regex.test(value)) {
      setError("Only letters, numbers, dots, hyphens, and underscores allowed")
      return
    }

    if (value.length < 3) {
      setError("Prefix must be at least 3 characters")
      return
    }

    if (value.length > 30) {
      setError("Prefix must be less than 30 characters")
      return
    }

    setIsValid(true)
  }

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPrefix(value)
    validatePrefix(value)
  }

  const handleGenerate = () => {
    if (!isValid) return
    onGenerate(prefix + selectedDomain)
    setPrefix("")
    setSelectedDomain(DOMAINS[0])
    setIsValid(false)
  }

  return (
    <div className="bg-white dark:bg-card border border-border rounded-xl p-6 shadow-lg">
      <h3 className="font-semibold mb-4">Create Custom Email</h3>

      <div className="space-y-4">
        {/* Prefix Input */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Email Prefix</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="mychosenname"
              value={prefix}
              onChange={handlePrefixChange}
              className="flex-1 px-4 py-2 bg-white/5 dark:bg-black/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          {prefix && (
            <div className="mt-2 text-xs">
              {isValid ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{prefix + selectedDomain} is available</span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Domain Selector */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Domain</label>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 dark:bg-black/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
          >
            {DOMAINS.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        {/* Full Email Preview */}
        {isValid && (
          <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30">
            <p className="text-xs text-muted-foreground mb-1">Your email will be</p>
            <p className="font-mono font-bold text-primary text-sm break-all">{prefix + selectedDomain}</p>
          </div>
        )}

        {/* Generate Button */}
        <Button onClick={handleGenerate} disabled={!isValid || isLoading} className="w-full bg-primary">
          {isLoading ? "Generating..." : "Generate Custom Email"}
        </Button>
      </div>
    </div>
  )
}
