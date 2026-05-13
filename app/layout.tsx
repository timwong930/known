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
  title: 'Discovery Suite — Know Yourself. Know Your Calling.',
  description:
    'Three guided assessments to help you notice patterns in your gifts, temperament, and ways of connecting — so you can bring them before God for discernment.',
  keywords: ['personality test', 'strengths assessment', 'faith', 'calling', 'Christian', 'purpose', 'spiritual growth'],
  openGraph: {
    title: 'Discovery Suite — Know Yourself. Know Your Calling.',
    description: 'Notice patterns in gifts, temperament, and connection style — then bring what you see before God for discernment.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#080808',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-background text-text antialiased">{children}</body>
    </html>
  )
}
