'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ScriptureCard from '@/components/ScriptureCard'
import { loadResults } from '@/lib/storage'
import type { AllResults } from '@/lib/data'
import { TEST_META } from '@/lib/data'

const OPENING_PRAYER = `Father, I come to You before I begin.\n\nI believe that You formed me with intention — that my strengths, my wiring, and the way I love are not accidents. They are gifts, carefully placed, waiting to be understood and offered.\n\nLet this be more than a test. Let it be an act of stewardship.\nLet what I discover here lead me closer to the work You designed me for, and closer to the people I was made to love.\n\nIn Your name — Amen.`

const TEST_CARDS = [
  {
    id: 'talent' as const,
    name: 'Talent Profile',
    subtitle: 'Your dominant gifts',
    icon: '⚡',
    color: '#C9A84C',
    dim: '#C9A84C18',
    desc: 'Discover the 5 natural talents that define how you think, act, and contribute — and what kind of work will make you come alive.',
    questions: 34,
    minutes: 8,
  },
  {
    id: 'ocean' as const,
    name: 'Personality Profile',
    subtitle: 'How you\'re wired',
    icon: '🌊',
    color: '#7C9EF8',
    dim: '#7C9EF818',
    desc: 'Explore the five dimensions of your personality using the most scientifically validated model in psychology — the IPIP-50.',
    questions: 50,
    minutes: 10,
  },
  {
    id: 'connect' as const,
    name: 'Connection Style',
    subtitle: 'How you give & receive love',
    icon: '💛',
    color: '#F4845F',
    dim: '#F4845F18',
    desc: 'Understand the primary ways you express care and the ways you feel most loved — essential for every relationship in your life.',
    questions: 30,
    minutes: 6,
  },
]

export default function HomePage() {
  const [results, setResults] = useState<AllResults>({})
  const [showPrayer, setShowPrayer] = useState(false)
  const [prayerDone, setPrayerDone] = useState(false)

  useEffect(() => {
    setResults(loadResults())
    const done = localStorage.getItem('discovery_opening_prayer')
    if (done) setPrayerDone(true)
  }, [])

  function handlePrayerAmen() {
    localStorage.setItem('discovery_opening_prayer', 'true')
    setPrayerDone(true)
    setShowPrayer(false)
  }

  const completedCount = Object.keys(results).filter(k =>
    ['talent','ocean','connect'].includes(k) && results[k as keyof AllResults]
  ).length

  return (
    <main className="min-h-screen bg-background grain">
      {/* ── Opening Prayer Modal ── */}
      {showPrayer && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center px-5">
          <div className="w-full max-w-md animate-scale-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-gold/30 text-gold text-lg mb-4">✝</div>
              <p className="text-xs tracking-[0.4em] text-muted uppercase mb-1">Before you begin</p>
              <h2 className="font-display text-2xl text-text">A prayer for clarity</h2>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 mb-5">
              <p className="prayer-text text-text/85 text-[15px] whitespace-pre-line">{OPENING_PRAYER}</p>
            </div>
            <button
              onClick={handlePrayerAmen}
              className="w-full py-4 rounded-xl bg-gold text-background font-sans font-bold text-sm tracking-wide hover:bg-gold-light transition-colors"
            >
              Amen — take me to the tests
            </button>
            <button
              onClick={() => setShowPrayer(false)}
              className="w-full text-center text-xs text-muted mt-3 py-2"
            >
              Skip prayer
            </button>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="px-5 pt-16 pb-8 text-center max-w-lg mx-auto">
        <h1 className="font-display text-[42px] leading-[1.1] text-text mb-4">
          Know Yourself.<br />
          <span className="text-gold italic">Know Your Calling.</span>
        </h1>

        <p className="text-subtle text-base leading-relaxed mb-8 max-w-sm mx-auto">
          Three research-based assessments to help you discover your God-given talents, personality, and connection style — and find the work you were made for.
        </p>

        {!prayerDone && (
          <button
            onClick={() => setShowPrayer(true)}
            className="inline-flex items-center gap-2 border border-gold/40 text-gold rounded-xl px-6 py-3 text-sm font-sans hover:bg-gold/5 transition-colors mb-4"
          >
            ✝ Open with prayer
          </button>
        )}

        <ScriptureCard
          verse="For I know the plans I have for you, declares the Lord — plans to prosper you and not to harm you, plans to give you hope and a future."
          reference="Jeremiah 29:11"
        />
      </section>

      {/* ── Free Notice (1st of 2) ── */}
      <section className="px-5 pb-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3 bg-green/5 border border-green/20 rounded-xl px-4 py-3.5">
          <span className="text-green text-lg">✓</span>
          <p className="text-sm text-subtle">
            Start free. Full results unlock with a one-time $19.99 payment per test.
          </p>
        </div>
      </section>

      {/* ── The Why ── */}
      <section className="px-5 py-10 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <p className="text-[10px] tracking-[0.4em] text-muted uppercase mb-2">Why this exists</p>
          <h2 className="font-display text-3xl text-text">You weren't made by accident.</h2>
        </div>

        <div className="space-y-5">
          {[
            { icon: '📖', title: 'Self-knowledge is stewardship', body: 'Understanding how you were made isn\'t vanity — it\'s faithfulness. When you know your gifts, you can offer them more fully.' },
            { icon: '🎯', title: 'Calling requires clarity', body: 'You can\'t find the right work, the right team, or the right community without understanding who you actually are — not who you\'re trying to be.' },
            { icon: '🌱', title: 'You were made on purpose', body: 'Psalm 139 says you are fearfully and wonderfully made. These assessments are one way to sit with that truth and let it become practical.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-sans font-semibold text-text text-sm mb-1">{item.title}</h3>
                <p className="text-sm text-subtle leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Scripture 2 ── */}
      <ScriptureCard
        verse="I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well."
        reference="Psalm 139:14"
        className="max-w-lg mx-auto"
      />

      {/* ── Test Cards ── */}
      <section className="px-5 py-8 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <p className="text-[10px] tracking-[0.4em] text-muted uppercase mb-2">The assessments</p>
          <h2 className="font-display text-3xl text-text">Three lenses. One picture.</h2>
          {completedCount > 0 && (
            <p className="text-sm text-muted mt-2">{completedCount}/3 complete</p>
          )}
        </div>

        <div className="space-y-4">
          {TEST_CARDS.map(card => {
            const isDone = !!results[card.id]
            return (
              <Link
                key={card.id}
                href={isDone ? `/results/${card.id}` : `/tests/${card.id}`}
                className="block card-hover"
              >
                <div
                  className="rounded-2xl border p-5 transition-colors"
                  style={{
                    background: isDone ? card.dim : 'var(--tw-bg-opacity,#161616)',
                    backgroundColor: isDone ? card.dim : '#161616',
                    borderColor: isDone ? card.color + '55' : '#222222',
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: card.color + '18' }}
                    >
                      {isDone ? '✓' : card.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-sans font-semibold text-text text-sm">{card.name}</h3>
                        {isDone
                          ? <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ color: card.color, background: card.color + '18' }}>Done</span>
                          : <span className="text-[10px] text-muted">{card.minutes} min</span>
                        }
                      </div>
                      <p className="text-xs font-semibold mb-1.5" style={{ color: card.color }}>{card.subtitle}</p>
                      <p className="text-xs text-subtle leading-relaxed">{card.desc}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[10px] text-muted">{card.questions} questions</span>
                        <span className="text-[10px] text-muted">·</span>
                        <span className="text-[10px] text-green font-semibold">Start free</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center justify-between">
                    <span className="text-xs text-muted">
                      {isDone ? 'View your results' : 'Begin when ready'}
                    </span>
                    <span className="text-xs" style={{ color: card.color }}>
                      {isDone ? 'Results →' : 'Start →'}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Free Notice (2nd of 2) ── */}
      <section className="px-5 pb-8 max-w-lg mx-auto">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-[10px] tracking-[0.3em] text-muted uppercase mb-3">How it works</p>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Take any test — completely free, no account required.' },
              { step: '2', text: 'Your progress is saved automatically. Complete in one sitting for best results.' },
              { step: '3', text: 'At the end, unlock your full results report with a one-time $19.99 payment.' },
              { step: '4', text: 'Optionally receive a PDF via email to save, print, or share.' },
            ].map(item => (
              <div key={item.step} className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-gold/15 text-gold text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <p className="text-xs text-subtle leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted text-center">
              <span className="text-green font-semibold">Start free.</span> Results are a one-time $19.99 per test. No subscriptions. No accounts needed.
            </p>
          </div>
        </div>
      </section>

      {/* ── Full Profile teaser ── */}
      {completedCount >= 2 && (
        <section className="px-5 pb-8 max-w-lg mx-auto">
          <Link href="/profile" className="block card-hover">
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-[#1A1408] to-[#0E0E0E] p-5 text-center">
              <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-2">{completedCount}/3 Complete</p>
              <h3 className="font-display text-xl text-text mb-2">View Your Full Profile →</h3>
              <p className="text-xs text-subtle">Your talents, personality, and connection style — synthesized into one calling picture.</p>
            </div>
          </Link>
        </section>
      )}

      {/* ── Scripture 3 ── */}
      <ScriptureCard
        verse="For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do."
        reference="Ephesians 2:10"
        className="max-w-lg mx-auto"
      />

      {/* ── Footer ── */}
      <footer className="text-center px-5 py-10 text-[11px] text-muted space-y-1">
        <p>Discovery Suite © {new Date().getFullYear()}</p>
        <p>Taking all tests is always free. Results are a one-time charge.</p>
        <p className="text-[10px] opacity-50">Assessment content is original. IPIP-50 items are public domain (Lewis Goldberg).</p>
      </footer>
    </main>
  )
}
