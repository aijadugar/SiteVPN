"use client"

import type React from "react"

import { Copy, CheckCircle } from "lucide-react"
import { useState } from "react"

interface AvailableNumbersSelectorProps {
  numbers: string[]
  onSelect: (number: string) => void
  country?: string
}

export function AvailableNumbersSelector({ numbers, onSelect, country }: AvailableNumbersSelectorProps) {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null)

  const handleCopy = (number: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(number)
    setCopiedNumber(number)
    setTimeout(() => setCopiedNumber(null), 2000)
  }

  if (numbers.length === 0) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {country && (
        <p className="text-sm text-muted-foreground mb-2">
          Available numbers in {country}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {numbers.map((number) => (
          <div
            key={number}
            onClick={() => onSelect(number)}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-md hover:bg-primary/5 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold text-primary">{number}</span>
              <button
                onClick={(e) => handleCopy(number, e)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Copy number"
              >
                {copiedNumber === number ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
