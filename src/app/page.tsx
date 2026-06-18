import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Globe2, Mail, Phone, Shield, ShieldCheck } from "lucide-react"

import { LandingPricing } from "@/components/landing-pricing"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "SiteVPN - Private browsing, disposable email, anonymous numbers",
  description:
    "One SiteVPN account gives you no-logs VPN browsing, disposable email inboxes, and anonymous temporary phone numbers.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SiteVPN - Private browsing, disposable email, anonymous numbers",
    description:
      "Protect signups, browsing, and verification codes with one privacy account. Start free with no credit card.",
    url: "https://sitevpn.me",
    siteName: "SiteVPN",
    images: [{ url: "/sitevpn_logo.png", width: 1200, height: 630, alt: "SiteVPN privacy tools" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SiteVPN - Private browsing, disposable email, anonymous numbers",
    description: "VPN, temp email, and anonymous numbers in one privacy dashboard.",
    images: ["/sitevpn_logo.png"],
  },
}

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SiteVPN",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  description: "Privacy dashboard for VPN browsing, disposable email, and anonymous temporary phone numbers.",
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
    { "@type": "Offer", name: "Pro", price: "9", priceCurrency: "USD" },
    { "@type": "Offer", name: "Business", price: "29", priceCurrency: "USD" },
  ],
}

const features = [
  {
    icon: Shield,
    title: "VPN",
    benefit: "Mask your IP with no-logs encrypted browsing.",
    steps: ["Choose the fastest recommended server", "Connect and browse through a masked IP"],
  },
  {
    icon: Mail,
    title: "Temp Email",
    benefit: "Create disposable inboxes for signups.",
    steps: ["Generate an address instantly", "Read OTPs and messages without exposing your email"],
  },
  {
    icon: Phone,
    title: "Temp Number",
    benefit: "Receive verification texts without your real number.",
    steps: ["Pick a country", "Copy OTP codes from the private SMS inbox"],
  },
]

const useCases = [
  ["Sign up to websites without spam", "Use disposable inboxes that keep newsletters and tracking away from your real email.", "/tools/temp-email"],
  ["Verify accounts without your real number", "Receive OTP codes through anonymous temporary phone numbers.", "/tools/temp-number"],
  ["Access geo-blocked content safely", "Route traffic through no-logs VPN servers with smart server recommendations.", "/tools/vpn"],
]

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img src="/sitevpn_logo.png" alt="SiteVPN" className="size-10 rounded-md" />
            <span className="text-lg font-semibold">SiteVPN</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            <Link href="#features" className="hover:text-white">Features</Link>
            <Link href="#pricing" className="hover:text-white">Pricing</Link>
            <Link href="/docs" className="hover:text-white">API</Link>
          </nav>
          <Button asChild size="sm" className="bg-cyan-300 text-zinc-950 hover:bg-cyan-200">
            <Link href="/signup">Start free</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
            VPN, temp email, and anonymous numbers in one dashboard
          </p>
          <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            One account. Private browsing, disposable email, anonymous numbers.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Hide your IP, protect your inbox, and verify accounts without handing over your real phone number.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-cyan-300 text-zinc-950 hover:bg-cyan-200">
              <Link href="/signup">
                Start free - no credit card
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/10 bg-transparent">
              <Link href="/docs">Read API docs</Link>
            </Button>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-4 text-sm text-zinc-500">
            <span>No logs policy</span>
            <span>Open source core</span>
            <span>GDPR compliant</span>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-cyan-950/20">
          <div className="grid gap-4">
            <div className="rounded-md border border-white/10 bg-zinc-950 p-4">
              <p className="text-xs text-zinc-500">IP before</p>
              <p className="mt-1 font-mono text-2xl text-red-200">103.74.19.28</p>
            </div>
            <div className="mx-auto grid size-20 place-items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 animate-pulse">
              <ShieldCheck className="size-10" />
            </div>
            <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="text-xs text-emerald-200/70">Masked IP after</p>
              <p className="mt-1 font-mono text-2xl text-emerald-100">185.212.44.18</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article key={feature.title} className="rounded-lg border border-white/10 bg-zinc-900/70 p-6">
                <Icon className="size-8 text-cyan-300" />
                <h2 className="mt-5 text-xl font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm text-zinc-400">{feature.benefit}</p>
                <div className="mt-5 space-y-3">
                  {feature.steps.map((step, index) => (
                    <p key={step} className="flex gap-3 text-sm text-zinc-300">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-cyan-300 text-xs font-bold text-zinc-950">
                        {index + 1}
                      </span>
                      {step}
                    </p>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <LandingPricing />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm text-cyan-200">Popular ways to use SiteVPN</p>
          <h2 className="mt-2 text-3xl font-semibold">Privacy tools for everyday signups and browsing</h2>
        </div>
        <div className="divide-y divide-white/10 rounded-lg border border-white/10 bg-zinc-900/70">
          {useCases.map(([title, copy, href]) => (
            <Link key={href} href={href} className="grid gap-4 p-5 hover:bg-white/5 md:grid-cols-[260px_1fr_auto] md:items-center">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-zinc-400">{copy}</p>
              <ArrowRight className="size-4 text-cyan-300" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["No logs policy", "We do not store browsing activity."],
            ["Open source core", "Core privacy logic is transparent."],
            ["GDPR compliant", "Built around data minimization."],
            ["50K+ users", "Growing privacy-first community."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
              <CheckCircle2 className="mb-4 size-6 text-emerald-300" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} SiteVPN. All rights reserved.</p>
          <div className="flex flex-wrap gap-5 text-sm text-zinc-400">
            <Link href="/docs" className="hover:text-white">Docs</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/status" className="hover:text-white">Status</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
