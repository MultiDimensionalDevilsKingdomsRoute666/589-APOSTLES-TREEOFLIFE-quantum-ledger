import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuantumLedger',
  description: 'A blockchain-style document ledger secured with ML-DSA-44 post-quantum signatures',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-subtle min-h-screen`}>{children}</body>
    </html>
  )
}
