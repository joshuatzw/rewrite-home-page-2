import type { Dictionary } from '@/dictionaries'

export default function GetReWrite({ dict }: { dict: Dictionary['getReWrite'] }) {
  return (
    <section id="get" className="get">
      <div className="wrap">
        <div className="get-inner">
          <div className="kicker">{dict.kicker}</div>
          <h2>
            {dict.headingBefore} <br></br>
            <em>{dict.headingEm}</em>
          </h2>
          <div className="get-cta">
            <a
              className="btn-download"
              href="https://github.com/joshuatzw/reWrite/releases/download/v1.1.7/reWrite_1.1.7_x64-setup.exe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.ariaWindows}
            >
              <span className="plat">{dict.windows}</span>
              <span className="soon">{dict.downloadWindows}</span>
            </a>
            <a
              className="btn-download"
              href="https://github.com/joshuatzw/reWrite/releases/download/v1.1.7/reWrite_1.1.7_universal.dmg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.ariaMacos}
            >
              <span className="plat">{dict.macos}</span>
              <span className="soon">{dict.downloadMacos}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
