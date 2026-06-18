import { z } from "zod"

export type EmailClassification = {
  type: "safe" | "promotional" | "phishing" | "otp"
  otp_code: string | null
  reason: string
}

const claudeTextBlockSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
})

const claudeResponseSchema = z.object({
  content: z.array(claudeTextBlockSchema),
})

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/)
  return match?.[0] ?? text
}

function localClassifyEmail(subject: string, sender: string, body = ""): EmailClassification {
  const text = `${subject} ${sender} ${body}`.toLowerCase()
  const otp = body.match(/\b\d{4,8}\b/)?.[0] ?? subject.match(/\b\d{4,8}\b/)?.[0] ?? null

  if (otp || /\botp\b|\bcode\b|verification/.test(text)) {
    return { type: "otp", otp_code: otp, reason: "Verification language and code pattern detected." }
  }

  if (/password|wallet|urgent|suspend|verify now|login immediately/.test(text)) {
    return { type: "phishing", otp_code: null, reason: "Contains urgent account-security language." }
  }

  if (/deal|sale|offer|discount|newsletter|promo/.test(text)) {
    return { type: "promotional", otp_code: null, reason: "Looks like marketing or newsletter content." }
  }

  return { type: "safe", otp_code: null, reason: "No suspicious or promotional signals found." }
}

export async function classifyEmail(subject: string, sender: string, body = ""): Promise<EmailClassification> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return localClassifyEmail(subject, sender, body)
  }

  const prompt = `Classify this email. Subject: ${subject}. Sender: ${sender}. Body: ${body}. Reply with JSON only: { "type": "safe|promotional|phishing|otp", "otp_code": "XXXX or null", "reason": "..." }`

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  if (!response.ok) {
    return localClassifyEmail(subject, sender, body)
  }

  const parsed = claudeResponseSchema.safeParse(await response.json())
  const text = parsed.success ? parsed.data.content[0]?.text : ""
  const classification = z
    .object({
      type: z.enum(["safe", "promotional", "phishing", "otp"]),
      otp_code: z.string().nullable(),
      reason: z.string(),
    })
    .safeParse(JSON.parse(extractJson(text)))

  return classification.success ? classification.data : localClassifyEmail(subject, sender, body)
}

export async function draftEmailReply(input: {
  fromAddress: string
  sender: string
  subject: string
  body: string
}) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return `Hi,\n\nThanks for reaching out. I received your message about "${input.subject}" and will follow up if needed.\n\nBest,\n${input.fromAddress}`
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Write a concise, neutral email reply from ${input.fromAddress}. Sender: ${input.sender}. Subject: ${input.subject}. Email body: ${input.body}. Return only the draft text.`,
        },
      ],
    }),
  })

  if (!response.ok) {
    return "Thanks for the message. I received it and will follow up if needed."
  }

  const parsed = claudeResponseSchema.safeParse(await response.json())
  return parsed.success ? parsed.data.content[0]?.text ?? "" : ""
}
