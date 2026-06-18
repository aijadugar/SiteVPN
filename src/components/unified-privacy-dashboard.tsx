"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  Bot,
  Check,
  Copy,
  CreditCard,
  Globe2,
  Inbox,
  KeyRound,
  Code2,
  Mail,
  Phone,
  Radio,
  RefreshCcw,
  Shield,
  Signal,
  UserCircle,
  Wifi,
} from "lucide-react"

import { UpgradeButton } from "@/components/upgrade-button"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PLAN_LIMITS, PLAN_LABELS, type Plan } from "@/lib/plans"
import { cn } from "@/lib/utils"

type Panel = "vpn" | "email" | "number" | "account" | "upgrade"

type DashboardUser = {
  email: string
  image?: string | null
  plan: Plan
}

type EmailTag = "safe" | "promotional" | "phishing" | "otp"

type TempEmail = {
  id: string
  sender: string
  subject: string
  time: string
  html: string
  type: EmailTag
  otp_code: string | null
  reason: string
}

type Recommendation = {
  id: string
  country: string
  city: string
  ping_ms: number
  uptime_pct: number
  load_score: number
  score: number
  reason: string
}

const servers = [
  {
    country: "Netherlands",
    flag: "NL",
    nodes: [
      { id: "nl-ams-01", city: "Amsterdam", ping: 12 },
      { id: "nl-ams-02", city: "Amsterdam", ping: 18 },
    ],
  },
  {
    country: "United States",
    flag: "US",
    nodes: [
      { id: "us-nyc-01", city: "New York", ping: 42 },
      { id: "us-sfo-01", city: "San Francisco", ping: 61 },
    ],
  },
  {
    country: "India",
    flag: "IN",
    nodes: [
      { id: "in-mum-01", city: "Mumbai", ping: 8 },
      { id: "in-blr-01", city: "Bengaluru", ping: 14 },
    ],
  },
  {
    country: "Japan",
    flag: "JP",
    nodes: [{ id: "jp-tyo-01", city: "Tokyo", ping: 33 }],
  },
]

const countries = [
  { code: "IN", name: "India", dial: "+91" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "JP", name: "Japan", dial: "+81" },
]

const starterEmails = [
  {
    id: "1",
    sender: "security@sitevpn.email",
    subject: "Your private inbox is ready",
    time: "now",
    html: "<p>Your temporary inbox is active. Messages refresh automatically while this dashboard is open.</p>",
    type: "safe" as const,
    otp_code: null,
    reason: "System message from SiteVPN.",
  },
]

const starterSms = [
  { id: "1", sender: "SiteVPN", body: "Your verification code is 482931. It expires in 10 minutes.", time: "now" },
]

function randomToken(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join("")
}

function usagePercent(used: number, limit: number | null) {
  if (limit === null) return 0
  return Math.min(Math.round((used / limit) * 100), 100)
}

function featureLabel(feature: "vpn" | "temp_emails" | "otps") {
  return feature === "vpn" ? "VPN" : feature === "temp_emails" ? "Temp Email" : "Temp Number"
}

function extractOtp(text: string) {
  return text.match(/\b\d{4,8}\b/)?.[0]
}

function tagStyles(type: EmailTag) {
  return {
    safe: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    promotional: "border-blue-400/20 bg-blue-400/10 text-blue-200",
    phishing: "border-red-400/20 bg-red-400/10 text-red-200",
    otp: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  }[type]
}

function MiniQr({ value }: { value: string }) {
  const blocks = useMemo(
    () =>
      Array.from({ length: 49 }, (_, index) => {
        const code = value.charCodeAt(index % Math.max(value.length, 1)) || 0
        return (code + index * 7) % 3 !== 0
      }),
    [value],
  )

  return (
    <div className="grid size-28 grid-cols-7 gap-1 rounded-md border border-white/10 bg-white p-2">
      {blocks.map((active, index) => (
        <span key={index} className={cn("rounded-[1px]", active ? "bg-zinc-950" : "bg-white")} />
      ))}
    </div>
  )
}

export function UnifiedPrivacyDashboard({ user }: { user: DashboardUser }) {
  const [activePanel, setActivePanel] = useState<Panel>("vpn")
  const [selectedServer, setSelectedServer] = useState("nl-ams-01")
  const [vpnStatus, setVpnStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [currentIp, setCurrentIp] = useState("103.74.19.28")
  const [vpnIp, setVpnIp] = useState("not connected")
  const [emailAddress, setEmailAddress] = useState(`quiet-${randomToken(6)}@sitevpn.email`)
  const [emails, setEmails] = useState<TempEmail[]>(starterEmails)
  const [selectedEmailId, setSelectedEmailId] = useState("1")
  const [replyDraft, setReplyDraft] = useState("")
  const [isDraftingReply, setIsDraftingReply] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [aiChip, setAiChip] = useState("Best server for streaming: NL Netherlands (12ms)")
  const [lastServersUsed, setLastServersUsed] = useState<string[]>([])
  const [alerts, setAlerts] = useState<string[]>([])
  const [otpAttempts, setOtpAttempts] = useState<Array<{ code: string; at: number }>>([])
  const [country, setCountry] = useState("IN")
  const [phoneNumber, setPhoneNumber] = useState("+91 83052 91477")
  const [smsMessages, setSmsMessages] = useState(starterSms)
  const [usage, setUsage] = useState({ vpn: 0, temp_emails: 1, otps: 1 })

  const selectedEmail = emails.find((email) => email.id === selectedEmailId) ?? emails[0]
  const planLimits = PLAN_LIMITS[user.plan]
  const totalLimit = [planLimits.vpn, planLimits.temp_emails, planLimits.otps].filter((limit) => limit !== null) as number[]
  const totalUsed = usage.vpn + usage.temp_emails + usage.otps
  const dailyLimit = totalLimit.reduce((sum, limit) => sum + limit, 0)
  const dailyUsagePercent = dailyLimit ? Math.min(Math.round((totalUsed / dailyLimit) * 100), 100) : 0

  const addClassifiedEmail = async (message: Pick<TempEmail, "id" | "sender" | "subject" | "time" | "html">) => {
    const body = message.html.replace(/<[^>]*>/g, " ")
    const response = await fetch("/api/ai/classify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: message.subject, sender: message.sender, body }),
    })
    const classification = response.ok
      ? await response.json()
      : { type: "safe", otp_code: null, reason: "Classification unavailable." }

    setEmails((current) => [
      {
        ...message,
        type: classification.type,
        otp_code: classification.otp_code,
        reason: classification.reason,
      },
      ...current.slice(0, 5),
    ])
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      const code = Math.floor(100000 + Math.random() * 899999)
      void addClassifiedEmail({
          id: Date.now().toString(),
          sender: "verify@login-gateway.io",
          subject: `Login confirmation code ${code}`,
          time: "just now",
          html: `<p>Your one-time password is <strong>${code}</strong>.</p><p>No tracking pixels were loaded.</p>`,
        })
    }, 10000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      const code = Math.floor(100000 + Math.random() * 899999)
      setSmsMessages((current) => [
        {
          id: Date.now().toString(),
          sender: "VERIFY",
          body: `Your OTP is ${code}. Do not share it with anyone.`,
          time: "just now",
        },
        ...current.slice(0, 5),
      ])
      setOtpAttempts((current) => {
        const next = [...current.filter((attempt) => Date.now() - attempt.at < 60000), { code: String(code), at: Date.now() }]
        const repeats = next.filter((attempt) => attempt.code === String(code)).length
        if (repeats >= 3) {
          setAlerts((alertsNow) => ["Bot-risk: the same OTP was requested 3x in 1 minute.", ...alertsNow.slice(0, 2)])
        }
        return next
      })
    }, 10000)

    return () => window.clearInterval(timer)
  }, [])

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const generateInbox = () => {
    setEmailAddress(`${randomToken(4)}-${randomToken(5)}@sitevpn.email`)
    setUsage((current) => ({ ...current, temp_emails: current.temp_emails + 1 }))
  }

  const assignNumber = (countryCode: string) => {
    const selected = countries.find((item) => item.code === countryCode) ?? countries[0]
    setCountry(countryCode)
    setPhoneNumber(`${selected.dial} ${Math.floor(70000 + Math.random() * 29999)} ${Math.floor(10000 + Math.random() * 89999)}`)
    setUsage((current) => ({ ...current, otps: current.otps + 1 }))
  }

  const requestRecommendations = async () => {
    const response = await fetch("/api/ai/recommend-server", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userLocation: "Asia/Calcutta",
        timeOfDay: new Date().toLocaleTimeString(),
        lastServersUsed,
      }),
    })

    if (!response.ok) return

    const data = await response.json()
    setRecommendations(data.recommendations ?? [])
    const top = data.recommendations?.[0]
    if (top) {
      setSelectedServer(top.id)
      setAiChip(`${top.reason}: ${top.country} (${top.ping_ms}ms)`)
    }
  }

  const toggleVpn = async () => {
    if (vpnStatus === "connected") {
      setVpnStatus("disconnected")
      setVpnIp("not connected")
      return
    }

    setVpnStatus("connecting")
    await requestRecommendations()
    window.setTimeout(() => {
      setVpnStatus("connected")
      setVpnIp("185.212.44.18")
      setCurrentIp("103.74.19.28")
      setUsage((current) => ({ ...current, vpn: current.vpn + 1 }))
      setLastServersUsed((current) => [selectedServer, ...current.filter((id) => id !== selectedServer)].slice(0, 3))
    }, 900)
  }

  const generateReply = async () => {
    if (!selectedEmail) return
    setIsDraftingReply(true)
    const response = await fetch("/api/ai/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromAddress: emailAddress,
        sender: selectedEmail.sender,
        subject: selectedEmail.subject,
        body: selectedEmail.html.replace(/<[^>]*>/g, " "),
      }),
    })
    const data = await response.json()
    setReplyDraft(response.ok ? data.draft : data.error)
    setIsDraftingReply(false)
  }

  const navItems = [
    { id: "vpn" as const, label: "VPN", icon: Shield },
    { id: "email" as const, label: "Temp Email", icon: Mail },
    { id: "number" as const, label: "Temp Number", icon: Phone },
    { id: "account" as const, label: "Account", icon: UserCircle },
    { id: "upgrade" as const, label: "Upgrade", icon: CreditCard },
  ]

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 bg-zinc-950/95 px-4 py-5">
          <div className="mb-8 flex items-center gap-3 px-2">
            <img src="/sitevpn_logo.png" alt="SiteVPN" className="size-10 rounded-md" />
            <div>
              <p className="text-sm font-semibold">SiteVPN</p>
              <p className="text-xs text-zinc-500">Privacy Console</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  className={cn(
                    "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-white",
                    activePanel === item.id && "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <Link
            href="/dashboard/api-keys"
            className="mt-3 flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <Code2 className="size-4" />
            Developer API
          </Link>

          <UsageCard usage={usage} plan={user.plan} onUpgrade={() => setActivePanel("upgrade")} />
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 flex min-h-16 flex-col gap-3 border-b border-white/10 bg-zinc-950/90 px-4 py-3 backdrop-blur md:flex-row md:items-center md:justify-between lg:px-6">
            <div>
              <h1 className="text-lg font-semibold">Unified Privacy Dashboard</h1>
              <p className="text-xs text-zinc-500">VPN, temporary inboxes, and private numbers in one workspace.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                {PLAN_LABELS[user.plan]} plan
              </span>
              <div className="min-w-44">
                <div className="mb-1 flex justify-between text-[11px] text-zinc-500">
                  <span>{totalUsed}/{dailyLimit || "unlimited"} daily used</span>
                  <span>{dailyLimit ? `${dailyUsagePercent}%` : "Unlimited"}</span>
                </div>
                <Progress value={dailyUsagePercent} className="h-1.5 bg-white/10" />
              </div>
              {user.image ? (
                <img src={user.image} alt={user.email} className="size-9 rounded-full" />
              ) : (
                <div className="grid size-9 place-items-center rounded-full bg-white/10 text-sm font-semibold">
                  {user.email.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
          </header>

          <div className="grid gap-5 p-4 lg:grid-cols-[1fr_320px] lg:p-6">
            <div className="space-y-5">
              {activePanel === "vpn" && (
                <PanelShell title="VPN" icon={Shield} eyebrow="Encrypted browser tunnel">
                  <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm text-zinc-400">Server selector</label>
                        <Select value={selectedServer} onValueChange={setSelectedServer}>
                          <SelectTrigger className="w-full border-white/10 bg-zinc-900 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {servers.map((group) => (
                              <SelectGroup key={group.country}>
                                <SelectLabel>{group.country}</SelectLabel>
                                {group.nodes.map((node) => (
                                  <SelectItem key={node.id} value={node.id}>
                                    {group.flag} {node.city} - {node.ping}ms
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                        <div className="flex items-center gap-2">
                          <Bot className="size-4" />
                          <span>{aiChip}</span>
                        </div>
                      </div>

                      {recommendations.length > 0 && (
                        <div className="grid gap-2">
                          {recommendations.map((item) => (
                            <div key={item.id} className="flex items-center justify-between rounded-md border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm">
                              <span>{item.country} - {item.city}</span>
                              <span className="text-zinc-500">{item.ping_ms}ms - score {item.score}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Metric label="Current IP" value={currentIp} />
                        <Metric label="VPN IP" value={vpnIp} />
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-zinc-900/70 p-6 text-center">
                      <span
                        className={cn(
                          "mb-5 grid size-24 place-items-center rounded-full border",
                          vpnStatus === "connected" && "border-emerald-400/40 bg-emerald-400/10 text-emerald-300 shadow-[0_0_40px_rgba(52,211,153,0.18)]",
                          vpnStatus === "connecting" && "animate-pulse border-amber-400/40 bg-amber-400/10 text-amber-200",
                          vpnStatus === "disconnected" && "border-white/10 bg-white/5 text-zinc-500",
                        )}
                      >
                        <Wifi className="size-10" />
                      </span>
                      <p className="mb-4 text-sm capitalize text-zinc-400">{vpnStatus}</p>
                      <Button onClick={toggleVpn} className="w-full bg-cyan-300 text-zinc-950 hover:bg-cyan-200">
                        {vpnStatus === "connected" ? "Disconnect" : vpnStatus === "connecting" ? "Connecting..." : "Connect"}
                      </Button>
                    </div>
                  </div>
                </PanelShell>
              )}

              {activePanel === "email" && (
                <PanelShell title="Temp Email" icon={Mail} eyebrow="Disposable inbox">
                  <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
                    <div className="space-y-4">
                      <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-4">
                        <p className="mb-2 text-xs text-zinc-500">Active address</p>
                        <p className="break-all font-mono text-sm text-cyan-100">{emailAddress}</p>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" onClick={generateInbox}>
                            <RefreshCcw className="size-4" />
                            Generate
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => copyText(emailAddress)}>
                            <Copy className="size-4" />
                            Copy
                          </Button>
                        </div>
                      </div>
                      <MiniQr value={emailAddress} />
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
                      <div className="rounded-lg border border-white/10 bg-zinc-900/70">
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                          <span className="text-sm font-medium">Inbox</span>
                          <span className="text-xs text-zinc-500">10s refresh</span>
                        </div>
                        <div className="max-h-96 overflow-auto">
                          {emails.map((email) => (
                            <button
                              key={email.id}
                              onClick={() => setSelectedEmailId(email.id)}
                              className={cn(
                                "block w-full border-b border-white/5 px-4 py-3 text-left hover:bg-white/5",
                                selectedEmailId === email.id && "bg-cyan-400/10",
                              )}
                            >
                              <p className="truncate text-sm font-medium">{email.sender}</p>
                              <div className="mt-1 flex items-center gap-2">
                                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] uppercase", tagStyles(email.type))}>
                                  {email.type}
                                </span>
                                <p className="truncate text-xs text-zinc-400">{email.subject}</p>
                              </div>
                              <p className="mt-1 text-[11px] text-zinc-600">{email.time}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
                        <p className="text-sm font-semibold">{selectedEmail.subject}</p>
                        <p className="mt-1 text-xs text-zinc-500">From {selectedEmail.sender}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] uppercase", tagStyles(selectedEmail.type))}>
                            {selectedEmail.type}
                          </span>
                          <span className="text-xs text-zinc-500">{selectedEmail.reason}</span>
                        </div>
                        {selectedEmail.otp_code && (
                          <div className="mt-4 rounded-md border border-amber-400/20 bg-amber-400/10 p-3 text-amber-100">
                            <p className="text-xs text-amber-200/80">Extracted OTP</p>
                            <p className="mt-1 font-mono text-2xl font-bold">{selectedEmail.otp_code}</p>
                          </div>
                        )}
                        <div
                          className="prose prose-invert prose-sm mt-5 max-w-none rounded-md bg-zinc-950 p-4 text-zinc-200"
                          dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                        />
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" onClick={generateReply} disabled={isDraftingReply || user.plan === "free"}>
                            <Bot className="size-4" />
                            {isDraftingReply ? "Drafting..." : "AI Reply"}
                          </Button>
                          {user.plan === "free" && <span className="text-xs text-zinc-500">Pro feature</span>}
                        </div>
                        {replyDraft && (
                          <div className="mt-4 rounded-md border border-white/10 bg-zinc-950 p-3">
                            <p className="mb-2 text-xs text-zinc-500">Reply composer</p>
                            <textarea
                              value={replyDraft}
                              onChange={(event) => setReplyDraft(event.target.value)}
                              className="min-h-32 w-full rounded-md border border-white/10 bg-zinc-900 p-3 text-sm text-zinc-100"
                            />
                            <Button size="sm" className="mt-3">
                              Send from temp address
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </PanelShell>
              )}

              {activePanel === "number" && (
                <PanelShell title="Temp Number" icon={Phone} eyebrow="Private SMS receiver">
                  <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm text-zinc-400">Country</label>
                        <Select value={country} onValueChange={assignNumber}>
                          <SelectTrigger className="w-full border-white/10 bg-zinc-900 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((item) => (
                              <SelectItem key={item.code} value={item.code}>
                                {item.code} {item.name} - {item.dial}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-4">
                        <p className="mb-2 text-xs text-zinc-500">Assigned number</p>
                        <p className="font-mono text-lg text-cyan-100">{phoneNumber}</p>
                        <Button className="mt-4" size="sm" variant="outline" onClick={() => copyText(phoneNumber)}>
                          <Copy className="size-4" />
                          Copy number
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-zinc-900/70">
                      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <span className="text-sm font-medium">Incoming SMS</span>
                        <span className="text-xs text-zinc-500">10s refresh</span>
                      </div>
                      <div className="divide-y divide-white/5">
                        {smsMessages.map((message) => {
                          const code = extractOtp(message.body)
                          return (
                            <div key={message.id} className="p-4">
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <p className="text-sm font-medium">{message.sender}</p>
                                <p className="text-xs text-zinc-500">{message.time}</p>
                              </div>
                              <p className="text-sm text-zinc-300">{message.body}</p>
                              {code && (
                                <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-200">
                                  <KeyRound className="size-4" />
                                  OTP {code}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </PanelShell>
              )}

              {activePanel === "account" && (
                <PanelShell title="Account" icon={UserCircle} eyebrow="Profile and access">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Metric label="Email" value={user.email} />
                    <Metric label="Plan" value={PLAN_LABELS[user.plan]} />
                    <Metric label="API access" value={user.plan === "business" ? "Enabled" : "Upgrade required"} />
                  </div>
                </PanelShell>
              )}

              {activePanel === "upgrade" && (
                <PanelShell title="Upgrade" icon={CreditCard} eyebrow="More private capacity">
                  <div className="grid gap-4 md:grid-cols-2">
                    <PlanCard name="Pro" price="$9/mo" body="20 VPN servers, unlimited temp emails, and 50 OTPs/day." plan="pro" />
                    <PlanCard name="Business" price="$29/mo" body="Unlimited usage plus API key access for automation." plan="business" />
                  </div>
                </PanelShell>
              )}
            </div>

            <aside className="space-y-5">
              <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Activity className="size-4 text-cyan-300" />
                  <h2 className="font-semibold">Live Status</h2>
                </div>
                <div className="space-y-3 text-sm">
                  <StatusRow icon={Signal} label="Network" value="Stable" />
                  <StatusRow icon={Radio} label="Inbox sync" value="Every 10s" />
                  <StatusRow icon={Globe2} label="Region" value="Asia" />
                </div>
                {alerts.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {alerts.map((alert) => (
                      <p key={alert} className="rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-100">
                        {alert}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <UsageCard usage={usage} plan={user.plan} onUpgrade={() => setActivePanel("upgrade")} compact />
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}

function PanelShell({
  title,
  eyebrow,
  icon: Icon,
  children,
}: {
  title: string
  eyebrow: string
  icon: typeof Shield
  children: React.ReactNode
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-900/60 p-5 shadow-2xl shadow-black/20">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-md bg-cyan-400/10 text-cyan-200">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{eyebrow}</p>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/60 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 break-all font-mono text-sm text-zinc-100">{value}</p>
    </div>
  )
}

function StatusRow({ icon: Icon, label, value }: { icon: typeof Shield; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-zinc-400">
        <Icon className="size-4" />
        {label}
      </span>
      <span className="flex items-center gap-1 text-zinc-100">
        <Check className="size-3 text-emerald-300" />
        {value}
      </span>
    </div>
  )
}

function UsageCard({
  usage,
  plan,
  onUpgrade,
  compact = false,
}: {
  usage: { vpn: number; temp_emails: number; otps: number }
  plan: Plan
  onUpgrade: () => void
  compact?: boolean
}) {
  const items = (["vpn", "temp_emails", "otps"] as const).map((feature) => ({
    feature,
    used: usage[feature],
    limit: PLAN_LIMITS[plan][feature],
    percent: usagePercent(usage[feature], PLAN_LIMITS[plan][feature]),
  }))
  const nearLimit = items.some((item) => item.limit !== null && item.percent > 80)

  return (
    <div className={cn("rounded-lg border border-white/10 bg-zinc-900/70 p-4", !compact && "mt-8")}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Today&apos;s usage</h2>
        <span className="text-xs text-zinc-500">{PLAN_LABELS[plan]}</span>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.feature}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-zinc-400">{featureLabel(item.feature)}</span>
              <span className="text-zinc-500">
                {item.used}/{item.limit ?? "unlimited"}
              </span>
            </div>
            <Progress
              value={item.limit === null ? 100 : item.percent}
              className={cn("h-2 bg-white/10", item.percent > 80 && "[&_[data-slot=progress-indicator]]:bg-red-500")}
            />
          </div>
        ))}
      </div>
      {nearLimit && (
        <Button onClick={onUpgrade} className="mt-4 w-full bg-cyan-300 text-zinc-950 hover:bg-cyan-200">
          <ArrowUpRight className="size-4" />
          Upgrade to Pro
        </Button>
      )}
    </div>
  )
}

function PlanCard({ name, price, body, plan }: { name: string; price: string; body: string; plan: "pro" | "business" }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/60 p-5">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="mt-2 text-3xl font-bold">{price}</p>
      <p className="mt-3 min-h-12 text-sm text-zinc-400">{body}</p>
      <div className="mt-5">
        <UpgradeButton plan={plan} />
      </div>
    </div>
  )
}
