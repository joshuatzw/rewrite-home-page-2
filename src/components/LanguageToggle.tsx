'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { defaultLocale, locales, localeNames, type Locale } from '@/dictionaries/locales'

interface LanguageToggleProps {
  lang: Locale
  ariaLabel: string
  className?: string
}

/**
 * Compact EN / TH / 中文 pill switcher. Preserves whatever comes after the
 * locale segment in the current path — e.g. /th/pricing -> /en/pricing —
 * and collapses back to the bare "/" when switching to English from the
 * home page, since "/" itself already serves the English homepage.
 */
export default function LanguageToggle({ lang, ariaLabel, className }: LanguageToggleProps) {
  const pathname = usePathname() || '/'

  function pathFor(target: Locale): string {
    const parts = pathname.split('/').filter(Boolean)
    const hasPrefix = parts.length > 0 && (locales as readonly string[]).includes(parts[0])
    const rest = hasPrefix ? parts.slice(1) : parts
    const restPath = rest.length ? `/${rest.join('/')}` : ''

    if (!restPath && target === defaultLocale) return '/'
    return `/${target}${restPath}`
  }

  return (
    <div className={`lang-toggle${className ? ` ${className}` : ''}`} role="group" aria-label={ariaLabel}>
      {locales.map((code) => (
        <Link
          key={code}
          href={pathFor(code)}
          className={`lang-toggle-item${code === lang ? ' is-active' : ''}`}
          aria-current={code === lang ? 'true' : undefined}
        >
          {localeNames[code]}
        </Link>
      ))}
    </div>
  )
}
