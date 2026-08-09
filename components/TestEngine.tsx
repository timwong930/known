'use client'

import { useState, useEffect } from 'react'
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

  function handleAnswer(value: unknown) {
    setSelected(value as string|number)
    const key = testId === 'ocean' ? (getQuestion() as typeof OCEAN_ITEMS[0]).id : step
    const next = { ...answers, [key]: value }
    setAnswers(next)
    saveAnswers(testId, next)

    setTimeout(() => {
      setSelected(null)
      if (step + 1 >= total) finishTest(next)
      else setStep(s => s + 1)
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

  if (phase === 'intro') {
    return (
      <div className="mobile-screen bg-background flex flex-col px-4 sm:px-5 py-6 sm:py-12 max-w-lg mx-auto safe-top">
        <button
          onClick={() => router.push('/')}
          className="tap-target -ml-2 px-2 text-muted text-sm font-sans mb-5 sm:mb-8 text-left hover:text-subtle transition-colors"
        >
          ← Home
        </button>

        <div className="flex-1">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-5 sm:mb-6"
            style={{ background: meta.color + '18' }}
          >
            {meta.icon}
          </div>

          <p className="text-[10px] tracking-[0.32em] sm:tracking-[0.4em] uppercase mb-2" style={{ color: meta.color }}>
            Assessment
          </p>
          <h1 className="font-display text-[2rem] sm:text-3xl leading-tight text-text mb-2">{meta.name}</h1>
          <p className="text-subtle text-sm mb-5 sm:mb-6">{meta.subtitle}</p>

          <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-5">
            <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-border">
              <Stat value={meta.questionCount} label="Questions" />
              <Stat value={meta.estimatedMinutes} label="Minutes" bordered />
              <Stat value="Free" label="To take" accent bordered />
            </div>

            <p className="text-[10px] tracking-[0.25em] sm:tracking-[0.3em] text-muted uppercase mb-3">Before you begin</p>
            <div className="space-y-2.5">
              {[
                '⏱ Complete it in one sitting when you can.',
                '📱 Your progress saves automatically if you need to pause.',
                '🧠 Go with your first instinct instead of overthinking.',
                meta.id === 'ocean'
                  ? '⚖️ Rate 1–5: 1 = Not me at all, 5 = Very much me.'
                  : '⚡ Choose the statement that feels more naturally like you.',
              ].map(tip => (
                <p key={tip} className="text-xs text-subtle leading-relaxed">{tip}</p>
              ))}
            </div>
          </div>

          <p className="text-xs text-subtle italic leading-relaxed mb-5">{meta.intro}</p>

          <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-5">
            <p className="text-xs text-subtle leading-relaxed">
              This assessment is a tool for clarity, not a verdict. Bring the results before God, and let Him confirm what is true.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 -mx-4 sm:-mx-5 px-4 sm:px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background via-background to-transparent">
          <button
            onClick={() => setPhase('prayer')}
            className="w-full min-h-12 py-3.5 rounded-xl font-sans font-bold text-sm tracking-wide text-background transition-colors"
            style={{ background: meta.color }}
          >
            Begin with prayer →
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'prayer') {
    return (
      <PrayerBlock
        prayer={meta.prayer}
        onContinue={() => setPhase('test')}
        continueLabel={`Begin ${meta.name} →`}
      />
    )
  }

  const q = getQuestion()

  return (
    <div className="mobile-screen bg-background flex flex-col max-w-lg mx-auto">
      <div className="safe-top px-4 sm:px-5 pb-3 sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => router.push('/')}
            className="tap-target -ml-2 px-2 text-muted text-xs font-sans hover:text-subtle transition-colors"
          >
            ← Save & exit
          </button>
          <span className="text-xs text-muted font-sans tabular-nums">{step + 1} / {total}</span>
        </div>
        <ProgressBar current={step + 1} total={total} color={meta.color} />
      </div>

      <div className="flex-1 px-4 sm:px-5 pt-5 pb-8">
        {testId === 'ocean' ? (
          <OceanQuestion
            item={q as typeof OCEAN_ITEMS[0]}
            color={meta.color}
            selected={selected as number|null}
            onAnswer={handleAnswer}
          />
        ) : (
          <ABQuestion
            question={q as typeof TALENT_Q[0]}
            color={meta.color}
            selected={selected as string|null}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      {step > 0 && step % 10 === 0 && (
        <div className="px-4 sm:px-5 safe-bottom">
          <p className="text-center text-xs text-muted italic font-display">
            {step < total * 0.5
              ? 'You’re doing great. Stay honest.'
              : step < total * 0.8
              ? 'More than halfway there. Keep going.'
              : 'Almost done — this is where it gets good.'}
          </p>
        </div>
      )}
    </div>
  )
}

function Stat({ value, label, bordered, accent }: { value: string | number; label: string; bordered?: boolean; accent?: boolean }) {
  return (
    <div className={`text-center min-w-0 ${bordered ? 'border-l border-border' : ''}`}>
      <p className={`font-display text-xl sm:text-2xl ${accent ? 'text-green' : 'text-text'}`}>{value}</p>
      <p className="text-[9px] sm:text-[10px] text-muted uppercase tracking-[0.12em] sm:tracking-widest truncate">{label}</p>
    </div>
  )
}

interface ABProps {
  question: { a: string; b: string }
  color: string
  selected: string | null
  onAnswer: (v: 'a' | 'b') => void
}

function ABQuestion({ question, color, selected, onAnswer }: ABProps) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.3em] sm:tracking-[0.4em] text-muted uppercase mb-4 sm:mb-5">Which feels more like you?</p>
      <div className="space-y-2">
        {(['a', 'b'] as const).map((choice, index) => {
          const isSelected = selected === choice
          return (
            <div key={choice}>
              <button
                onClick={() => onAnswer(choice)}
                className="w-full text-left rounded-2xl border p-4 sm:p-5 choice-btn transition-all"
                style={{
                  background: isSelected ? color + '15' : '#161616',
                  borderColor: isSelected ? color + '88' : '#222222',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ background: color + '22', color }}
                  >
                    {choice.toUpperCase()}
                  </div>
                  <p className="text-[15px] text-text/90 leading-[1.55] pr-1">{question[choice]}</p>
                </div>
              </button>
              {index === 0 && (
                <div className="flex items-center gap-3 py-3" aria-hidden="true">
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

interface OceanProps {
  item: { text: string; t: string }
  color: string
  selected: number | null
  onAnswer: (v: number) => void
}

function OceanQuestion({ item, color, selected, onAnswer }: OceanProps) {
  const labels = ['Not me', 'Rarely', 'Neutral', 'Often', 'Very me']

  return (
    <div>
      <p className="text-[10px] tracking-[0.3em] sm:tracking-[0.4em] text-muted uppercase mb-5">How much does this describe you?</p>
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 mb-6">
        <p className="font-display text-xl sm:text-[22px] italic text-text/90 leading-relaxed text-center">
          “{item.text}”
        </p>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {[1,2,3,4,5].map(v => {
          const isSelected = selected === v
          return (
            <button
              key={v}
              onClick={() => onAnswer(v)}
              aria-label={`${v} — ${labels[v - 1]}`}
              className="min-w-0 min-h-[72px] rounded-xl flex flex-col items-center justify-center gap-1.5 px-0.5 transition-colors"
              style={{
                background: isSelected ? color + '18' : '#111111',
                border: `1px solid ${isSelected ? color + '88' : '#222222'}`,
              }}
            >
              <div
                className="scale-dot w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-background"
                style={{
                  background: color,
                  opacity: isSelected ? 1 : 0.48 + v * 0.09,
                  boxShadow: isSelected ? `0 0 0 3px ${color}33` : 'none',
                }}
              >
                {v}
              </div>
              <span className="text-[8px] sm:text-[9px] text-muted text-center leading-tight whitespace-nowrap">
                {labels[v - 1]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex justify-between px-1 mt-3">
        <span className="text-[9px] text-muted">Less like me</span>
        <span className="text-[9px] text-muted">More like me</span>
      </div>
    </div>
  )
}
