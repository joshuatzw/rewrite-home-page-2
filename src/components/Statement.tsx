import type { Dictionary } from '@/dictionaries'

export default function Statement({ dict }: { dict: Dictionary['statement'] }) {
  return (
    <section className="statement">
      <div className="wrap">
        <p>
          {dict.before}<em>{dict.em}</em>
        </p>
        <div className="by">{dict.by}</div>
      </div>
    </section>
  )
}
