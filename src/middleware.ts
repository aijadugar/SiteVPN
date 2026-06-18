import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/auth/sign-in",
  },
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/vpn/:path*",
    "/temp-mail/:path*",
    "/temp-number/:path*",
    "/api/stripe/checkout/:path*",
    "/api/usage/:path*",
    "/api/ai/:path*",
    "/api/developer/:path*",
  ],
}
