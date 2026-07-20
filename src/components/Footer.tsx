import Link from 'next/link'
import type { Dictionary, Locale } from '@/dictionaries'

interface FooterProps {
  lang: Locale
  dict: Dictionary['footer']
}

export default function Footer({ lang, dict }: FooterProps) {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="name">
              re<i>Write</i>
            </div>
            <p className="tag">{dict.tagline}</p>
          </div>
          <div className="foot-links">
            <div className="foot-col">
              <h4>{dict.product}</h4>
              <a href="#demo">{dict.productLinks.demo}</a>
              <a href="#caps">{dict.productLinks.modes}</a>
              <a href="#loop">{dict.productLinks.loop}</a>
              <a href="#get">{dict.productLinks.download}</a>
            </div>
            <div className="foot-col">
              <h4>{dict.company}</h4>
              <a href="#">{dict.companyLinks.about}</a>
              <a href="#">{dict.companyLinks.manifesto}</a>
              <Link href={`/${lang}/privacy`}>{dict.companyLinks.privacy}</Link>
              <Link href={`/${lang}/contact`}>{dict.companyLinks.contact}</Link>
            </div>
          </div>
        </div>
        <div className="foot-base">{dict.copyright}</div>
      </div>
    </footer>
  )
}
