'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ProgressBar from './ProgressBar'
import PrayerBlock from './PrayerBlock'
import { loadAnswers, saveAnswers, clearAnswers, saveTestResult } from '@/lib/storage'
import {
  TEST_META, TALENT_Q, OCEAN_ITEMS, CONNECT_Q,
  scoreTalent, scoreOcean, scoreConnect,
  type TestId,
} from '@/lib/data'

interface Props { testId: TestId }

export default function TestEngine({ testId }: Props) {
  const router = useRouter()
  const meta = TEST_META[testId]
  const [phase, setPhase] = useState<'intro'|'prayer'|'test'|'done'>('intro')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, unknown>>({})
  const [selected, setSelected] = useState<string|number|null>(null)

  // Load saved answers
  useEffect(() => {
    const saved = loadAnswers(testId)
    if (Object.keys(saved).length > 0) {
      setAnswers(saved)
      const lastAnswered = Math.max(...Object.keys(saved).map(Number))
      const total = getTotal()
      if (lastAnswered >= total - 1) {
        setPhase('test')
        setStep(total - 1)
      } else {
        setPhase('prayer')
        setStep(lastAnswered + 1)
      }
    }
  }, [testId])

  function getTotal(): number {
    if (testId === 'talent') return TALENT_Q.length
    if (testId === 'ocean') return OCEAN_ITEMS.length
    return CONNECT_Q.length
  }

  function getQuestion() {
    if (testId === 'talent') return TALENT_Q[step]
    if (testId === 'ocean') return OCEAN_ITEMS[step]
    return CONNECT_Q[step]
  }

  const total = getTotal()
  const pct = (step / total) * 100

  function handleAnswer(value: unknown) {
    setSelected(value as string|number)
    const next = { ...answers, [testId === 'ocean' ? (getQuestion() as typeof OCEAN_ITEMS[0]).id : step]: value }
    setAnswers(next)
    saveAnswers(testId, next)

    setTimeout(() => {
      setSelected(null)
      if (step + 1 >= total) {
        finishTest(next)
      } else {
        setStep(s => s + 1)
      }
    }, 200)
  }

  function finishTest(finalAnswers: Record<number, unknown>) {
    let result: unknown
    if (testId === 'talent') result = scoreTalent(finalAnswers as Record<number, 'a'|'b'>)
    else if (testId === 'ocean') result = scoreOcean(finalAnswers as Record<number, number>)
    else result = scoreConnect(finalAnswers as Record<number, 'a'|'b'>)

    saveTestResult(testId, result)
    clearAnswers(testId)
    router.push(`/results/${testId}`)
  }

  // ── Intro ──
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-background flex flex-col px-5 py-12 max-w-lg mx-auto">
        <button
          onClick={() => router.push('/')}
          className="text-muted text-sm font-sans mb-8 text-left hover:text-subtle transition-colors"
        >
          ← Home
        </button>

        <div className="flex-1">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
            style={{ background: meta.color + '18' }}
          >
            {meta.icon}
          </div>

          <p className="text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: meta.color }}>
            Assessment
          </p>
          <h1 className="font-display text-3xl text-text mb-2">{meta.name}</h1>
          <p className="text-subtle text-sm mb-6">{meta.subtitle}</p>

          {/* Time & tips */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-5">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
              <div className="text-center">
                <p className="font-display text-2xl text-text">{meta.questionCount}</p>
                <p className="text-[10px] text-muted uppercase tracking-widest">Questions</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="font-display text-2xl text-text">{meta.estimatedMinutes}</p>
                <p className="text-[10px] text-muted uppercase tracking-widest">Minutes</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="font-display text-2xl text-green">Free</p>
                <p className="text-[10px] text-muted uppercase tracking-widest">To take</p>
              </div>
            </div>

            <p className="text-[10px] tracking-[0.3em] text-muted uppercase mb-3">Before you begin</p>
            <div className="space-y-2.5">
              {[
                '⏱ We recommend completing this in one sitting for best accuracy.',
                '📱 Your progress is saved automatically — safe to pause if needed.',
                '🧠 Answer with your first instinct — don\'t overthink.',
                meta.id === 'ocean'
                  ? '⚖️ Rate 1–5: 1 = Not me at all, 5 = Very much me.'
                  : '⚡ Choose the statement that feels more naturally like you.',
              ].map(tip => (
                <p key={tip} className="text-xs text-subtle leading-relaxed">{tip}</p>
              ))}
            </div>
          </div>

          <p className="text-xs text-subtle italic leading-relaxed mb-6">{meta.intro}</p>

          <div className="bg-card border border-border rounded-2xl p-5 mb-6">
            <p className="text-xs text-subtle">
              This assessment is a tool for clarity, not a verdict. Bring the results before God, and let Him confirm what is true.
            </p>
          </div>
        </div>

        <button
          onClick={() => setPhase('prayer')}
          className="w-full py-4 rounded-xl font-sans font-bold text-sm tracking-wide text-background transition-colors"
          style={{ background: meta.color }}
        >
          Begin with prayer →
        </button>
      </div>
    )
  }

  // ── Prayer ──
  if (phase === 'prayer') {
    return (
      <PrayerBlock
        prayer={meta.prayer}
        onContinue={() => setPhase('test')}
        continueLabel={`Begin ${meta.name} →`}
      />
    )
  }

  // ── Test ──
  const q = getQuestion()

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Top bar */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.push('/')}
            className="text-muted text-xs font-sans hover:text-subtle transition-colors"
          >
            ← Save & exit
          </button>
          <span className="text-xs text-muted font-sans">{step + 1} / {total}</span>
        </div>
        <ProgressBar current={step + 1} total={total} color={meta.color} />
      </div>

      {/* Question */}
      <div className="flex-1 px-5 pt-4 pb-6">
        {testId === 'ocean' ? (
          // OCEAN: Likert scale
          <OceanQuestion
            item={q as typeof OCEAN_ITEMS[0]}
            color={meta.color}
            selected={selected as number|null}
            onAnswer={handleAnswer}
          />
        ) : (
          // Talent & Connect: A/B forced choice
          <ABQuestion
            question={q as typeof TALENT_Q[0]}
            color={meta.color}
            selected={selected as string|null}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      {/* Encouragement at intervals */}
      {step > 0 && step % 10 === 0 && (
        <div className="px-5 pb-4">
          <p className="text-center text-xs text-muted italic font-display">
            {step < total * 0.5
              ? 'You\'re doing great. Stay honest.'
              : step < total * 0.8
              ? 'More than halfway there. Keep going.'
              : 'Almost done — this is where it gets good.'}
          </p>
        </div>
      )}
    </div>
  )
}

// ── A/B Question ──────────────────────────────────────────────────────────────

interface ABProps {
  question: { a: string; b: string }
  color: string
  selected: string | null
  onAnswer: (v: 'a' | 'b') => void
}

function ABQuestion({ question, color, selected, onAnswer }: ABProps) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.4em] text-muted uppercase mb-5">Which feels more like you?</p>
      <div className="space-y-3">
        {(['a', 'b'] as const).map((choice, index) => {
          const isSelected = selected === choice
          return (
            <div key={choice}>
              <button
                onClick={() => onAnswer(choice)}
                className="w-full text-left rounded-2xl border p-4 choice-btn transition-all"
                style={{
                  background: isSelected ? color + '15' : '#161616',
                  borderColor: isSelected ? color + '88' : '#222222',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5"
                    style={{ background: color + '22', color }}
                  >
                    {choice.toUpperCase()}
                  </div>
                  <p className="text-[14px] text-text/90 leading-[1.6]">{question[choice]}</p>
                </div>
              </button>
              {index === 0 && (
                <div className="flex items-center gap-3 py-4" aria-hidden="true">
                  <div className="h-px flex-1 bg-border" />
                  <p className="text-center text-[10px] text-muted tracking-[0.3em] uppercase">or</p>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── OCEAN Likert Question ─────────────────────────────────────────────────────

interface OceanProps {
  item: { text: string; t: string }
  color: string
  selected: number | null
  onAnswer: (v: number) => void
}

function OceanQuestion({ item, color, selected, onAnswer }: OceanProps) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.4em] text-muted uppercase mb-6">How much does this describe you?</p>
      <div className="bg-card border border-border rounded-2xl p-5 mb-8">
        <p className="font-display text-[18px] italic text-text/90 leading-relaxed text-center">
          "{item.text}"
        </p>
      </div>

      <div className="flex justify-between gap-2 items-end">
        {[1,2,3,4,5].map(v => {
          const isSelected = selected === v
          const size = 32 + v * 6
          const opacity = 0.2 + (v / 5) * 0.8
          return (
            <button
              key={v}
              onClick={() => onAnswer(v)}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <div
                className="scale-dot rounded-full flex items-center justify-center font-bold text-background transition-transform"
                style={{
                  width: size,
                  height: size,
                  background: color,
                  opacity: isSelected ? 1 : opacity,
                  boxShadow: isSelected ? `0 0 0 3px ${color}44` : 'none',
                  fontSize: 12 + v,
                }}
              >
                {v}
              </div>
              <span className="text-[9px] text-muted text-center leading-tight">
                {v === 1 ? 'Not\nme' : v === 3 ? 'Neutral' : v === 5 ? 'Very\nme' : ''}
              </span>
            </button>
          )
        })}
      </div>
      <div className="flex justify-between px-1 mt-1">
        <span className="text-[9px] text-muted">Disagree</span>
        <span className="text-[9px] text-muted">Agree</span>
      </div>
    </div>
  )
}
