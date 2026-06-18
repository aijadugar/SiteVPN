import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json())

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and an 8+ character password." }, { status: 400 })
  }

  const email = parsed.data.email.toLowerCase().trim()
  const passwordHash = await bcrypt.hash(parsed.data.password, 12)

  try {
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        plan: "free",
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
  }
}
