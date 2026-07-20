import type { Dictionary } from '@/dictionaries'

export default function Hero({ dict }: { dict: Dictionary['hero'] }) {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="kicker">{dict.kicker}</div>
        <h1>
          {dict.titleLead}<em>{dict.titleEm}</em>
        </h1>
        <div className="hero-grid">
          <div>
            <p className="hero-lead">
              {dict.leadBefore}<b>{dict.leadBold}</b>{dict.leadAfter}
            </p>
            <div className="hero-cta">
              <a href="#get" className="btn-solid">
                {dict.cta}
              </a>
              <span className="hint">
                {dict.hintBefore}<span className="kbd">{dict.hintKbd}</span>{dict.hintAfter}
              </span>
            </div>
          </div>
          <div />
        </div>
      </div>
    </section>
  )
}
