"use client"

import { Activity, Zap, Wifi } from "lucide-react"
import type { ConnectionStats } from "@/hooks/use-connection"

interface ConnectionStatsCardProps {
  stats: ConnectionStats | null
}

export function ConnectionStatsCard({ stats }: ConnectionStatsCardProps) {
  if (!stats) return null

  const getQualityColor = (quality: number) => {
    if (quality >= 4) return "bg-green-500"
    if (quality >= 3) return "bg-yellow-500"
    return "bg-orange-500"
  }

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {/* Speed Stats */}
      <div className="p-4 rounded-lg bg-white/50 dark:bg-black/10 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-xs text-muted-foreground">Download</span>
        </div>
        <div className="text-2xl font-bold text-primary">{stats.downloadSpeed.toFixed(1)}</div>
        <div className="text-xs text-muted-foreground">MB/s</div>
      </div>

      <div className="p-4 rounded-lg bg-white/50 dark:bg-black/10 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-xs text-muted-foreground">Upload</span>
        </div>
        <div className="text-2xl font-bold text-primary">{stats.uploadSpeed.toFixed(1)}</div>
        <div className="text-xs text-muted-foreground">MB/s</div>
      </div>

      {/* Latency */}
      <div className="p-4 rounded-lg bg-white/50 dark:bg-black/10 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-accent" />
          <span className="text-xs text-muted-foreground">Latency</span>
        </div>
        <div className="text-2xl font-bold text-primary">{stats.latency}</div>
        <div className="text-xs text-muted-foreground">ms</div>
      </div>

      {/* Quality */}
      <div className="p-4 rounded-lg bg-white/50 dark:bg-black/10 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Wifi className="w-4 h-4 text-accent" />
          <span className="text-xs text-muted-foreground">Quality</span>
        </div>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${i < stats.quality ? getQualityColor(stats.quality) : "bg-border"}`}
            />
          ))}
        </div>
      </div>

      {/* Connection Time */}
      <div className="p-4 rounded-lg bg-white/50 dark:bg-black/10 border border-border col-span-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Connection Duration</span>
          <span className="font-bold text-primary">{stats.connectionTime.toFixed(1)}s</span>
        </div>
      </div>
    </div>
  )
}
