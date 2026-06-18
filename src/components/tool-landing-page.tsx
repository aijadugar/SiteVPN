import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ToolLandingPage({
  icon: Icon,
  eyebrow,
  title,
  description,
  bullets,
}: {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  bullets: string[]
}) {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img src="/sitevpn_logo.png" alt="SiteVPN" className="size-10 rounded-md" />
            <span className="text-lg font-semibold">SiteVPN</span>
          </Link>
          <Button asChild size="sm" className="bg-cyan-300 text-zinc-950 hover:bg-cyan-200">
            <Link href="/signup">Start free</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
          <Icon className="size-8" />
        </div>
        <p className="text-sm text-cyan-200">{eyebrow}</p>
        <h1 className="mt-4 text-5xl font-bold">{title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">{description}</p>
        <Button asChild size="lg" className="mt-8 bg-cyan-300 text-zinc-950 hover:bg-cyan-200">
          <Link href="/signup">
            Start free
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {bullets.map((bullet) => (
            <div key={bullet} className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
              <CheckCircle2 className="mb-4 size-6 text-emerald-300" />
              <p className="text-sm text-zinc-300">{bullet}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
