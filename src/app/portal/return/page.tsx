'use client'

import { useEffect } from 'react'

export default function PortalReturn() {
  useEffect(() => {
    window.location.href = 'rewrite://portal-return'
  }, [])

  return (
    <div className="checkout-screen">
      <div className="checkout-card">
        <div className="checkout-brand">
          re<i>Write</i>
        </div>
        <p className="checkout-message">
          All done &mdash; returning to re<em>Write</em>&hellip;
        </p>
        <div className="kicker checkout-status">Opening app&hellip;</div>
      </div>
    </div>
  )
}
