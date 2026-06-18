"use client"

import { useState, useCallback, useEffect } from "react"

export interface EmailMessage {
  id: string
  from: string
  subject: string
  timestamp: Date
  preview: string
}

export function useTempMail() {
  const [email, setEmail] = useState<string>("")
  const [messages, setMessages] = useState<EmailMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    generateEmail()
  }, [])

  const generateEmail = useCallback(async (customPrefix?: string) => {
    setIsLoading(true)
    try {
      const usageResponse = await fetch("/api/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature: "temp_emails" }),
      })

      if (!usageResponse.ok) {
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      const prefix = customPrefix || Math.random().toString(36).substring(7)
      const domain = "bialode.com"
      setEmail(`${prefix}@${domain}`)
      setMessages([
        {
          id: "1",
          from: "welcome@service.com",
          subject: "Welcome to our service!",
          timestamp: new Date(),
          preview: "Thank you for signing up. Verify your email to continue.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshInbox = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      // Mock new messages after refresh
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const deleteEmail = useCallback(async () => {
    await generateEmail()
  }, [generateEmail])

  return { email, messages, isLoading, isRefreshing, generateEmail, refreshInbox, deleteEmail }
}
