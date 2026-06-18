import type { Metadata } from "next"
import { Shield } from "lucide-react"

import { ToolLandingPage } from "@/components/tool-landing-page"

export const metadata: Metadata = {
  title: "Free VPN No Logs - Private Browser VPN | SiteVPN",
  description: "Use a free VPN with no logs policy, smart server recommendations, and encrypted browsing from your SiteVPN dashboard.",
  alternates: { canonical: "/tools/vpn" },
}

export default function VpnToolPage() {
  return (
    <ToolLandingPage
      icon={Shield}
      eyebrow="Free VPN no logs"
      title="Free VPN with no logs for safer browsing"
      description="Mask your IP, connect to recommended servers, and access geo-blocked content safely with SiteVPN's no-logs VPN."
      bullets={[
        "Smart server recommendations based on latency and uptime.",
        "Masked IP display before and after connection.",
        "Upgrade for more regions and business API access.",
      ]}
    />
  )
}
