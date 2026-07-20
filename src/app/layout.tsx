import type { Metadata } from 'next'
import { Newsreader, Space_Mono } from 'next/font/google'
import './globals.css'
import { SITE_URL } from '@/lib/seo'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-newsreader',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-space-mono',
})

export const metadata: Metadata = {
  // Required for the per-page `alternates` (canonical + hreflang) to resolve
  // into absolute URLs. See src/lib/seo.ts.
  metadataBase: new URL(SITE_URL),
  title: 'Write it once. Send it with confidence.',
  description:
    'reWrite rewrites, proofreads and distills whatever you\'re typing — right where you type it. No pasting into a chatbot. No tab-switching.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
