import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SaintVision AI™ | Enterprise AI Intelligence Platform',
  description: 'The first AI platform that thinks, learns, and evolves with your business. Deploy enterprise-grade AI agents in minutes with patented HACP™ technology.',
  keywords: 'AI, artificial intelligence, enterprise AI, HACP protocol, responsible AI, business intelligence, automation',
  authors: [{ name: 'SaintVision AI' }],
  creator: 'SaintVision AI',
  publisher: 'SaintVision AI',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://saintvisionai.com',
    title: 'SaintVision AI™ | Enterprise AI Intelligence Platform',
    description: 'The first AI platform that thinks, learns, and evolves with your business.',
    siteName: 'SaintVision AI',
    images: [
      {
        url: '/logos/THE BEST MAIN LOGO + COOKIN.png',
        width: 1200,
        height: 630,
        alt: 'SaintVision AI Enterprise Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaintVision AI™ | Enterprise AI Intelligence Platform',
    description: 'The first AI platform that thinks, learns, and evolves with your business.',
    images: ['/logos/THE BEST MAIN LOGO + COOKIN.png']
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#F59E0B'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logos/SVTLOGO.png" />
        <link rel="apple-touch-icon" href="/logos/SVTLOGO.png" />
        <meta name="theme-color" content="#F59E0B" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-black text-white">
          {children}
        </div>
      </body>
    </html>
  )
}