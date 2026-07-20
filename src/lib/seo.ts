import type { Metadata } from 'next'
import { defaultLocale, locales, type Locale } from '@/dictionaries/locales'

/**
 * Production origin, per the privacy policy ("the reWrite website at
 * rewriteai.dev"). Used to emit absolute canonical and hreflang URLs.
 */
export const SITE_URL = 'https://rewriteai.dev'

/**
 * Builds `alternates` metadata for a localized page.
 *
 * Two problems this solves, both of which otherwise waste the localized
 * routing we just built:
 *
 * 1. DUPLICATE CONTENT. "/" and "/en" serve byte-identical English HTML.
 *    Without a canonical, search engines pick a winner arbitrarily and split
 *    ranking signals across the two. English pages therefore declare "/" as
 *    canonical for the home page.
 *
 * 2. NO hreflang. hreflang is the actual mechanism by which Google serves the
 *    Thai page to Thai searchers and the Chinese page to Chinese searchers.
 *    Localized URLs alone do not do this. Every page advertises all three
 *    locale variants plus x-default.
 *
 * @param path Route below the locale segment, "" for the home page,
 *             "/pricing" for the pricing page. No trailing slash.
 * @param lang The locale of the page being rendered.
 */
export function alternatesFor(path: string, lang: Locale): Metadata['alternates'] {
  // The English home page canonicalises to the bare origin, since "/" and
  // "/en" are the same document. Every other page is its own canonical.
  const canonical =
    lang === defaultLocale && path === '' ? '/' : `/${lang}${path}`

  const languages: Record<string, string> = {}
  for (const code of locales) {
    languages[code] =
      code === defaultLocale && path === '' ? '/' : `/${code}${path}`
  }
  languages['x-default'] = path === '' ? '/' : `/${defaultLocale}${path}`

  return { canonical, languages }
}
