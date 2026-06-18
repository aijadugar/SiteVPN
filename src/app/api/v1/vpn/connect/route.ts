import { NextResponse } from "next/server"
import { z } from "zod"

import { requireV1ApiUser, vpnServers } from "@/lib/v1-api"
import { dispatchUserWebhook } from "@/lib/webhooks"

const schema = z.object({
  server_id: z.string().min(1),
})

export async function POST(request: Request) {
  const auth = await requireV1ApiUser(request)
  if (!auth.ok) return auth.response

  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "server_id is required." }, { status: 400 })
  }

  const server = vpnServers.find((item) => item.id === parsed.data.server_id)
  if (!server) {
    return NextResponse.json({ error: "Unknown server_id." }, { status: 404 })
  }

  const config = `[Interface]
PrivateKey = <client-private-key>
Address = 10.8.0.2/32
DNS = 1.1.1.1

[Peer]
PublicKey = <sitevpn-${server.id}-public-key>
AllowedIPs = 0.0.0.0/0
Endpoint = ${server.id}.wg.sitevpn.example:51820`

  await dispatchUserWebhook(auth.user.id, "vpn.connected", { server_id: server.id, server })

  return NextResponse.json({
    server,
    wireguard_config: config,
    expires_in_seconds: 3600,
  })
}
