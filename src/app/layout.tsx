import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Luxe Tracker — Global Launch & Price Disparity',
  description:
    'High-fashion global launch and price disparity tracker. 5 brands · 25 products · 11k+ price history rows · 15 intelligence modules.',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0e17] text-white antialiased">{children}</body>
    </html>
  )
}
