import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { DeveloperApiDashboard } from "@/components/developer-api-dashboard"
import { authOptions } from "@/lib/auth"

export default async function ApiKeysPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/dashboard/api-keys")
  }

  return <DeveloperApiDashboard plan={session.user.plan ?? "free"} />
}
