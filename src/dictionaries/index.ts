// Server-only dictionary loader. This module is imported exclusively from
// Server Components (pages/layouts), so the JSON payloads never reach the
// client bundle — only the resolved strings rendered into HTML do.
//
// `en.json` is the source of truth for the key structure. `th.json` and
// `zh.json` are checked against it (see the `satisfies` below), so adding a
// key to one locale without adding it to the others fails the build.

import type en from './en.json'
import { defaultLocale, hasLocale, locales, type Locale } from './locales'

export { defaultLocale, hasLocale, locales }
export type { Locale }

export type Dictionary = typeof en

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./en.json').then((m) => m.default),
  th: () => import('./th.json').then((m) => m.default satisfies Dictionary),
  zh: () => import('./zh.json').then((m) => m.default satisfies Dictionary),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}

/**
 * How to add a new locale:
 * 1. Copy `en.json` to `<code>.json` and translate every value (keep the
 *    same keys/shape — TypeScript will flag mismatches via the `satisfies`
 *    checks above).
 * 2. Add `<code>` to the `locales` tuple in `./locales.ts` and give it a
 *    `localeNames` / `localeLabels` entry.
 * 3. Add a loader entry to `dictionaries` above.
 * `generateStaticParams` in `src/app/[lang]/layout.tsx` picks up the new
 * locale automatically since it maps over `locales`.
 */
