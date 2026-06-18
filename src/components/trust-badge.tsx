import type { ReactNode } from "react"
import { Info } from "lucide-react"

interface TrustBadgeProps {
  icon: ReactNode
  label: string
  tooltip: string
}

export function TrustBadge({ icon, label, tooltip }: TrustBadgeProps) {
  return (
    <div className="group relative inline-flex items-center gap-2 px-3 py-2 bg-white/5 dark:bg-black/10 rounded-lg border border-white/10 dark:border-white/5 hover:bg-white/10 dark:hover:bg-black/20 transition-colors cursor-help">
      {icon}
      <span className="text-xs font-medium text-foreground/70">{label}</span>
      <Info className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
        {tooltip}
      </div>
    </div>
  )
}
