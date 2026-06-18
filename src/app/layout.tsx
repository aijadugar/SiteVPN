import type React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

import { AuthProvider } from "@/components/auth-provider";
import { geist, geistMono } from "./fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "SiteVPN - Secure AI VPN, Temp Emails & Temp Numbers",
  description:
    "Open-source AI VPN, temporary email, and temporary phone numbers. Secure, trustworthy, and transparent online privacy tools.",
  metadataBase: new URL("https://sitevpn.me"),
  keywords: ["AI VPN", "Temporary Email", "Temporary Phone", "Privacy", "Security", "Open Source"],
  authors: [{ name: "SiteVPN Team" }],

  icons: {
    icon: [
      { url: "/sitevpn_logo.png", media: "(prefers-color-scheme: light)" },
      { url: "/sitevpn_logo.png", media: "(prefers-color-scheme: dark)" },
      { url: "/sitevpn_logo.png", type: "image/svg+xml" },
    ],
    apple: "/sitevpn_logo.png",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sitevpn.me",
    title: "SiteVPN - Secure AI VPN, Temp Emails & Temp Numbers",
    description:
      "Open-source AI VPN, temporary email, and phone numbers for online privacy.",
    images: [
      {
        url: "/sitevpn_logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#00c8c8" },
    { media: "(prefers-color-scheme: dark)", color: "#00d9ff" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
