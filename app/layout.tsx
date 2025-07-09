import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NeighborFit - Find Your Fitness Community",
  description:
    "Connect with neighbors who share your fitness passion. Join activities, build friendships, and achieve your wellness goals together using real-time data from Strava, Fitbit, and Google Places APIs.",
  keywords:
    "fitness community, neighborhood activities, workout partners, Strava integration, Fitbit API, local fitness",
  authors: [{ name: "NeighborFit Team" }],
  openGraph: {
    title: "NeighborFit - Find Your Fitness Community",
    description: "Connect with neighbors through fitness activities and build lasting wellness relationships",
    type: "website",
    locale: "en_US",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
