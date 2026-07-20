'use client'

import { useEffect } from 'react'
import type { Locale } from '@/dictionaries/locales'

/**
 * The <html> tag lives in the shared root layout (src/app/layout.tsx), which
 * also serves the English-only /auth, /checkout and /portal routes and
 * therefore can't read the [lang] segment — a layout only receives params
 * for its own segment and its ancestors, not its descendants (see the
 * `params` section of node_modules/next/dist/docs/01-app/03-api-reference/
 * 03-file-conventions/layout.md). Rather than fork the app into multiple
 * root layouts (which would mean full page reloads between the marketing
 * site and checkout/auth, and duplicate root layouts we're not allowed to
 * add under those directories), this small client component synchronises
 * `document.documentElement.lang` immediately on mount for the [lang] tree.
 */
export default function HtmlLangSync({ lang }: { lang: Locale }) {
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return null
}
