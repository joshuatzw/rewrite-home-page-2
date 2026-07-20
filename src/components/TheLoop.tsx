import type { Dictionary } from '@/dictionaries'

const STEP_META: { n: string; gone?: boolean; keep?: boolean }[] = [
  { n: '01', gone: true },
  { n: '02', gone: true },
  { n: '03', gone: true },
  { n: '04', gone: true },
  { n: '05', gone: true },
  { n: '06', gone: true },
  { n: '→', keep: true },
]

export default function TheLoop({ dict }: { dict: Dictionary['theLoop'] }) {
  return (
    <section id="loop" className="loop">
      <div className="wrap">
        <div className="loop-inner">
          <div>
            <h2>
              {dict.heading}<em>{dict.headingEm}</em>
            </h2>
            <p className="sub">{dict.sub}</p>
          </div>
          <div className="loop-steps">
            {STEP_META.map((step, i) => (
              <div
                key={step.n}
                className={['lstep', step.gone ? 'gone' : '', step.keep ? 'keep' : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="n">{step.n}</span>
                <span className="t">{dict.steps[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
