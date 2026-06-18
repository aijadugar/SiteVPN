import type { Metadata } from "next"
import { Phone } from "lucide-react"

import { ToolLandingPage } from "@/components/tool-landing-page"

export const metadata: Metadata = {
  title: "Temporary Phone Number for Verification | SiteVPN",
  description: "Use a temporary phone number to receive SMS verification codes without exposing your real number.",
  alternates: { canonical: "/tools/temp-number" },
}

export default function TempNumberToolPage() {
  return (
    <ToolLandingPage
      icon={Phone}
      eyebrow="Temporary phone number"
      title="Temporary phone number for private verification"
      description="Receive account verification SMS codes through anonymous numbers and avoid sharing your personal phone number with every signup."
      bullets={[
        "Pick a country and receive an assigned number.",
        "Highlight 4-8 digit OTP codes automatically.",
        "Keep SMS verification separate from your real identity.",
      ]}
    />
  )
}
