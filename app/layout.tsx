import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Control Engineering - Peer Correction System',
  description: 'Control Engineering peer correction lookup system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        <Header />
        <div className="relative z-0">
          {children}
        </div>
      </body>
    </html>
  )
}

