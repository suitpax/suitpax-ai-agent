import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <title>Suitpax - The next-gen of traveltech</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="Suitpax - AI-powered travel assistant for your next adventure" />
      </head>
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
