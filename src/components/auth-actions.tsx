"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { LogOut, User } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AuthActions() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="h-9 w-24 rounded-md bg-muted animate-pulse" />
  }

  if (!session?.user) {
    return (
      <Button asChild size="sm">
        <Link href="/auth/sign-in">Sign in</Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard">
          <User className="w-4 h-4" />
          {session.user.plan}
        </Link>
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Sign out" onClick={() => signOut({ callbackUrl: "/" })}>
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  )
}
