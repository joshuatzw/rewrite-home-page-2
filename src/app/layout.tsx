import type { Metadata } from 'next'
import { Newsreader, Noto_Sans_Thai, Space_Mono } from 'next/font/google'
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

// Thai glyph coverage for the /th pages. Neither Newsreader nor Space Mono
// ships Thai, so without this the script falls back to whatever the OS
// supplies (Tahoma on Windows, Thonburi on macOS) — inconsistent, and heavier
// than the surrounding Latin text.
//
// Only the `thai` subset is loaded: the @font-face carries a unicode-range, so
// browsers fetch the file only on pages that actually render Thai characters,
// and Latin text keeps using Newsreader/Space Mono. `preload: false` for the
// same reason — a preload hint on the en and zh pages would download a font
// they never paint. Variable font, so no `weight` is needed; the 600 used for
// the :lang(th) emphasis override comes free.
const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  display: 'swap',
  preload: false,
  variable: '--font-noto-sans-thai',
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
    <html
      lang="en"
      className={`${newsreader.variable} ${spaceMono.variable} ${notoSansThai.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
