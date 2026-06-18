"use client"

import { useState, useCallback, useEffect } from "react"

export interface SMSMessage {
  id: string
  from: string
  content: string
  timestamp: Date
  forwarded?: boolean
  forwardStatus?: "pending" | "sent" | "failed"
}

export interface ForwardingLog {
  id: string
  status: "sent" | "delivered" | "failed"
  timestamp: Date
  message: string
}

export function useTempNumber() {
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [messages, setMessages] = useState<SMSMessage[]>([])
  const [forwardingEnabled, setForwardingEnabled] = useState(false)
  const [forwardingNumber, setForwardingNumber] = useState<string>("")
  const [forwardingLogs, setForwardingLogs] = useState<ForwardingLog[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [availableNumbers, setAvailableNumbers] = useState<string[]>([])
  const [transferredMessages, setTransferredMessages] = useState<number>(0)
  const [isInitialized, setIsInitialized] = useState(false)

  const getAvailableNumbers = useCallback(async (countryCode: string) => {
    // Mock available numbers
    const numbers: string[] = []
    for (let i = 0; i < 5; i++) {
      const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000
      numbers.push(`+${countryCode}${randomNum}`)
    }
    setAvailableNumbers(numbers)
  }, [])

  const initializeWithIndia = useCallback(async () => {
    await getAvailableNumbers("91") // India country code
    setIsInitialized(true)
  }, [getAvailableNumbers])

  useEffect(() => {
    if (!isInitialized) {
      initializeWithIndia()
    }
  }, [isInitialized, initializeWithIndia])

  const selectNumber = useCallback(async (countryCode: string, phoneNum?: string) => {
    const usageResponse = await fetch("/api/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature: "otps" }),
    })

    if (!usageResponse.ok) {
      return
    }

    if (phoneNum) {
      setPhoneNumber(phoneNum)
    } else {
      const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000
      setPhoneNumber(`+${countryCode}${randomNum}`)
    }
    setMessages([
      {
        id: "1",
        from: "+1234567890",
        content: "Your verification code is: 123456",
        timestamp: new Date(),
      },
    ])
    setTransferredMessages(0)
  }, [])

  const enableForwarding = useCallback(async (mobileNumber: string) => {
    // Mock forwarding enable
    setForwardingEnabled(true)
    setForwardingNumber(mobileNumber)
    setForwardingLogs([
      {
        id: "1",
        status: "sent",
        timestamp: new Date(),
        message: "SMS forwarding activated",
      },
    ])
  }, [])

  const disableForwarding = useCallback(() => {
    setForwardingEnabled(false)
    setForwardingNumber("")
  }, [])

  const refreshMessages = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      // Mock refresh with new message
      if (Math.random() > 0.5) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            from: "+1987654321",
            content: "Your OTP is: 654321",
            timestamp: new Date(),
          },
        ])
      }
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const transferSMS = useCallback(async () => {
    if (messages.length === 0 || !forwardingNumber) return

    // Mock transfer operation
    setIsRefreshing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setTransferredMessages(messages.length)
      setForwardingLogs((prev) => [
        {
          id: Date.now().toString(),
          status: "delivered",
          timestamp: new Date(),
          message: `${messages.length} SMS transferred to ${forwardingNumber}`,
        },
        ...prev,
      ])
    } finally {
      setIsRefreshing(false)
    }
  }, [messages.length, forwardingNumber])

  return {
    phoneNumber,
    messages,
    forwardingEnabled,
    forwardingNumber,
    forwardingLogs,
    isRefreshing,
    availableNumbers,
    transferredMessages,
    isInitialized,
    getAvailableNumbers,
    initializeWithIndia,
    selectNumber,
    enableForwarding,
    disableForwarding,
    refreshMessages,
    transferSMS,
  }
}
