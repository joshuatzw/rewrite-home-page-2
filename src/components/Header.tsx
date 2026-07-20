'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LanguageToggle from './LanguageToggle'
import type { Dictionary, Locale } from '@/dictionaries'

interface HeaderProps {
  lang: Locale
  nav: Dictionary['nav']
  languageToggle: Dictionary['languageToggle']
}

export default function Header({ lang, nav, languageToggle }: HeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="top">
        <div className="wrap">
          <button
            className="hamburger"
            aria-label={open ? nav.closeMenu : nav.openMenu}
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
            <Image src="/assets/logo_transparent_new.png" alt="reWrite" width={26} height={26} />
            <span className="name">
              <b>re</b>
              <i>Write</i>
            </span>
          </div>

          <nav className="links">
            <a href={`/${lang}#demo`}>{nav.demo}</a>
            <a href={`/${lang}#caps`}>{nav.whatItDoes}</a>
            <a href={`/${lang}#loop`}>{nav.theLoop}</a>
            <Link href={`/${lang}/pricing`}>{nav.pricing}</Link>
            <a href={`/${lang}#get`} className="btn-ghost">
              {nav.getRewrite}
            </a>
            <LanguageToggle lang={lang} ariaLabel={languageToggle.ariaLabel} />
          </nav>
        </div>
      </header>

      {open && (
        <div className="mobile-menu">
          <a href={`/${lang}#demo`} onClick={() => setOpen(false)}>{nav.demo}</a>
          <a href={`/${lang}#caps`} onClick={() => setOpen(false)}>{nav.whatItDoes}</a>
          <a href={`/${lang}#loop`} onClick={() => setOpen(false)}>{nav.theLoop}</a>
          <Link href={`/${lang}/pricing`} onClick={() => setOpen(false)}>{nav.pricing}</Link>
          <a href={`/${lang}#get`} className="btn-ghost mobile-menu-cta" onClick={() => setOpen(false)}>{nav.getRewrite}</a>
          <div className="mobile-menu-lang">
            <LanguageToggle lang={lang} ariaLabel={languageToggle.ariaLabel} />
          </div>
        </div>
      )}
    </>
  )
}
