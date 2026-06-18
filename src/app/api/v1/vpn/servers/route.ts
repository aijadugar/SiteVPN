import { NextResponse } from "next/server"

import { requireV1ApiUser, vpnServers } from "@/lib/v1-api"

export async function GET(request: Request) {
  const auth = await requireV1ApiUser(request)
  if (!auth.ok) return auth.response

  return NextResponse.json({ servers: vpnServers })
}
