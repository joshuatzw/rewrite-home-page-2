'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { Dictionary } from '@/dictionaries'
import type { Locale } from '@/dictionaries/locales'

/* One fixed draft, four predetermined refinements per locale. The draft
   text is intentionally rendered in a non-editable node so the demo can't
   be abused as a free rewrite box — the user highlights, picks a skill, and
   watches a canned result play out. Each locale's draft/output pair is
   authored natively (not translated word-for-word from English) so the
   planted typos and their fixes actually make sense in that language — see
   the report in the accompanying task for the specific errors planted and
   corrected in each locale. */
const SKILL_KEYS = ['proofread', 'polish', 'summarise', 'enhance'] as const
type SkillKey = (typeof SKILL_KEYS)[number]

type Status = 'idle' | 'thinking' | 'done'

interface Bubble {
  x: number
  y: number
}

// Per-unit stagger, tuned so the whole reveal takes roughly the same wall-clock
// time in every locale. The unit counts differ enormously: the longest English
// output is ~41 space-delimited words, Thai ~76 segmented words, and Chinese
// ~130 characters (per-character granularity — see buildWords). At a flat 14ms
// the Chinese reveal ran ~1.8s against English's ~0.57s, which read as the demo
// lagging rather than as a deliberate effect. These steps land all three near
// 0.6s. Re-check these if the demo copy changes length substantially.
const WORD_DELAY_STEP: Record<Locale, number> = { en: 14, th: 8, zh: 5 }

/** One renderable chunk of an output line. `delay === null` means "render
 *  literally, no fade-in" (whitespace, or punctuation riding along with the
 *  word it's attached to); otherwise it's wrapped in `.rw-w` and fades in at
 *  `delay`ms. */
interface LinePart {
  text: string
  delay: number | null
}

const WHITESPACE_RE = /^\s+$/
const WORDLIKE_CHAR_RE = /[\p{L}\p{N}]/u

// Original Latin behaviour, byte-for-byte: split on single spaces, stagger
// each word, and re-insert a literal (unwrapped, non-fading) space between
// them. Kept as its own function so English's animation can never regress
// even as the segmentation logic for other scripts evolves.
//
// `nextIdx` is threaded in (rather than a local counter) so the delay ramp
// keeps incrementing across a `\n\n`-separated multi-line "polish" output
// exactly like the original `buildWords` did — the original declared `idx`
// once, outside its per-line loop, so line 2 continued the ramp where line 1
// left off instead of restarting at 0.
function segmentBySpace(line: string, nextIdx: () => number, step: number): LinePart[] {
  const words = line.split(' ')
  const parts: LinePart[] = []
  words.forEach((w, i) => {
    parts.push({ text: w, delay: nextIdx() * step })
    if (i < words.length - 1) parts.push({ text: ' ', delay: null })
  })
  return parts
}

// Thai and Chinese don't space-delimit words, so `split(' ')` collapses the
// whole line into a single token and the staged reveal either flashes at
// once (Chinese) or reveals in a handful of clause-sized chunks (Thai).
// `Intl.Segmenter` does real word-breaking for both scripts. Whitespace
// segments are rendered literally (no delay slot, so they can't stutter the
// ramp). Punctuation segments piggyback on the delay of the word they
// follow, rather than claiming their own slot, so a run of short clauses
// with lots of commas doesn't visibly stutter either.
function segmentWithIntl(
  line: string,
  intlLocale: string,
  granularity: 'word' | 'grapheme',
  nextIdx: () => number,
  step: number
): LinePart[] {
  const segmenter = new Intl.Segmenter(intlLocale, { granularity })
  const parts: LinePart[] = []
  let lastDelay = 0
  for (const seg of segmenter.segment(line)) {
    const text = seg.segment
    if (WHITESPACE_RE.test(text)) {
      parts.push({ text, delay: null })
      continue
    }
    const isWordLike =
      granularity === 'word' ? seg.isWordLike === true : WORDLIKE_CHAR_RE.test(text)
    if (isWordLike) {
      lastDelay = nextIdx() * step
      parts.push({ text, delay: lastDelay })
    } else {
      parts.push({ text, delay: lastDelay })
    }
  }
  return parts
}

// Map our locale codes to Intl.Segmenter-compatible BCP-47 tags.
const INTL_LOCALE: Record<Locale, string> = { en: 'en', th: 'th', zh: 'zh-Hans' }

function buildWords(after: string, locale: Locale) {
  const lines = after.split('\n')
  const hasSegmenter =
    typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
  const useIntl = locale !== 'en' && hasSegmenter

  // English keeps the exact original space-split behaviour. Chinese is
  // segmented per-character (grapheme) rather than per-word: dictionary word
  // segmentation for Chinese is often just 1-3 characters anyway, and a
  // character-by-character cascade reads as the more natural "typing" effect
  // for CJK than word-sized jumps (it's also the pattern users already
  // recognise from streaming chat UIs). Thai is segmented per-word, which is
  // exactly the granularity needed to fix the "reveals in a few large
  // chunks" problem described for clause-only spacing.
  const granularity: 'word' | 'grapheme' = locale === 'zh' ? 'grapheme' : 'word'

  const step = WORD_DELAY_STEP[locale]

  // One counter shared across every line of this output — see the note on
  // `segmentBySpace` for why this can't be reset per line.
  let idx = 0
  const nextIdx = () => idx++

  return lines.map((line): LinePart[] | null => {
    if (line === '') return null
    if (!useIntl) return segmentBySpace(line, nextIdx, step)
    try {
      return segmentWithIntl(line, INTL_LOCALE[locale], granularity, nextIdx, step)
    } catch {
      return segmentBySpace(line, nextIdx, step)
    }
  })
}

export default function HowItWorks({
  dict,
  lang,
}: {
  dict: Dictionary['howItWorks']
  lang: Locale
}) {
  const [bubble, setBubble] = useState<Bubble | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [active, setActive] = useState<SkillKey | null>(null)
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

  function applySkill(key: SkillKey) {
    window.getSelection()?.removeAllRanges()
    clearBubble()
    setActive(key)
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

  const activeSkill = active ? dict.skills[active] : null
  const outputLines = activeSkill ? buildWords(activeSkill.after, lang) : []

  return (
    <div className="hiw proof">
      <div className="proof-head hiw-head">
        <span className="lbl">{dict.label}</span>
        <ol className="hiw-steps">
          {dict.steps.map((step, i) => (
            <li key={step}><b>{i + 1}</b> {step}</li>
          ))}
        </ol>
      </div>

      <div className="proof-body">
        <div className="hiw-prompt">
          {status === 'idle' ? (
            dict.promptIdle
          ) : (
            <>{dict.promptAppliedBefore}<b>{activeSkill?.label}</b>{dict.promptAppliedAfter}</>
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
              {dict.draft}
            </div>
          ) : (
            <div
              className={`hiw-draft hiw-output${revealed ? ' rw-revealed' : ''}`}
              aria-live="polite"
            >
              {status === 'thinking' ? (
                <span className="hiw-thinking">
                  {dict.thinking}<span className="rw-caret" />
                </span>
              ) : (
                outputLines.map((line, li) =>
                  line === null ? (
                    <br key={li} />
                  ) : (
                    <span key={li}>
                      {line.map((part, pi) =>
                        part.delay === null ? (
                          <span key={pi}>{part.text}</span>
                        ) : (
                          <span
                            key={pi}
                            className="rw-w"
                            style={{ transitionDelay: `${part.delay}ms` }}
                          >
                            {part.text}
                          </span>
                        )
                      )}
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
                aria-label={dict.ariaRewrite}
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
                  <div className="hiw-menu-label">{dict.chooseSkill}</div>
                  {SKILL_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      role="menuitem"
                      className="hiw-menu-item"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applySkill(key)}
                    >
                      {dict.skills[key].label}
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
            ? dict.statusIdle
            : status === 'thinking'
              ? dict.statusThinking
              : dict.statusDone}
        </div>
        <button
          type="button"
          className="run hiw-reset"
          onClick={reset}
          disabled={status === 'idle'}
        >
          {dict.reset}
        </button>
      </div>
    </div>
  )
}
