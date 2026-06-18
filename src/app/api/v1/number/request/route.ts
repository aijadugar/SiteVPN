import { NextResponse } from "next/server"
import { z } from "zod"

import { requireV1ApiUser } from "@/lib/v1-api"

const schema = z.object({
  country_code: z.string().min(2).max(3),
})

export async function POST(request: Request) {
  const auth = await requireV1ApiUser(request)
  if (!auth.ok) return auth.response

  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "country_code is required." }, { status: 400 })
  }

  const numberId = `num_${crypto.randomUUID()}`
  return NextResponse.json({
    number_id: numberId,
    country_code: parsed.data.country_code.toUpperCase(),
    number: `+1${Math.floor(2000000000 + Math.random() * 7999999999)}`,
  })
}
