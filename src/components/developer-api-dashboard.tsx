"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { Copy, KeyRound, LinkIcon, RefreshCcw, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Plan } from "@/lib/plans"

type ApiKeyMeta = {
  id: string
  created_at: string
  last_used: string | null
}

type WebhookMeta = {
  id: string
  url: string
  created_at: string
}

export function DeveloperApiDashboard({ plan }: { plan: Plan }) {
  const [keys, setKeys] = useState<ApiKeyMeta[]>([])
  const [webhooks, setWebhooks] = useState<WebhookMeta[]>([])
  const [newKey, setNewKey] = useState("")
  const [webhookSecret, setWebhookSecret] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [message, setMessage] = useState("")

  const loadData = async () => {
    const [keysResponse, webhooksResponse] = await Promise.all([
      fetch("/api/developer/api-keys"),
      fetch("/api/developer/webhooks"),
    ])

    if (keysResponse.ok) {
      setKeys((await keysResponse.json()).keys)
    }

    if (webhooksResponse.ok) {
      setWebhooks((await webhooksResponse.json()).webhooks)
    }
  }

  useEffect(() => {
    if (plan === "business") {
      void loadData()
    }
  }, [plan])

  const createKey = async () => {
    setMessage("")
    const response = await fetch("/api/developer/api-keys", { method: "POST" })
    const data = await response.json()

    if (!response.ok) {
      setMessage(data.error ?? "Could not create API key.")
      return
    }

    setNewKey(data.key)
    await loadData()
  }

  const registerWebhook = async (event: FormEvent) => {
    event.preventDefault()
    setMessage("")
    setWebhookSecret("")

    const response = await fetch("/api/developer/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl }),
    })
    const data = await response.json()

    if (!response.ok) {
      setMessage(data.error ?? "Could not register webhook.")
      return
    }

    setWebhookSecret(data.webhook.secret)
    setWebhookUrl("")
    await loadData()
  }

  if (plan !== "business") {
    return (
      <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
        <div className="mx-auto max-w-3xl rounded-lg border border-white/10 bg-zinc-900/70 p-6">
          <Shield className="mb-4 size-8 text-cyan-300" />
          <h1 className="text-2xl font-semibold">Developer API</h1>
          <p className="mt-3 text-zinc-400">API keys and webhooks are available on the Business plan.</p>
          <Button asChild className="mt-6">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-cyan-200">Business developer access</p>
            <h1 className="text-3xl font-semibold">API Keys and Webhooks</h1>
          </div>
          <Button asChild variant="outline">
            <Link href="/docs">Open API docs</Link>
          </Button>
        </div>

        {message && <p className="rounded-md border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100">{message}</p>}

        <section className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-semibold">
              <KeyRound className="size-4 text-cyan-300" />
              API keys
            </h2>
            <Button onClick={createKey}>
              <RefreshCcw className="size-4" />
              Generate key
            </Button>
          </div>

          {newKey && (
            <div className="mb-4 rounded-md border border-amber-400/20 bg-amber-400/10 p-3">
              <p className="mb-2 text-xs text-amber-100">Copy this key now. It will not be shown again.</p>
              <div className="flex gap-2">
                <code className="flex-1 break-all rounded bg-zinc-950 p-2 text-xs">{newKey}</code>
                <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(newKey)}>
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {keys.map((key) => (
              <div key={key.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-white/10 bg-zinc-950/60 p-3 text-sm">
                <span className="font-mono">{key.id}</span>
                <span className="text-zinc-500">Last used: {key.last_used ? new Date(key.last_used).toLocaleString() : "never"}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <LinkIcon className="size-4 text-cyan-300" />
            Webhook endpoint
          </h2>
          <form onSubmit={registerWebhook} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={webhookUrl}
              onChange={(event) => setWebhookUrl(event.target.value)}
              placeholder="https://example.com/sitevpn-webhook"
              className="border-white/10 bg-zinc-950"
            />
            <Button type="submit">Register</Button>
          </form>
          {webhookSecret && (
            <div className="mt-4 rounded-md border border-amber-400/20 bg-amber-400/10 p-3 text-sm">
              <p className="text-amber-100">Webhook signing secret</p>
              <code className="mt-2 block break-all rounded bg-zinc-950 p-2 text-xs">{webhookSecret}</code>
            </div>
          )}
          <div className="mt-4 space-y-2">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="rounded-md border border-white/10 bg-zinc-950/60 p-3 text-sm">
                <p className="break-all">{webhook.url}</p>
                <p className="mt-1 text-xs text-zinc-500">Created {new Date(webhook.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
