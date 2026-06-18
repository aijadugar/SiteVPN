import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { UnifiedPrivacyDashboard } from "@/components/unified-privacy-dashboard"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/dashboard")
  }

  return (
    <UnifiedPrivacyDashboard
      user={{
        email: session.user.email ?? "user@sitevpn.me",
        image: session.user.image,
        plan: session.user.plan ?? "free",
      }}
    />
  )
}
