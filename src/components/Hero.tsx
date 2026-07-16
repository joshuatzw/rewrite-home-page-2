export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="kicker">A writing assistant that lives in one hotkey</div>
        <h1>
          Write it once. Send it with <em>confidence.</em>
        </h1>
        <div className="hero-grid">
          <div>
            <p className="hero-lead">
              reWrite rewrites, proofreads and distills whatever you&apos;re typing, right where
              you type it. <b>No pasting into a chatbot. No tab-switching.</b> Just press the key
              and keep going.
            </p>
            <div className="hero-cta">
              <a href="#" className="btn-solid">
                Start writing free
              </a>
              <span className="hint">
                or <span className="kbd">highlight the text below</span> to try it
              </span>
            </div>
          </div>
          <div />
        </div>
      </div>
    </section>
  )
}
