export type Plan = "free" | "pro" | "business"
export type Feature = "vpn" | "temp_emails" | "otps" | "api_keys"

export const PLAN_LIMITS: Record<Plan, Record<Feature, number | null>> = {
  free: {
    vpn: 1,
    temp_emails: 5,
    otps: 3,
    api_keys: 0,
  },
  pro: {
    vpn: 20,
    temp_emails: null,
    otps: 50,
    api_keys: 0,
  },
  business: {
    vpn: null,
    temp_emails: null,
    otps: null,
    api_keys: null,
  },
}

export const STRIPE_PRICE_TO_PLAN: Record<string, Plan> = {
  [process.env.STRIPE_PRO_PRICE_ID ?? ""]: "pro",
  [process.env.STRIPE_BUSINESS_PRICE_ID ?? ""]: "business",
}

export const PLAN_LABELS: Record<Plan, string> = {
  free: "Free",
  pro: "Pro",
  business: "Business",
}
