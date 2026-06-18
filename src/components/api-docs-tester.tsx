"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const sampleBody = '{ "server_id": "nl-ams-01" }'

export function ApiDocsTester() {
  const [apiKey, setApiKey] = useState("")
  const [path, setPath] = useState("/api/v1/vpn/servers")
  const [method, setMethod] = useState("GET")
  const [body, setBody] = useState(sampleBody)
  const [result, setResult] = useState("")

  const run = async () => {
    const response = await fetch(path, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: method === "GET" ? undefined : body,
    })

    setResult(JSON.stringify(await response.json(), null, 2))
  }

  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
      <h2 className="text-lg font-semibold">Live API tester</h2>
      <div className="mt-4 grid gap-3">
        <Input value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="svpn_..." className="border-white/10 bg-zinc-950" />
        <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
          <select value={method} onChange={(event) => setMethod(event.target.value)} className="rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-sm">
            <option>GET</option>
            <option>POST</option>
          </select>
          <Input value={path} onChange={(event) => setPath(event.target.value)} className="border-white/10 bg-zinc-950" />
        </div>
        {method !== "GET" && (
          <textarea value={body} onChange={(event) => setBody(event.target.value)} className="min-h-24 rounded-md border border-white/10 bg-zinc-950 p-3 text-sm" />
        )}
        <Button onClick={run}>Run request</Button>
        {result && <pre className="max-h-80 overflow-auto rounded-md bg-zinc-950 p-3 text-xs text-cyan-100">{result}</pre>}
      </div>
    </div>
  )
}
