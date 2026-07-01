const CAPS = [
  {
    no: '01 / Rewrite',
    title: <>Say it <em>better</em></>,
    body: 'Turn a rushed draft into a clear, on-tone message. Warm it up, tighten it, or make it sound like you on a good day.',
  },
  {
    no: '02 / Proofread',
    title: <>Catch <em>everything</em></>,
    body: 'Spelling, grammar, doubled words, stray punctuation. Fixed quietly before anyone else sees the draft.',
  },
  {
    no: '03 / Summarize',
    title: <>Find the <em>signal</em></>,
    body: 'Drop in a wall of meeting notes and get the two lines that actually matter back in seconds.',
  },
  {
    no: '04 / Bullets',
    title: <>Make it <em>scannable</em></>,
    body: 'Reshape long, dense text into a clean list people will actually read. Perfect for recaps and handoffs.',
  },
]

export default function Capabilities() {
  return (
    <section id="caps" className="caps">
      <div className="wrap">
        <div className="head">
          <h2>
            Four things, <em>one</em> hotkey.
          </h2>
          <p>Fire up reWrite, pick a behaviour, and watch the magic.</p>
        </div>
        <div className="cap-grid">
          {CAPS.map((cap) => (
            <div key={cap.no} className="cap">
              <div className="no">{cap.no}</div>
              <h3>{cap.title}</h3>
              <p>{cap.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
