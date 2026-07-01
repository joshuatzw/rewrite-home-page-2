const STEPS = [
  { n: '01', t: 'Write the draft in your email', gone: true },
  { n: '02', t: 'Copy it all', gone: true },
  { n: '03', t: 'Open a chatbot in another tab', gone: true },
  { n: '04', t: 'Paste, prompt, and wait', gone: true },
  { n: '05', t: 'Copy the answer back', gone: true },
  { n: '06', t: 'Paste and re-format it', gone: true },
  { n: '→', t: 'Press the hotkeys. Keep writing.', keep: true },
]

export default function TheLoop() {
  return (
    <section id="loop" className="loop">
      <div className="wrap">
        <div className="loop-inner">
          <div>
            <h2>
              Delete the <em>copy-paste loop.</em>
            </h2>
            <p className="sub">
              The old way takes seven steps and three apps. reWrite is one — and you never leave
              the cursor you were already in.
            </p>
          </div>
          <div className="loop-steps">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className={['lstep', step.gone ? 'gone' : '', step.keep ? 'keep' : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="n">{step.n}</span>
                <span className="t">{step.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
