'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="top">
        <div className="wrap">
          <button
            className="hamburger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <line x1="2" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="2" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          <div className="brand">
            <Image src="/assets/rewrite_logo_black.png" alt="reWrite" width={26} height={26} />
            <span className="name">
              <b>re</b>
              <i>Write</i>
            </span>
          </div>

          <nav className="links">
            <a href="#demo">Demo</a>
            <a href="#caps">What it does</a>
            <a href="#loop">The loop</a>
            <a href="#get" className="btn-ghost">
              Get reWrite
            </a>
          </nav>
        </div>
      </header>

      {open && (
        <div className="mobile-menu">
          <a href="#demo" onClick={() => setOpen(false)}>Demo</a>
          <a href="#caps" onClick={() => setOpen(false)}>What it does</a>
          <a href="#loop" onClick={() => setOpen(false)}>The loop</a>
          <a href="#get" className="btn-ghost mobile-menu-cta" onClick={() => setOpen(false)}>Get reWrite</a>
        </div>
      )}
    </>
  )
}
