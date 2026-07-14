import SkillsApp from './SkillsApp'

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

          <div className="skills-live">
            <SkillsApp />
          </div>

          <div className="skill-row">
            <div className="skill-item">
              <div className="no">01</div>
              <h3>Teach it once, <em>never again.</em></h3>
              <p>Show reWrite your tone, your brand voice, your preferred style. It carries that into every rewrite from here on.</p>
            </div>

            <div className="skill-item">
              <div className="no">02</div>
              <h3>One skill <em>per context.</em></h3>
              <p>A formal report calls for a different voice than a Slack message or a campaign summary. Write a skill for each and let reWrite handle the rest. Try it above — toggle a few on, or create one of your own.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
