import Link from "next/link"

import { ApiDocsTester } from "@/components/api-docs-tester"

const endpoints = [
  ["GET", "/api/v1/email/create", "Generate a temporary inbox and return address plus inbox_id."],
  ["GET", "/api/v1/email/{id}/messages", "List messages received by an inbox."],
  ["POST", "/api/v1/number/request", "Request a temporary number for a country_code."],
  ["GET", "/api/v1/number/{id}/sms", "List received SMS messages."],
  ["GET", "/api/v1/vpn/servers", "List available VPN servers with latency."],
  ["POST", "/api/v1/vpn/connect", "Return a WireGuard config for a server_id."],
]

const curlExample = `curl https://sitevpn.me/api/v1/vpn/servers \\
  -H "Authorization: Bearer svpn_your_key"`

const jsExample = `const response = await fetch("https://sitevpn.me/api/v1/email/create", {
  headers: { Authorization: "Bearer svpn_your_key" }
});
console.log(await response.json());`

const pythonExample = `import requests

response = requests.get(
    "https://sitevpn.me/api/v1/vpn/servers",
    headers={"Authorization": "Bearer svpn_your_key"},
)
print(response.json())`

const webhookExample = `const crypto = require("crypto");

function verify(payload, signature, secret) {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}`

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-200">SiteVPN Developer API</p>
            <h1 className="text-4xl font-semibold">OpenAPI-style docs</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Business customers can resell or integrate temporary email, temporary numbers, and VPN sessions with a Bearer API key.
            </p>
          </div>
          <Link href="/dashboard/api-keys" className="rounded-md border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
            Manage API keys
          </Link>
        </header>

        <section className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
          <h2 className="text-xl font-semibold">Authentication</h2>
          <p className="mt-2 text-sm text-zinc-400">Send your Business API key in every request.</p>
          <pre className="mt-4 overflow-auto rounded-md bg-zinc-950 p-4 text-sm text-cyan-100">Authorization: Bearer svpn_your_key</pre>
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
          <h2 className="text-xl font-semibold">Endpoints</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-white/10">
            {endpoints.map(([method, path, description]) => (
              <div key={path} className="grid gap-2 border-b border-white/10 p-4 last:border-b-0 md:grid-cols-[90px_260px_1fr]">
                <span className="font-mono text-xs text-cyan-200">{method}</span>
                <code className="text-sm">{path}</code>
                <p className="text-sm text-zinc-400">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <CodeBlock title="cURL" code={curlExample} />
          <CodeBlock title="JavaScript" code={jsExample} />
          <CodeBlock title="Python" code={pythonExample} />
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
          <h2 className="text-xl font-semibold">Webhooks</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Register a webhook in the dashboard. SiteVPN sends events for email.created, email.received, sms.received, vpn.connected, and vpn.disconnected.
            Verify `X-SiteVPN-Signature` with your webhook secret.
          </p>
          <pre className="mt-4 overflow-auto rounded-md bg-zinc-950 p-4 text-xs text-cyan-100">{webhookExample}</pre>
        </section>

        <ApiDocsTester />
      </div>
    </main>
  )
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <pre className="overflow-auto rounded-md bg-zinc-950 p-4 text-xs text-cyan-100">{code}</pre>
    </div>
  )
}
