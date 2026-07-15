'use client'

import { useEffect, useState } from 'react'

type AuthState = 'loading' | 'success' | 'error'

const DEFAULT_ERROR =
  'Something went wrong. Please return to reWrite and try again.'

export default function AuthSuccess() {
  const [state, setState] = useState<AuthState>('loading')
  const [errorMsg, setErrorMsg] = useState(DEFAULT_ERROR)
  const [deepLink, setDeepLink] = useState('')

  useEffect(() => {
    // Resolve after paint so the loading state renders first, and so state
    // updates run in a deferred callback rather than synchronously in the
    // effect body. Supabase's implicit flow returns tokens in the URL
    // fragment (#access_token=...&refresh_token=...); errors come back as
    // #error=...&error_description=... (or ?error=...).
    const timers: number[] = []

    const scrub = () =>
      window.history.replaceState(null, '', window.location.pathname)

    timers.push(
      window.setTimeout(() => {
        const hash = window.location.hash
          ? window.location.hash.substring(1)
          : ''
        const search = window.location.search
          ? window.location.search.substring(1)
          : ''
        const params = new URLSearchParams(hash || search)

        if (params.get('error')) {
          const desc = params.get('error_description')
          if (desc) setErrorMsg(decodeURIComponent(desc.replace(/\+/g, ' ')))
          setState('error')
          scrub()
          return
        }

        if (!params.get('access_token')) {
          setState('error')
          scrub()
          return
        }

        // Build the deep link that hands the tokens to the desktop app.
        const link = 'rewrite://auth#' + hash
        setDeepLink(link)
        setState('success')

        // Fire the deep link so the "Open reWrite?" prompt appears over the
        // finished success screen. The button is a manual fallback if the
        // browser blocks the automatic scheme launch.
        timers.push(
          window.setTimeout(() => {
            window.location.href = link
          }, 400)
        )

        // Remove the access_token from the address bar / history for hygiene.
        timers.push(window.setTimeout(scrub, 800))
      }, 0)
    )

    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  const handleReturn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (deepLink) window.location.href = deepLink
  }

  return (
    <div className="checkout-screen">
      <div className="checkout-card">
        <div className="checkout-brand">
          re<i>Write</i>
        </div>

        {state === 'loading' && (
          <>
            <div className="auth-spinner" aria-hidden="true" />
            <p className="checkout-message">Finishing sign-in&hellip;</p>
            <div className="kicker checkout-status">
              One moment while we connect you to re<em>Write</em>.
            </div>
          </>
        )}

        {state === 'success' && (
          <>
            <div className="auth-badge auth-badge--ok" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="checkout-message">
              You&rsquo;re signed in to re<em>Write</em>.
            </p>
            <div className="kicker checkout-status">
              The app should now be open and ready. You can close this tab.
            </div>
            <div className="auth-actions">
              <a
                className="btn-solid"
                href={deepLink || '#'}
                onClick={handleReturn}
              >
                Return to reWrite
              </a>
            </div>
            <p className="auth-hint">Didn&rsquo;t open? Click the button above.</p>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="auth-badge auth-badge--err" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
            <p className="checkout-message">Sign-in didn&rsquo;t complete.</p>
            <div className="kicker checkout-status">{errorMsg}</div>
          </>
        )}
      </div>
    </div>
  )
}
