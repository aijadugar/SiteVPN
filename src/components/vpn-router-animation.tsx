"use client"

export function VPNRouterAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg className="w-40 h-40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* WiFi waves */}
        <g stroke="#00c8c8" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M 60 80 Q 80 60 100 60 Q 120 60 140 80" />
          <path d="M 50 95 Q 75 70 100 70 Q 125 70 150 95" />
          <path d="M 40 110 Q 70 80 100 80 Q 130 80 160 110" />
        </g>

        {/* Router body */}
        <rect x="50" y="120" width="100" height="50" rx="8" fill="#1f2937" stroke="#00c8c8" strokeWidth="2" />

        {/* Router antennas */}
        <g stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
          <line x1="50" y1="120" x2="40" y2="100" />
          <line x1="150" y1="120" x2="160" y2="100" />
        </g>

        {/* LED lights */}
        <circle cx="65" cy="140" r="3" fill="#00d9ff" />
        <circle cx="80" cy="140" r="3" fill="#00d9ff" />
        <circle cx="95" cy="140" r="3" fill="#00d9ff" />
        <circle cx="110" cy="140" r="3" fill="#00d9ff" />

        {/* Power button */}
        <circle cx="130" cy="145" r="5" fill="none" stroke="#00c8c8" strokeWidth="1.5" />
        <circle cx="130" cy="145" r="2" fill="#00c8c8" />

        {/* VPN text */}
        <text x="100" y="115" textAnchor="middle" fill="#00c8c8" fontSize="14" fontWeight="bold" fontFamily="Arial">
          VPN
        </text>
      </svg>

      <div className="mt-8 text-center">
        <p className="text-lg font-semibold text-foreground">VPN Connected</p>
        <p className="text-sm text-green-600 dark:text-green-400 mt-2">Secure connection established</p>
      </div>
    </div>
  )
}
