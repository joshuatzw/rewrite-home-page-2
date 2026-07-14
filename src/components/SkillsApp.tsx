'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Skill {
  id: string
  name: string
  desc: string
  kind: 'built-in' | 'custom'
  base?: string
  on: boolean
}

const SEED: Skill[] = [
  { id: 'proofread', name: 'Proofread', desc: 'Fix spelling and grammar while preserving your tone and voice.', kind: 'built-in', on: true },
  { id: 'formal-email', name: 'Formal Email', desc: 'Rewrite as a polished, professional business email.', kind: 'built-in', on: true },
  { id: 'summarise', name: 'Summarise', desc: 'Condense the text into concise bullet points.', kind: 'built-in', on: false },
  { id: 'shorten', name: 'Shorten', desc: 'Shorten the text while preserving its full meaning.', kind: 'built-in', on: true },
  { id: 'beef', name: 'Beef It Up', desc: 'Take this text and write me a mail. You need to beef up my email with more information. For complex portions, please break it', kind: 'custom', base: 'Formal Email', on: true },
  { id: 'jp', name: 'Translate to Japanese', desc: 'Please help me to rewrite the following text in Japanese. The setting of the Japanese language should be formal business. After', kind: 'custom', on: true },
  { id: 'ecom', name: 'E-Commerce Speak', desc: '#I want you to take this text and rewrite it in a way that is suitable for eCommerce/marketing use. #The text should be catchy,', kind: 'custom', on: true },
]

function Icon({ name }: { name: 'home' | 'history' | 'skills' | 'settings' }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (name === 'home')
    return (
      <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
    )
  if (name === 'history')
    return (
      <svg {...common}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 8v4l3 2" /></svg>
    )
  if (name === 'skills')
    return (
      <svg {...common}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 5v14" /></svg>
    )
  return (
    <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 6.6 19l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 12.6H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 6l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9 3.4V3a2 2 0 1 1 4 0v.1A1.6 1.6 0 0 0 15 4.6l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8Z" /></svg>
  )
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      className={`sk-toggle${on ? ' is-on' : ''}`}
      role="switch"
      aria-checked={on}
      aria-label={`${on ? 'Hide' : 'Show'} ${label}`}
      onClick={onClick}
    >
      <span className="sk-knob" />
    </button>
  )
}

function SkillCard({ skill, onToggle, onRemove }: { skill: Skill; onToggle: () => void; onRemove?: () => void }) {
  return (
    <div className={`sk-card${skill.on ? '' : ' is-off'}`}>
      <div className="sk-card-top">
        <h4>{skill.name}</h4>
        <Toggle on={skill.on} onClick={onToggle} label={skill.name} />
      </div>
      <p>{skill.desc}</p>
      <div className="sk-tags">
        {skill.base && <span className="sk-tag">{skill.base}</span>}
        <span className="sk-tag">{skill.kind === 'built-in' ? 'Built-in' : 'Custom'}</span>
        {onRemove && (
          <button type="button" className="sk-remove" onClick={onRemove} aria-label={`Delete ${skill.name}`}>
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

export default function SkillsApp() {
  const [skills, setSkills] = useState<Skill[]>(SEED)
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [base, setBase] = useState('None')
  const [instructions, setInstructions] = useState('')

  const builtIn = skills.filter((s) => s.kind === 'built-in')
  const custom = skills.filter((s) => s.kind === 'custom')
  const enabledCount = skills.filter((s) => s.on).length

  function toggle(id: string) {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, on: !s.on } : s)))
  }

  function remove(id: string) {
    setSkills((prev) => prev.filter((s) => s.id !== id))
  }

  function openModal() {
    setName('')
    setBase('None')
    setInstructions('')
    setModalOpen(true)
  }

  function createSkill() {
    if (!name.trim() || !instructions.trim()) return
    setSkills((prev) => [
      ...prev,
      {
        id: `skill-${Date.now()}`,
        name: name.trim(),
        desc: instructions.trim(),
        kind: 'custom',
        base: base !== 'None' ? base : undefined,
        on: true,
      },
    ])
    setModalOpen(false)
  }

  useEffect(() => {
    if (!modalOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setModalOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [modalOpen])

  const canCreate = name.trim().length > 0 && instructions.trim().length > 0

  return (
    <div className="sk-frame">
      <div className="sk-chrome">
        <span className="sk-dot" />
        <span className="sk-dot" />
        <span className="sk-dot" />
        <span className="sk-chrome-label">re:Write</span>
      </div>

      <div className="sk-app">
        <aside className="sk-side">
          <div className="sk-logo">
            <Image src="/assets/logo_transparent_new.png" alt="re:Write" width={34} height={34} />
          </div>
          <nav className="sk-nav">
            <span className="sk-nav-item"><Icon name="home" />Home</span>
            <span className="sk-nav-item"><Icon name="history" />History</span>
            <span className="sk-nav-item is-active"><Icon name="skills" />Skills</span>
            <span className="sk-nav-item"><Icon name="settings" />Settings</span>
          </nav>
          <div className="sk-side-foot">
            <div className="sk-user">
              <span className="sk-avatar">JM</span>
              <span className="sk-user-meta">
                <b>Joshua Mendel</b>
                <i>re:Write Pro</i>
              </span>
            </div>
            <div className="sk-version">Version 1.3.1</div>
          </div>
        </aside>

        <main className="sk-main">
          <div className="sk-main-head">
            <div>
              <h3>Skills</h3>
              <p>Teach re:Write the voice you want. Toggle to show or hide in the overlay.</p>
            </div>
            <button type="button" className="sk-new" onClick={openModal}>
              <span>+</span> New skill
            </button>
          </div>

          <div className="sk-count">{enabledCount} of {skills.length} active</div>

          <div className="sk-group-label">Built-in</div>
          <div className="sk-grid">
            {builtIn.map((s) => (
              <SkillCard key={s.id} skill={s} onToggle={() => toggle(s.id)} />
            ))}
          </div>

          <div className="sk-group-label">Custom</div>
          <div className="sk-grid">
            {custom.map((s) => (
              <SkillCard key={s.id} skill={s} onToggle={() => toggle(s.id)} onRemove={() => remove(s.id)} />
            ))}
            <button type="button" className="sk-add-card" onClick={openModal}>
              <span className="sk-add-circle">+</span>
              Create a new skill
            </button>
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="sk-backdrop" onMouseDown={() => setModalOpen(false)}>
          <div className="sk-modal" role="dialog" aria-modal="true" aria-label="New skill" onMouseDown={(e) => e.stopPropagation()}>
            <h4>New skill</h4>

            <label className="sk-f-label">Name</label>
            <input
              className="sk-input"
              placeholder="e.g. Slack Casual"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />

            <label className="sk-f-label">Base skill <span>(optional)</span></label>
            <select className="sk-input sk-select" value={base} onChange={(e) => setBase(e.target.value)}>
              <option>None</option>
              {skills.map((s) => (
                <option key={s.id}>{s.name}</option>
              ))}
            </select>
            <p className="sk-f-hint">Your instructions stack on top of the selected base skill.</p>

            <label className="sk-f-label">Instructions</label>
            <textarea
              className="sk-input sk-textarea"
              placeholder="Describe how this skill should rewrite text…"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />

            <div className="sk-modal-foot">
              <button type="button" className="sk-btn-ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="sk-btn-solid" disabled={!canCreate} onClick={createSkill}>
                Create skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
