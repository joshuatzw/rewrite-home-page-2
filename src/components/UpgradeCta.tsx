'use client'

import { useCallback, useEffect, useRef } from 'react'

/**
 * "Open the app if it's installed, otherwise send them to the download."
 *
 * A web page CANNOT actually query whether a desktop app is installed — no
 * browser exposes that, deliberately, since it would be a fingerprinting
 * vector. What follows is the standard heuristic and it is genuinely a
 * heuristic, not a check:
 *
 *   1. Navigate to the `rewrite://` scheme.
 *   2. If the OS hands off to the app, this tab loses focus / goes hidden.
 *   3. If nothing has taken focus by the timeout, assume it isn't installed
 *      and fall through to the download.
 *
 * Known ways this misfires, in rough order of likelihood:
 *
 *   - The browser shows an "Open reWrite?" confirmation dialog. In Chrome and
 *     Edge that dialog does not blur the page, so a user who reads it slowly
 *     can get bounced to the download page underneath while the prompt is
 *     still up. The timeout is set generously (2.5s) to make that unlikely
 *     rather than impossible.
 *   - The user dismisses the prompt. We send them to the download, which is
 *     wrong (they have it installed) but harmless.
 *   - Safari on macOS may show its own dialog and reports visibility
 *     inconsistently.
 *
 * Because the failure mode is always "user lands on the download page", which
 * is exactly where an unconverted visitor should end up anyway, this degrades
 * safely. It should not be relied on for anything where a wrong guess costs
 * the user something.
 */

/**
 * The desktop app must register a handler for this route. `rewrite://auth` is
 * already handled (see src/app/auth/success/page.tsx); `rewrite://upgrade`
 * needs to exist on the app side or an installed app will open and then sit
 * on whatever screen it was last on.
 */
const APP_SCHEME = 'rewrite://upgrade'

/** How long to wait for the OS handoff before assuming the app isn't there. */
const HANDOFF_TIMEOUT_MS = 2500

export default function UpgradeCta({
  plan,
  downloadHref,
  className,
  children,
}: {
  plan: string
  downloadHref: string
  className?: string
  children: React.ReactNode
}) {
  const timers = useRef<number[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let modified clicks (new tab, etc.) behave normally against the href.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      e.preventDefault()

      let handedOff = false
      const markHandedOff = () => {
        handedOff = true
      }
      const onVisibility = () => {
        if (document.hidden) handedOff = true
      }

      window.addEventListener('blur', markHandedOff)
      window.addEventListener('pagehide', markHandedOff)
      document.addEventListener('visibilitychange', onVisibility)

      const cleanup = () => {
        window.removeEventListener('blur', markHandedOff)
        window.removeEventListener('pagehide', markHandedOff)
        document.removeEventListener('visibilitychange', onVisibility)
      }

      // Attempt the handoff. On a machine with no handler registered this is
      // a no-op in Chrome/Edge rather than an error.
      window.location.href = `${APP_SCHEME}?plan=${encodeURIComponent(plan)}`

      timers.current.push(
        window.setTimeout(() => {
          cleanup()
          if (!handedOff && !document.hidden) {
            window.location.href = downloadHref
          }
        }, HANDOFF_TIMEOUT_MS),
      )
    },
    [plan, downloadHref],
  )

  return (
    // The href is the download page, not the scheme: it keeps the link
    // meaningful to middle-click, "copy link address", and crawlers, and it is
    // where the JS falls back to anyway. The scheme attempt is layered on top.
    <a className={className} href={downloadHref} onClick={handleClick}>
      {children}
    </a>
  )
}
