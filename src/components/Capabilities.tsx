const CAPS = [
  {
    no: '01 / Proofread',
    title: <>Catch <em>everything</em></>,
    body: 'Spelling, grammar, doubled words, stray punctuation. Fixed quietly, with your tone and wording left exactly as you wrote them.',
  },
  {
    no: '02 / Polish',
    title: <>Ready to <em>send</em></>,
    body: 'Turn a rushed draft into something you can put in front of a colleague, client, or manager. Clearer, tighter, and professional without losing your meaning.',
  },
  {
    no: '03 / Summarise',
    title: <>Find the <em>signal</em></>,
    body: 'Drop in a wall of meeting notes and get back the few lines that actually matter, decisions, deadlines, and asks intact.',
  },
  {
    no: '04 / Enhance',
    title: <>Say <em>more</em></>,
    body: 'Take a thin, underdeveloped draft and give it depth. Weak points get sharper and the argument reads as complete, without inventing facts you never gave it.',
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
