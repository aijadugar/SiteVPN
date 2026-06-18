import localFont from "next/font/local"

export const geist = localFont({
  src: [
    {
      path: "./../public/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "./../public/fonts/Geist-Bold.woff2",
      weight: "700",
      style: "normal"
    }
  ],
  variable: "--font-geist",
  display: "swap",
})

export const geistMono = localFont({
  src: [
    {
      path: "./../public/fonts/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "./../public/fonts/GeistMono-Bold.woff2",
      weight: "700",
      style: "normal"
    }
  ],
  variable: "--font-geist-mono",
  display: "swap",
})
