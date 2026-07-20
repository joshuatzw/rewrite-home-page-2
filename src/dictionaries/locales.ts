/**
 * Locale metadata shared between server components (pages/layouts) and
 * client components (e.g. LanguageToggle). Kept free of any JSON imports
 * or `server-only` guards so it is safe to bundle for the client.
 */

export const locales = ['en', 'th', 'zh'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

/** Compact labels shown inside the language toggle control. */
export const localeNames: Record<Locale, string> = {
  en: 'EN',
  th: 'TH',
  zh: '中文',
}

/** Full language names, e.g. for aria labels / tooltips. */
export const localeLabels: Record<Locale, string> = {
  en: 'English',
  th: 'ไทย',
  zh: '简体中文',
}

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** Minimal `{placeholder}` interpolation for dictionary strings. */
export function formatMessage(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''))
}
