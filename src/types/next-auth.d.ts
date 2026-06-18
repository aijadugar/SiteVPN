import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      plan: "free" | "pro" | "business"
    } & DefaultSession["user"]
  }

  interface User {
    plan?: "free" | "pro" | "business"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    plan?: "free" | "pro" | "business"
  }
}
