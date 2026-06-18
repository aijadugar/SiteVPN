"use client"

import { useEffect, useState } from "react"

export function VPNConnectionAnimation() {
  const [layer, setLayer] = useState<1 | 2 | 3>(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setLayer((prev) => {
        if (prev === 1) return 2
        if (prev === 2) return 3
        return 1
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-48 h-48">
        {/* SVG Circle Animation */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {/* Outer layer (spinning bar) */}
          <circle cx="100" cy="100" r="95" fill="none" stroke="#e5e7eb" strokeWidth="3" />

          {/* Rotating progress bar */}
          <defs>
            <style>
              {`
                @keyframes spin-bar {
                  from { transform: rotate(0deg); transform-origin: 100px 100px; }
                  to { transform: rotate(360deg); transform-origin: 100px 100px; }
                }
                .spin-bar { animation: spin-bar 2s linear infinite; }
              `}
            </style>
          </defs>
          <g className="spin-bar">
            <line x1="100" y1="10" x2="100" y2="25" stroke="#00c8c8" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Pulsing layers */}
          {/* Layer 1 - always visible, pulses when active */}
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke="#00c8c8"
            strokeWidth="2"
            opacity={layer === 1 ? 1 : 0.3}
            className={layer === 1 ? "animate-pulse" : ""}
          />

          {/* Layer 2 - pulses when active */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#00d9ff"
            strokeWidth="2"
            opacity={layer === 2 ? 0.8 : 0.2}
            className={layer === 2 ? "animate-pulse" : ""}
          />

          {/* Layer 3 - pulses when active */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#00c8c8"
            strokeWidth="2"
            opacity={layer === 3 ? 0.6 : 0.15}
            className={layer === 3 ? "animate-pulse" : ""}
          />

          {/* WiFi symbol in center */}
          <g transform="translate(100, 100)">
            {/* WiFi waves */}
            <path d="M -8 0 Q -12 -8 -16 -12" fill="none" stroke="#00c8c8" strokeWidth="2" strokeLinecap="round" />
            <path d="M 0 0 Q -5 -10 -10 -15" fill="none" stroke="#00c8c8" strokeWidth="2" strokeLinecap="round" />
            <path d="M 8 0 Q 3 -10 -2 -15" fill="none" stroke="#00c8c8" strokeWidth="2" strokeLinecap="round" />
            {/* WiFi dot */}
            <circle cx="0" cy="8" r="2" fill="#00c8c8" />
          </g>
        </svg>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mt-2">
          {layer === 1 && "Negotiating secure tunnel"}
          {layer === 2 && "Authenticating server"}
          {layer === 3 && "Exchanging keys"}
        </p>
        <p className="text-lg font-semibold text-foreground">Connecting VPN...</p>
      </div>
    </div>
  )
}
