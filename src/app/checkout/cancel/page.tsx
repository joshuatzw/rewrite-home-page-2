'use client'

import { useEffect } from 'react'

export default function CheckoutCancel() {
  useEffect(() => {
    window.location.href = 'rewrite://checkout-cancelled'
  }, [])

  return (
    <div className="checkout-screen">
      <div className="checkout-card">
        <div className="checkout-brand">
          re<i>Write</i>
        </div>
        <p className="checkout-message">
          No worries &mdash; you can upgrade anytime from re<em>Write</em>.
        </p>
        <div className="kicker checkout-status">You can close this window.</div>
      </div>
    </div>
  )
}
