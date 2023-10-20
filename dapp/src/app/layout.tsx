import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './normalize.css'
import AppProvider from './appProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NFT Marketplace',
  description: 'Connect and trade your collectibles in our NFT marketplace.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
          <AppProvider>
            {children}
          </AppProvider>
        </body>
    </html>
  )
}
