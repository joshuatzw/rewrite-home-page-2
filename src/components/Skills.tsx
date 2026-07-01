import Image from 'next/image'

export default function Skills() {
  return (
    <section className="skills">
      <div className="wrap">
        <div className="skills-inner">
          <div className="skills-head">
            <h2>
              Introducing <em>Skills</em>
            </h2>
            <p>Build the writing assistant that actually sounds like you.</p>
          </div>

          <div className="skills-hero-img">
            <Image
              src="/assets/Skills-Menu.png"
              alt="reWrite Skills menu"
              width={1298}
              height={912}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div className="skill-item">
            <div className="no">01</div>
            <h3>Teach it once, <em>never again.</em></h3>
            <p>Show reWrite your tone, your brand voice, your preferred style. It carries that into every rewrite from here on.</p>
          </div>

          <div className="skills-sub-img">
            <Image
              src="/assets/New-Skill.png"
              alt="Create a new skill"
              width={519}
              height={497}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div className="skill-item">
            <div className="no">02</div>
            <h3>One skill <em>per context.</em></h3>
            <p>A formal report calls for a different voice than a Slack message or a campaign summary. Write a skill for each and let reWrite handle the rest.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
