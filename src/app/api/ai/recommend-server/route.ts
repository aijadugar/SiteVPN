import { NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  userLocation: z.string().min(1),
  timeOfDay: z.string().min(1),
  lastServersUsed: z.array(z.string()).max(3).default([]),
})

const serverPool = [
  { id: "nl-ams-01", country: "Netherlands", city: "Amsterdam", ping_ms: 12, uptime_pct: 99.98, load_score: 0.92 },
  { id: "in-mum-01", country: "India", city: "Mumbai", ping_ms: 8, uptime_pct: 99.91, load_score: 0.74 },
  { id: "jp-tyo-01", country: "Japan", city: "Tokyo", ping_ms: 33, uptime_pct: 99.96, load_score: 0.86 },
  { id: "us-nyc-01", country: "United States", city: "New York", ping_ms: 42, uptime_pct: 99.94, load_score: 0.88 },
  { id: "us-sfo-01", country: "United States", city: "San Francisco", ping_ms: 61, uptime_pct: 99.9, load_score: 0.72 },
  { id: "nl-ams-02", country: "Netherlands", city: "Amsterdam", ping_ms: 18, uptime_pct: 99.95, load_score: 0.81 },
]

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json())

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid recommendation request." }, { status: 400 })
  }

  const recommendations = serverPool
    .map((server) => {
      const repeatPenalty = parsed.data.lastServersUsed.includes(server.id) ? 0.02 : 0
      const score = (1 / server.ping_ms) * 0.4 + (server.uptime_pct / 100) * 0.4 + server.load_score * 0.2 - repeatPenalty
      const reason =
        server.ping_ms <= 15
          ? "Fastest for your region right now"
          : server.uptime_pct > 99.95
            ? "Most reliable route for this session"
            : "Balanced latency and available capacity"

      return { ...server, score: Number(score.toFixed(4)), reason }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return NextResponse.json({
    userLocation: parsed.data.userLocation,
    timeOfDay: parsed.data.timeOfDay,
    recommendations,
  })
}
