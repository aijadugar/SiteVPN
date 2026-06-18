"use client"

import { useState, useCallback } from "react"

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "disconnecting" | "error"

export interface ConnectionDetails {
  protocol: string
  encryption: string
  serverCertExpiry: string
  serverLocation: string
  noLogs: boolean
}

export interface ConnectionStats {
  country: string
  city: string
  newIP: string
  connectionTime: number // seconds
  uploadSpeed: number // MB/s
  downloadSpeed: number // MB/s
  latency: number // ms
  packetLoss: number // percentage
  quality: number // 0-5
}

export function useConnection() {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected")
  const [details, setDetails] = useState<ConnectionDetails | null>(null)
  const [stats, setStats] = useState<ConnectionStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [connectionSteps, setConnectionSteps] = useState<
    Array<{ id: string; status: "pending" | "in-progress" | "complete" }>
  >([])

  const connect = useCallback(async (serverId: string, countryName = "India") => {
    const usageResponse = await fetch("/api/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature: "vpn" }),
    })

    if (!usageResponse.ok) {
      const body = await usageResponse.json().catch(() => null)
      setError(body?.error ?? "VPN usage limit reached")
      setStatus("error")
      return
    }

    localStorage.setItem("vpn-connected", "true")

    setStatus("connecting")
    setError(null)
    setConnectionSteps([
      { id: "1", status: "pending" },
      { id: "2", status: "pending" },
      { id: "3", status: "pending" },
      { id: "4", status: "pending" },
    ])

    try {
      // Mock connection flow with step animations
      const timestamps = [500, 1200, 2000, 2800]

      for (let i = 0; i < timestamps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, timestamps[i] - (i > 0 ? timestamps[i - 1] : 0)))

        setConnectionSteps((prev) =>
          prev.map((step, idx) => {
            if (idx === i) return { ...step, status: "in-progress" }
            if (idx < i) return { ...step, status: "complete" }
            return step
          }),
        )
      }

      // Final completion
      await new Promise((resolve) => setTimeout(resolve, 600))
      setConnectionSteps((prev) => prev.map((step) => ({ ...step, status: "complete" })))

      setDetails({
        protocol: "WireGuard",
        encryption: "AES-256-GCM",
        serverCertExpiry: "2025-12-31",
        serverLocation: countryName,
        noLogs: true,
      })

      setStats({
        country: countryName,
        city: countryName,
        newIP: "203.0.113.42",
        connectionTime: 2.3,
        uploadSpeed: 85.4,
        downloadSpeed: 92.1,
        latency: 24,
        packetLoss: 0.1,
        quality: 5,
      })

      setStatus("connected")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed")
      setStatus("error")
    }
  }, [])

  const disconnect = useCallback(async () => {
    localStorage.removeItem("vpn-connected")
    setStatus("disconnecting")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStatus("disconnected")
      setDetails(null)
      setStats(null)
      setConnectionSteps([])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Disconnection failed")
      setStatus("error")
    }
  }, [])

  return { status, details, stats, error, connect, disconnect, connectionSteps }
}
