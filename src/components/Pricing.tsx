import type { Dictionary } from '@/dictionaries'
import UpgradeCta from './UpgradeCta'

// ============================================================================
// PLACEHOLDER PRICING — pending final numbers from product owner.
// Swap the three amounts below (and CURRENCY, if it ever changes). Prices are
// deliberately NOT in the dictionaries: they are the same figures in every
// locale, and duplicating them across en/th/zh would let the three drift apart.
// Amounts are plain numbers; the currency symbol is applied once, in the JSX.
// ============================================================================
const CURRENCY = '$'

const TIER_AMOUNT: Record<TierId, number> = {
  free: 0,
  pro: 6.90,
  max: 19.90,
}

type TierId = 'free' | 'pro' | 'max'

const TIER_ORDER: TierId[] = ['free', 'pro', 'max']

/**
 * Whole numbers render bare, fractional ones to two places. Without this,
 * 6.90 renders as "6.9" — JavaScript numbers do not carry trailing zeros,
 * and "$6.9" reads as a typo on a pricing page.
 */
function formatAmount(amount: number): string {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2)
}

// The CTAs point back at the download section, which lives on the home page —
// so this must be an absolute, locale-aware path, not a bare `#get` fragment
// (a bare fragment resolves against /pricing and scrolls nowhere).
export default function Pricing({
  dict,
  ctaHref,
}: {
  dict: Dictionary['pricing']
  ctaHref: string
}) {
  return (
    <section id="pricing" className="pricing">
      <div className="wrap">
        <div className="pricing-head">
          <div>
            <p className="kicker">{dict.kicker}</p>
            <h2>
              {dict.heading.lead}
              <em>{dict.heading.emphasis}</em>
            </h2>
          </div>
          <p>{dict.subhead}</p>
        </div>

        <div className="pricing-grid">
          {TIER_ORDER.map((id) => {
            const tier = dict.tiers[id]
            const isHighlight = id === 'pro'
            const badge = 'badge' in tier ? tier.badge : undefined

            return (
              <div
                key={id}
                className={`price-card${isHighlight ? ' price-card--highlight' : ''}`}
              >
                {badge && <div className="price-badge">{badge}</div>}
                <div className="price-name">{tier.name}</div>
                <p className="price-tagline">{tier.tagline}</p>

                <div className="price-amount">
                  <span className="price-currency">{CURRENCY}</span>
                  <span className="price-value">{formatAmount(TIER_AMOUNT[id])}</span>
                  <span className="price-period">{dict.billingSuffix}</span>
                </div>

                <ul className="price-features">
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                {/* Free sends people straight to the download. Paid tiers try
                    to hand off to an already-installed app first, falling back
                    to the same download — see UpgradeCta for why that check is
                    a heuristic rather than a real installed-app test. */}
                {id === 'free' ? (
                  <a className="price-cta" href={ctaHref}>
                    {tier.cta}
                  </a>
                ) : (
                  <UpgradeCta className="price-cta" plan={id} downloadHref={ctaHref}>
                    {tier.cta}
                  </UpgradeCta>
                )}
              </div>
            )
          })}
        </div>

        <p className="pricing-note">{dict.note}</p>
      </div>
    </section>
  )
}
