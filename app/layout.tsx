import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Known — Christian Self-Discovery & Discernment',
  description:
    'Know yourself more clearly without turning a personality test into a verdict. Explore your gifts, temperament, and connection patterns, then bring what you notice before God for discernment.',
  keywords: [
    'Christian self discovery',
    'Christian personality assessment',
    'calling',
    'discernment',
    'strengths assessment',
    'purpose',
    'faith',
  ],
  openGraph: {
    title: 'Known — Understand how you are wired. Discern what comes next.',
    description:
      'Three guided assessments for gifts, personality, and connection — designed as lenses for prayerful discernment, not labels.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0A0A09',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-background text-text antialiased">{children}</body>
    </html>
  )
}
