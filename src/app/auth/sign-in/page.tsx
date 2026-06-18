"use client"

import { FormEvent, Suspense, useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Chrome, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
  const [mode, setMode] = useState<"sign-in" | "register">("sign-in")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    if (mode === "register") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const body = await response.json()
        setError(body.error ?? "Could not create account.")
        setIsLoading(false)
        return
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    })

    setIsLoading(false)

    if (result?.error) {
      setError("Email or password is incorrect.")
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <Link href="/" className="mb-6 flex items-center gap-3">
          <img src="/sitevpn_logo.png" alt="SiteVPN" className="h-10 w-10 rounded-lg" />
          <span className="text-xl font-bold">SiteVPN</span>
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{mode === "sign-in" ? "Sign in" : "Create account"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Use SiteVPN tools with your plan and usage limits.</p>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => signIn("google", { callbackUrl })}
          type="button"
        >
          <Chrome className="w-4 h-4" />
          Continue with Google
        </Button>

        <div className="my-5 h-px bg-border" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" type="submit" disabled={isLoading}>
            <Lock className="w-4 h-4" />
            {isLoading ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <button
          className="mt-5 text-sm text-primary hover:underline"
          type="button"
          onClick={() => {
            setError("")
            setMode(mode === "sign-in" ? "register" : "sign-in")
          }}
        >
          {mode === "sign-in" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <SignInForm />
    </Suspense>
  )
}
