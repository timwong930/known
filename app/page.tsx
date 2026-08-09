'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { loadResults } from '@/lib/storage'
import type { AllResults } from '@/lib/data'

const ASSESSMENTS = [
  {
    id: 'talent' as const,
    eyebrow: 'Gifts',
    name: 'Talent Profile',
    icon: '✦',
    color: '#D6B766',
    description: 'Notice the strengths and recurring patterns that tend to energize your work, service, and contribution.',
    questions: 34,
    minutes: 8,
  },
  {
    id: 'ocean' as const,
    eyebrow: 'Temperament',
    name: 'Personality Profile',
    icon: '◌',
    color: '#8DA7E8',
    description: 'Explore the tendencies that shape how you think, respond, decide, and move through the world.',
    questions: 50,
    minutes: 10,
  },
  {
    id: 'connect' as const,
    eyebrow: 'Relationships',
    name: 'Connection Style',
    icon: '♡',
    color: '#D98D72',
    description: 'Understand how you naturally give, receive, and recognize care in the relationships that matter most.',
    questions: 30,
    minutes: 6,
  },
]

export default function HomePage() {
  const [results, setResults] = useState<AllResults>({})

  useEffect(() => {
    setResults(loadResults())
  }, [])

  const completedCount = ASSESSMENTS.filter(item => !!results[item.id]).length

  return (
    <main className="min-h-screen bg-background grain overflow-hidden">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between relative z-10">
        <Link href="/" className="font-display text-2xl tracking-tight text-text">Known.</Link>
        <a href="#assessments" className="text-xs text-subtle hover:text-text transition-colors">
          {completedCount ? `${completedCount}/3 completed` : 'Explore assessments'}
        </a>
      </nav>

      <section className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20">
        <div className="absolute -top-20 right-[-170px] w-[420px] h-[420px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-light bg-card/70 px-3 py-1.5 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-subtle">Christian self-discovery for discernment</span>
          </div>

          <h1 className="font-display text-[52px] sm:text-[76px] leading-[0.97] tracking-[-0.035em] text-text max-w-3xl">
            You are more than a label.
            <span className="block italic text-gold mt-2">Become better known.</span>
          </h1>

          <p className="mt-7 text-base sm:text-lg leading-relaxed text-subtle max-w-xl">
            Known helps you notice patterns in your gifts, temperament, and relationships — then gives you language to bring those patterns into prayer, wise counsel, and real-life discernment.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:items-center">
            <a href="#assessments" className="inline-flex justify-center items-center rounded-xl bg-gold px-6 py-3.5 text-sm font-semibold text-background hover:bg-gold-light transition-colors">
              Start discovering yourself
            </a>
            <p className="text-xs text-muted sm:pl-2">No account needed to begin · About 24 minutes for all three</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/35">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid md:grid-cols-3 gap-8">
          {[
            ['01', 'Notice', 'See recurring patterns without forcing yourself into a box.'],
            ['02', 'Reflect', 'Ask better questions about where those patterns show up in your life.'],
            ['03', 'Discern', 'Bring what resonates before God, trusted people, and lived experience.'],
          ].map(([number, title, body]) => (
            <div key={number} className="flex gap-4">
              <span className="font-display text-gold text-xl">{number}</span>
              <div>
                <h2 className="font-medium text-text text-sm mb-1.5">{title}</h2>
                <p className="text-sm text-subtle leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="assessments" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24">
        <div className="max-w-2xl mb-10">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-3">Three lenses</p>
          <h2 className="font-display text-4xl sm:text-5xl text-text leading-tight">A clearer picture of how you show up.</h2>
          <p className="text-sm sm:text-base text-subtle mt-4 leading-relaxed max-w-xl">
            Each assessment looks at a different dimension of your life. None of them tells you who you are. Together, they can help you notice what deserves more attention.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {ASSESSMENTS.map((assessment) => {
            const done = !!results[assessment.id]
            return (
              <Link
                key={assessment.id}
                href={done ? `/results/${assessment.id}` : `/tests/${assessment.id}`}
                className="group rounded-2xl border border-border bg-card p-5 sm:p-6 hover:border-border-light transition-all card-hover"
              >
                <div className="flex items-center justify-between mb-10">
                  <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: assessment.color }}>{assessment.eyebrow}</span>
                  <span className="text-sm" style={{ color: assessment.color }}>{done ? '✓' : assessment.icon}</span>
                </div>
                <h3 className="font-display text-2xl text-text mb-3">{assessment.name}</h3>
                <p className="text-sm leading-relaxed text-subtle min-h-[84px]">{assessment.description}</p>
                <div className="mt-7 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted">{assessment.questions} questions · {assessment.minutes} min</span>
                  <span className="text-xs group-hover:translate-x-1 transition-transform" style={{ color: assessment.color }}>
                    {done ? 'View →' : 'Begin →'}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20 sm:pb-24">
        <div className="rounded-3xl border border-gold/20 bg-gradient-to-br from-[#17130A] via-[#10100E] to-[#0B0B0A] p-7 sm:p-10 grid md:grid-cols-[1.2fr_.8fr] gap-10 items-center">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-3">The Known Profile</p>
            <h2 className="font-display text-3xl sm:text-4xl text-text leading-tight">The interesting part is where the patterns overlap.</h2>
            <p className="text-sm text-subtle leading-relaxed mt-4 max-w-xl">
              Complete all three assessments to bring your gifts, personality, and connection style into one view. Known v2 is being built around this combined profile — a practical reflection tool for calling, work, relationships, and growth.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background/50 p-5">
            {['Strength patterns', 'Temperament signals', 'Relationship tendencies', 'Calling reflection prompts'].map((item, index) => (
              <div key={item} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                <span className="text-[10px] text-gold">0{index + 1}</span>
                <span className="text-sm text-subtle">{item}</span>
              </div>
            ))}
            {completedCount >= 2 && (
              <Link href="/profile" className="mt-4 inline-flex text-xs text-gold hover:text-gold-light transition-colors">
                Open your combined profile →
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-24 text-center">
        <div className="w-8 h-px bg-gold/50 mx-auto mb-6" />
        <blockquote className="font-display italic text-2xl sm:text-3xl leading-relaxed text-text/90">
          “Search me, God, and know my heart; test me and know my anxious thoughts.”
        </blockquote>
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted mt-5">Psalm 139:23</p>
        <p className="text-xs text-muted leading-relaxed mt-8 max-w-xl mx-auto">
          Known is not spiritual direction, prophecy, or a substitute for prayer, Scripture, community, pastoral care, or professional guidance. Assessments are lenses — not verdicts.
        </p>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="font-display text-xl text-text">Known.</p>
          <p className="text-[11px] text-muted">Know yourself more clearly. Hold the results with open hands.</p>
        </div>
      </footer>
    </main>
  )
}
