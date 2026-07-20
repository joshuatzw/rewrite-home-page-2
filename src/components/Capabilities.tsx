import type { Dictionary } from '@/dictionaries'

export default function Capabilities({ dict }: { dict: Dictionary['capabilities'] }) {
  return (
    <section id="caps" className="caps">
      <div className="wrap">
        <div className="head">
          <h2>
            {dict.heading}<em>{dict.headingEm}</em>{dict.headingAfter}
          </h2>
          <p>{dict.sub}</p>
        </div>
        <div className="cap-grid">
          {dict.items.map((cap) => (
            <div key={cap.no} className="cap">
              <div className="no">{cap.no}</div>
              <h3>
                {cap.title}<em>{cap.titleEm}</em>
              </h3>
              <p>{cap.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
