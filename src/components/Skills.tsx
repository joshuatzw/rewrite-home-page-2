import SkillsApp from './SkillsApp'
import type { Dictionary } from '@/dictionaries'

interface SkillsProps {
  dict: Dictionary['skills']
  skillsAppDict: Dictionary['skillsApp']
}

export default function Skills({ dict, skillsAppDict }: SkillsProps) {
  return (
    <section className="skills">
      <div className="wrap">
        <div className="skills-inner">
          <div className="skills-head">
            <h2>
              {dict.heading}<em>{dict.headingEm}</em>
            </h2>
            <p>{dict.sub}</p>
          </div>

          <div className="skills-live">
            <SkillsApp dict={skillsAppDict} />
          </div>

          <div className="skill-row">
            {dict.items.map((item) => (
              <div className="skill-item" key={item.no}>
                <div className="no">{item.no}</div>
                <h3>
                  {item.title}<em>{item.titleEm}</em>
                </h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
