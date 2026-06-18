import { NextResponse } from "next/server"
import { z } from "zod"

import { classifyEmail } from "@/lib/ai"

const schema = z.object({
  subject: z.string().min(1),
  sender: z.string().min(1),
  body: z.string().default(""),
})

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json())

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email payload." }, { status: 400 })
  }

  const classification = await classifyEmail(parsed.data.subject, parsed.data.sender, parsed.data.body)
  return NextResponse.json(classification)
}
