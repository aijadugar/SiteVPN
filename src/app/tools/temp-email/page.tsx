import type { Metadata } from "next"
import { Mail } from "lucide-react"

import { ToolLandingPage } from "@/components/tool-landing-page"

export const metadata: Metadata = {
  title: "Free Temp Email - Disposable Email Inbox | SiteVPN",
  description: "Create a free temp email address for website signups, OTPs, and spam-free browsing.",
  alternates: { canonical: "/tools/temp-email" },
}

export default function TempEmailToolPage() {
  return (
    <ToolLandingPage
      icon={Mail}
      eyebrow="Free temp email"
      title="Free temp email for spam-free signups"
      description="Generate disposable inboxes from SiteVPN and keep newsletters, trackers, and verification messages away from your real email."
      bullets={[
        "Create random @sitevpn.email inboxes instantly.",
        "Auto-detect OTP codes and suspicious senders.",
        "Use one privacy dashboard for inboxes, VPN, and numbers.",
      ]}
    />
  )
}
