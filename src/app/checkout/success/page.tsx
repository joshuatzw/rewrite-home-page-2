'use client'

import { useEffect } from 'react'

export default function CheckoutSuccess() {
  useEffect(() => {
    window.location.href = 'rewrite://checkout-success'
  }, [])

  return (
    <div className="checkout-screen">
      <div className="checkout-card">
        <div className="checkout-brand">
          re<i>Write</i>
        </div>
        <p className="checkout-message">
          You&rsquo;re all set! Returning to re<em>Write</em>&hellip;
        </p>
        <div className="kicker checkout-status">Opening app&hellip;</div>
      </div>
    </div>
  )
}
