'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

/* One fixed draft, four predetermined refinements. The draft text is
   intentionally rendered in a non-editable node so the demo can't be abused
   as a free rewrite box — the user highlights, picks a skill, and watches a
   canned result play out. */
const DRAFT =
  `hey so i went over the numbers from last quater and honestly its looking pretty good, we definately beat the target and i think we should tell the team soon, maybe in the meeting tommorow`

interface Skill {
  key: string
  label: string
  note: string
  after: string
}

const SKILLS: Skill[] = [
  {
    key: 'proofread',
    label: 'Proofread',
    note: 'Fix every error, voice untouched',
    after:
      `Hey, so I went over the numbers from last quarter and honestly it's looking pretty good. We definitely beat the target, and I think we should tell the team soon — maybe in the meeting tomorrow.`,
  },
  {
    key: 'polish',
    label: 'Polish',
    note: 'Rough draft → ready to send',
    after:
      `Hi team,\n\nI've had a chance to review last quarter's numbers, and the results are strong — we comfortably beat our target. I'd love to walk everyone through the details at tomorrow's meeting.`,
  },
  {
    key: 'summarise',
    label: 'Summarise',
    note: 'A wall of text → the essentials',
    after: `Last quarter beat target. Sharing the details at tomorrow's meeting.`,
  },
  {
    key: 'enhance',
    label: 'Enhance',
    note: 'Thin and flat → sharp and convincing',
    after:
      `I've finished reviewing last quarter's performance, and the numbers are genuinely encouraging: we beat our target with room to spare. That's a result worth sharing with the whole team, so I'd like to walk everyone through the highlights at tomorrow's meeting.`,
  },
]

type Status = 'idle' | 'thinking' | 'done'

interface Bubble {
  x: number
  y: number
}

function buildWords(after: string) {
  const lines = after.split('\n')
  let idx = 0
  return lines.map((line) =>
    line === ''
      ? null
      : line.split(' ').map((w) => ({ text: w, delay: idx++ * 14 }))
  )
}

export default function HowItWorks() {
  const [bubble, setBubble] = useState<Bubble | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [active, setActive] = useState<Skill | null>(null)
  const [revealed, setRevealed] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const draftRef = useRef<HTMLDivElement>(null)
  const thinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearBubble = useCallback(() => {
    setBubble(null)
    setMenuOpen(false)
  }, [])

  // Detect a highlight inside the (non-editable) draft and float the bubble
  // just above the end of the selection.
  const handleSelect = useCallback(() => {
    if (status !== 'idle') return
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return
    const range = sel.getRangeAt(0)
    const draft = draftRef.current
    const stage = stageRef.current
    if (!draft || !stage || !draft.contains(range.commonAncestorContainer)) return
    if (sel.toString().trim().length < 2) return

    const rects = range.getClientRects()
    const rect = rects.length ? rects[rects.length - 1] : range.getBoundingClientRect()
    const cont = stage.getBoundingClientRect()
    const x = Math.min(Math.max(rect.right - cont.left, 60), cont.width - 16)
    const y = rect.top - cont.top
    setBubble({ x, y })
    setMenuOpen(false)
  }, [status])

  // Collapse the bubble if the user clicks away without picking a skill.
  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      const t = e.target as Node
      if (stageRef.current && stageRef.current.contains(t)) {
        if ((t as HTMLElement).closest?.('.hiw-bubble, .hiw-menu')) return
      }
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed) clearBubble()
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [clearBubble])

  useEffect(() => {
    return () => {
      if (thinkTimer.current) clearTimeout(thinkTimer.current)
    }
  }, [])

  function applySkill(skill: Skill) {
    window.getSelection()?.removeAllRanges()
    clearBubble()
    setActive(skill)
    setRevealed(false)
    setStatus('thinking')
    if (thinkTimer.current) clearTimeout(thinkTimer.current)
    thinkTimer.current = setTimeout(() => {
      setStatus('done')
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setRevealed(true))
      )
    }, 620)
  }

  function reset() {
    if (thinkTimer.current) clearTimeout(thinkTimer.current)
    window.getSelection()?.removeAllRanges()
    setActive(null)
    setRevealed(false)
    setStatus('idle')
    clearBubble()
  }

  const outputLines = active ? buildWords(active.after) : []

  return (
    <div className="hiw proof">
      <div className="proof-head hiw-head">
        <span className="lbl">How it works</span>
        <ol className="hiw-steps">
          <li><b>1</b> Highlight text</li>
          <li><b>2</b> Pick a skill</li>
          <li><b>3</b> Watch it rewrite</li>
        </ol>
      </div>

      <div className="proof-body">
        <div className="hiw-prompt">
          {status === 'idle' ? (
            <>Highlight any part of the text below — a <b>reWrite</b> bubble appears. Click it, choose a skill, and the draft is rewritten for you.</>
          ) : (
            <>reWrite applied <b>{active?.label}</b> to your draft.</>
          )}
        </div>

        <div className="hiw-stage" ref={stageRef}>
          {status === 'idle' ? (
            <div
              ref={draftRef}
              className="hiw-draft"
              onMouseUp={handleSelect}
              onKeyUp={handleSelect}
            >
              {DRAFT}
            </div>
          ) : (
            <div
              className={`hiw-draft hiw-output${revealed ? ' rw-revealed' : ''}`}
              aria-live="polite"
            >
              {status === 'thinking' ? (
                <span className="hiw-thinking">
                  Rewriting your draft<span className="rw-caret" />
                </span>
              ) : (
                outputLines.map((line, li) =>
                  line === null ? (
                    <br key={li} />
                  ) : (
                    <span key={li}>
                      {line.map((word, wi) => (
                        <span key={wi}>
                          <span
                            className="rw-w"
                            style={{ transitionDelay: `${word.delay}ms` }}
                          >
                            {word.text}
                          </span>
                          {wi < line.length - 1 ? ' ' : ''}
                        </span>
                      ))}
                    </span>
                  )
                )
              )}
            </div>
          )}

          {bubble && status === 'idle' && (
            <div
              className="hiw-anchor"
              style={{ left: bubble.x, top: bubble.y }}
            >
              <button
                type="button"
                className="hiw-bubble"
                aria-label="Rewrite selection"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                // keep the native highlight alive while the bubble is clicked
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setMenuOpen((o) => !o)}
              >
                <span className="hiw-bubble-inner">
                  <img
                    src="/assets/logo_transparent_new.png"
                    alt=""
                    width={20}
                    height={20}
                    draggable={false}
                  />
                </span>
              </button>

              {menuOpen && (
                <div className="hiw-menu" role="menu">
                  <div className="hiw-menu-label">Choose a skill</div>
                  {SKILLS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      role="menuitem"
                      className="hiw-menu-item"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applySkill(s)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="proof-foot hiw-foot">
        <div className="proof-foot-status">
          {status === 'idle'
            ? 'Highlight text to begin'
            : status === 'thinking'
              ? 'Working…'
              : 'Done. Try another skill.'}
        </div>
        <button
          type="button"
          className="run hiw-reset"
          onClick={reset}
          disabled={status === 'idle'}
        >
          Reset draft
        </button>
      </div>
    </div>
  )
}
