'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const NOTES_BEFORE =
  `Q3 planning sync — 47 min. Went back and forth on priorities. Marketing wants the pricing-page refresh, but the data says most churn happens in the very first session: people never finish setup. Agreed onboarding wins. Eng thinks the new first-run flow is doable by mid-August if we cut the import step for v1. Pricing experiment results land early September, so we're holding any pricing changes until then. Sam to own the experiment dashboard. Next sync Thursday.`

const SAMPLES = {
  rewrite: {
    label: 'Rewrite',
    note: 'Casual draft → polished, on-tone email',
    before: `hey — wanted to check in on the deck from last week. did you get a chance to look? kinda need it by EOD if possible. lmk! thx`,
    after: `Hi Maya,\n\nFollowing up on the deck I shared last week — were you able to take a look? I'd love to get your notes by end of day if that works on your side.\n\nThanks so much,\nJordan`,
  },
  proofread: {
    label: 'Proofread',
    note: 'Catches spelling, grammar & punctuation',
    before: `Their going to send the the report tommorow. Its been a long proccess but we definately made alot of progress this quater.`,
    after: `They're going to send the report tomorrow. It's been a long process, but we definitely made a lot of progress this quarter.`,
  },
  summarize: {
    label: 'Summarize',
    note: 'A wall of notes → a two-line readout',
    before: NOTES_BEFORE,
    after: `Q3 will focus on first-session onboarding — the biggest source of churn. A simplified first-run flow ships in mid-August, and all pricing changes are on hold until the experiment readout in early September.`,
  },
  bullets: {
    label: 'Bullet points',
    note: 'Dense notes → a scannable list',
    before: NOTES_BEFORE,
    after: `• Onboarding is the Q3 priority — most churn is first-session\n• Simplified first-run flow ships mid-August (import cut for v1)\n• Pricing changes on hold until the September experiment readout\n• Sam owns the experiment dashboard`,
  },
} as const

type Mode = keyof typeof SAMPLES

const FIX_WORDS = new Set([
  "They're", 'report', 'tomorrow.', "It's", 'process,', 'definitely', 'lot', 'quarter.',
])

interface WordToken {
  text: string
  isFix: boolean
  isBullet: boolean
  delay: number
}

type OutputLine = WordToken[] | null

const DONE_MSGS: Record<Mode, string> = {
  rewrite: 'Done — clear, confident, on-tone.',
  proofread: 'Done — every fix applied.',
  summarize: 'Done — the gist, in two lines.',
  bullets: 'Done — ready to skim.',
}

function buildOutput(mode: Mode): OutputLine[] {
  const rawLines = SAMPLES[mode].after.split('\n')
  let idx = 0
  return rawLines.map((line) => {
    if (line === '') return null
    return line.split(' ').map((w) => ({
      text: w,
      isFix: mode === 'proofread' && FIX_WORDS.has(w),
      isBullet: w === '•',
      delay: (idx++) * 15,
    }))
  })
}

export default function Demo() {
  const [mode, setMode] = useState<Mode>('rewrite')
  const [status, setStatus] = useState<'ready' | 'thinking' | 'done'>('ready')
  const [doneMsg, setDoneMsg] = useState('')
  const [outputLines, setOutputLines] = useState<OutputLine[]>([])
  const [revealed, setRevealed] = useState(false)

  const modeRef = useRef<Mode>('rewrite')
  const runSeqRef = useRef(0)
  const thinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sourceRef = useRef<HTMLDivElement>(null)

  const doRun = useCallback(() => {
    const currentMode = modeRef.current
    const my = ++runSeqRef.current
    if (thinkTimerRef.current) clearTimeout(thinkTimerRef.current)
    setStatus('thinking')
    setRevealed(false)
    setOutputLines([])

    thinkTimerRef.current = setTimeout(() => {
      if (my !== runSeqRef.current) return
      const lines = buildOutput(currentMode)
      setOutputLines(lines)
      setDoneMsg(DONE_MSGS[currentMode])
      setStatus('done')
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (my === runSeqRef.current) setRevealed(true)
        })
      )
    }, 620)
  }, [])

  function selectMode(m: Mode) {
    modeRef.current = m
    setMode(m)
    setStatus('ready')
    setRevealed(false)
    setOutputLines([])
  }

  useEffect(() => {
    if (sourceRef.current) sourceRef.current.textContent = SAMPLES[mode].before
  }, [mode])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        doRun()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [doRun])

  return (
    <div className="proof">
      <div className="proof-head">
        <span className="lbl">Live proof</span>
        <div className="modes">
          {(Object.keys(SAMPLES) as Mode[]).map((m) => (
            <button
              key={m}
              aria-pressed={mode === m}
              onClick={() => {
                selectMode(m)
                doRun()
              }}
            >
              {SAMPLES[m].label}
            </button>
          ))}
        </div>
      </div>

      <div className="proof-body">
        <div className="proof-note">{SAMPLES[mode].note}</div>
        <span className="field-label">Your draft</span>
        <div
          ref={sourceRef}
          className="source"
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
        />
        <div className="rule">
          <span>reWrite</span>
        </div>
        <span className="field-label">Result</span>
        <div className={`output${revealed ? ' rw-revealed' : ''}`}>
          {outputLines.map((line, li) =>
            line === null ? (
              <br key={li} />
            ) : (
              <span key={li}>
                {line.map((word, wi) => (
                  <span key={wi}>
                    <span
                      className={[
                        'rw-w',
                        word.isFix ? 'rw-fix' : '',
                        word.isBullet ? 'rw-bullet' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={{ transitionDelay: `${word.delay}ms` }}
                    >
                      {word.text}
                    </span>
                    {wi < line.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </span>
            )
          )}
        </div>
      </div>

      <div className="proof-foot">
        <div className="proof-foot-status">
          {status === 'thinking' ? (
            <span>
              Rewriting your draft
              <span className="rw-caret" />
            </span>
          ) : status === 'done' ? (
            <span>{doneMsg}</span>
          ) : (
            <span>Press ⌘⏎ to rewrite</span>
          )}
        </div>
        <button className="run" onClick={doRun}>
          Rewrite <span className="k">⌘⏎</span>
        </button>
      </div>
    </div>
  )
}
