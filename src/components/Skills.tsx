import Image from 'next/image'

const SKILLS = [
  {
    no: '01',
    title: <>Teach it once, <em>never again.</em></>,
    body: 'Show reWrite your tone, your brand voice, your preferred style. It carries that into every rewrite from here on.',
  },
  {
    no: '02',
    title: <>One skill <em>per context.</em></>,
    body: 'A formal report calls for a different voice than a Slack message or a campaign summary. Write a skill for each and let reWrite handle the rest.',
  },
]

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

          <div className="cap-grid">
            {SKILLS.map((skill) => (
              <div key={skill.no} className="cap">
                <div className="no">{skill.no}</div>
                <h3>{skill.title}</h3>
                <p>{skill.body}</p>
              </div>
            ))}
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
        </div>
      </div>
    </section>
  )
}
