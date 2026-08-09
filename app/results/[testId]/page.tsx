'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { loadResults } from '@/lib/storage'
import {
  type AllResults,
  type TestId,
  CONNECT_STYLES,
  OCEAN_META,
  TALENT_DOMAINS,
  TALENT_THEMES,
  TEST_META,
  getOceanInterp,
  getTalentDomain,
} from '@/lib/data'

const VALID_TESTS: TestId[] = ['talent', 'ocean', 'connect']

function asScoreRecord(value: unknown): Record<string, number> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const entries = Object.entries(value as Record<string, unknown>)
    .filter((entry): entry is [string, number] => {
      const score = entry[1]
      return typeof score === 'number' && Number.isFinite(score)
    })

  if (!entries.length) return null
  return Object.fromEntries(entries)
}

export default function ResultsPage() {
  const params = useParams()
  const rawTestId = params?.testId
  const testId = (Array.isArray(rawTestId) ? rawTestId[0] : rawTestId) as TestId | undefined

  const [results, setResults] = useState<AllResults | null>(null)

  useEffect(() => {
    setResults(loadResults())
  }, [])

  if (!testId || !VALID_TESTS.includes(testId)) {
    return <ResultState title="We couldn't open these results" body="This results link is not valid." />
  }

  const meta = TEST_META[testId]

  if (!results) {
    return (
      <main className="min-h-[100dvh] bg-background flex items-center justify-center px-5">
        <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" aria-label="Loading results" />
      </main>
    )
  }

  const data = asScoreRecord(results[testId])

  if (!data) {
    return (
      <ResultState
        title="Your result wasn't saved correctly"
        body="Your answers finished, but the score data is missing or invalid. Please retake this assessment once more."
        href={`/tests/${testId}`}
        action="Retake assessment →"
      />
    )
  }

  return (
    <main className="min-h-[100dvh] bg-background">
      <div className="max-w-lg mx-auto px-4 sm:px-5 py-6 sm:py-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm text-muted hover:text-subtle mb-5"
        >
          ← Home
        </Link>

        <header className="mb-7">
          <p className="text-[10px] tracking-[0.32em] uppercase mb-2" style={{ color: meta.color }}>
            {meta.icon} {meta.name}
          </p>
          <h1 className="font-display text-[2.35rem] leading-[1.02] text-text mb-3">Your results</h1>
          <p className="text-sm leading-relaxed text-subtle">
            Use these patterns as a lens for reflection — not a verdict about who you are.
          </p>
        </header>

        {testId === 'talent' && <TalentResults data={data} />}
        {testId === 'ocean' && <OceanResults data={data} />}
        {testId === 'connect' && <ConnectResults data={data} />}

        <section className="mt-6 rounded-2xl border border-border bg-card p-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted mb-2">Hold it open-handed</p>
          <p className="text-sm leading-relaxed text-subtle">
            Notice what resonates, test it against lived experience, prayer, Scripture, and people who know you well.
          </p>
        </section>

        <OtherAssessments current={testId} results={results} />
      </div>
    </main>
  )
}

function ResultState({
  title,
  body,
  href = '/',
  action = 'Back to Known →',
}: {
  title: string
  body: string
  href?: string
  action?: string
}) {
  return (
    <main className="min-h-[100dvh] bg-background flex items-center justify-center px-5 text-center">
      <div className="max-w-sm">
        <div className="font-display text-4xl text-gold mb-4">Known.</div>
        <h1 className="font-display text-2xl text-text mb-3">{title}</h1>
        <p className="text-sm text-subtle leading-relaxed mb-6">{body}</p>
        <Link href={href} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gold px-6 text-sm font-bold text-background">
          {action}
        </Link>
      </div>
    </main>
  )
}

function TalentResults({ data }: { data: Record<string, number> }) {
  const ranked = Object.entries(data)
    .filter(([name]) => Boolean(TALENT_THEMES[name]))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  if (!ranked.length) {
    return <InlineIssue text="We couldn't match the saved Talent Profile score to the current assessment." />
  }

  const domainCounts = Object.keys(TALENT_DOMAINS)
    .map(domain => ({
      domain,
      count: ranked.filter(([name]) => getTalentDomain(name) === domain).length,
      color: TALENT_DOMAINS[domain].color,
    }))
    .filter(item => item.count > 0)

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">Your five strongest patterns from this assessment.</p>

      {ranked.map(([name, score], index) => {
        const theme = TALENT_THEMES[name]
        const domain = getTalentDomain(name)
        const color = TALENT_DOMAINS[domain]?.color || '#C9A84C'

        return (
          <section key={name} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] font-semibold mb-2" style={{ color }}>
                  #{index + 1} · {domain}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">{theme.icon}</span>
                  <h2 className="font-display text-2xl text-text">{name}</h2>
                </div>
              </div>
              <span className="text-xs text-muted whitespace-nowrap">{score} pts</span>
            </div>

            <p className="text-sm leading-relaxed text-subtle mb-4">{theme.desc}</p>
            <div className="border-t border-border pt-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted mb-1.5">Possible environments</p>
              <p className="text-xs leading-relaxed text-subtle">{theme.career}</p>
            </div>
          </section>
        )
      })}

      <section className="rounded-2xl border border-border bg-card p-5">
        <p className="text-[10px] uppercase tracking-[0.26em] text-muted mb-4">Where your top five cluster</p>
        <div className="space-y-3">
          {domainCounts.map(item => (
            <div key={item.domain} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 rounded-full flex-none" style={{ background: item.color }} />
                <span className="text-sm text-text">{item.domain}</span>
              </div>
              <span className="text-xs text-muted">{item.count} of top 5</span>
            </div>
          ))}
        </div>
      </section>

      <ReflectionCard prompts={[
        `Where do you already see your ${ranked[0][0]} pattern showing up?`,
        'Which of these five patterns feels most energizing rather than merely familiar?',
        'Who knows you well enough to confirm or challenge what this assessment surfaced?',
      ]} />
    </div>
  )
}

function OceanResults({ data }: { data: Record<string, number> }) {
  const traits = ['O', 'C', 'E', 'A', 'N'] as const

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">IPIP-50 Big Five scores, shown as percentages.</p>

      {traits.map(trait => {
        const meta = OCEAN_META[trait]
        const raw = data[trait]
        const pct = Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : 0
        const interp = getOceanInterp(trait, pct)

        return (
          <section key={trait} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg" aria-hidden="true">{meta.icon}</span>
                <h2 className="font-display text-xl text-text">{meta.name}</h2>
              </div>
              <span className="font-display text-2xl whitespace-nowrap" style={{ color: meta.color }}>{pct}%</span>
            </div>

            <div className="h-1.5 rounded-full bg-border overflow-hidden mb-4" aria-hidden="true">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: meta.color }} />
            </div>

            <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-[0.2em] mb-3" style={{ color: meta.color, background: `${meta.color}18` }}>
              {interp.label}
            </span>
            <p className="text-sm leading-relaxed text-subtle mb-4">{interp.desc}</p>
            <div className="border-t border-border pt-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted mb-1.5">Possible environments</p>
              <p className="text-xs leading-relaxed text-subtle">{interp.career}</p>
            </div>
          </section>
        )
      })}

      <ReflectionCard prompts={[
        'Which trait feels most obviously true in day-to-day life?',
        'Which score surprised you enough to investigate rather than immediately accept?',
        'How do two of your strongest tendencies interact when you are under pressure?',
      ]} />
    </div>
  )
}

function ConnectResults({ data }: { data: Record<string, number> }) {
  const ranked = Object.entries(data)
    .filter(([key, score]) => Boolean(CONNECT_STYLES[key]) && Number.isFinite(score))
    .sort((a, b) => b[1] - a[1])

  if (ranked.length < 2) {
    return <InlineIssue text="We couldn't match the saved Connection Style score to the current assessment." />
  }

  const [primaryEntry, secondaryEntry] = ranked
  const primary = CONNECT_STYLES[primaryEntry[0]]
  const secondary = CONNECT_STYLES[secondaryEntry[0]]
  const total = ranked.reduce((sum, [, score]) => sum + score, 0) || 1

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border p-5" style={{ borderColor: `${primary.color}55`, background: `${primary.color}08` }}>
        <p className="text-[10px] uppercase tracking-[0.26em] font-bold mb-3" style={{ color: primary.color }}>
          Primary · {primaryEntry[1]} pts
        </p>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl" aria-hidden="true">{primary.icon}</span>
          <h2 className="font-display text-2xl text-text">{primary.name}</h2>
        </div>
        <p className="text-sm leading-relaxed text-subtle mb-4">{primary.desc}</p>

        <div className="space-y-3">
          <div className="rounded-xl bg-background/50 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] mb-1.5" style={{ color: primary.color }}>How you tend to give</p>
            <p className="text-xs leading-relaxed text-subtle">{primary.give}</p>
          </div>
          <div className="rounded-xl bg-background/50 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] mb-1.5" style={{ color: primary.color }}>How you tend to receive</p>
            <p className="text-xs leading-relaxed text-subtle">{primary.receive}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <p className="text-[10px] uppercase tracking-[0.26em] font-bold mb-3" style={{ color: secondary.color }}>
          Secondary · {secondaryEntry[1]} pts
        </p>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl" aria-hidden="true">{secondary.icon}</span>
          <h2 className="font-display text-xl text-text">{secondary.name}</h2>
        </div>
        <p className="text-sm leading-relaxed text-subtle">{secondary.desc}</p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <p className="text-[10px] uppercase tracking-[0.26em] text-muted mb-4">All five styles</p>
        <div className="space-y-4">
          {ranked.map(([key, score]) => {
            const style = CONNECT_STYLES[key]
            const pct = Math.round((score / total) * 100)
            return (
              <div key={key}>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-xs text-text min-w-0">{style.icon} {style.name}</span>
                  <span className="text-xs font-semibold whitespace-nowrap" style={{ color: style.color }}>{score} pts</span>
                </div>
                <div className="h-1 rounded-full bg-border overflow-hidden" aria-hidden="true">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: style.color }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <ReflectionCard prompts={[
        `Where do you most clearly recognize your ${primary.name} pattern?`,
        'How might someone close to you experience care differently than you do?',
        'What is one relationship where this insight could improve communication this week?',
      ]} />
    </div>
  )
}

function ReflectionCard({ prompts }: { prompts: string[] }) {
  return (
    <section className="rounded-2xl border border-gold/20 bg-gradient-to-br from-[#1A1408] to-[#0E0E0E] p-5">
      <p className="text-[10px] uppercase tracking-[0.26em] text-gold mb-3">Reflection prompts</p>
      <div className="space-y-3">
        {prompts.map(prompt => (
          <p key={prompt} className="text-sm leading-relaxed text-subtle">· {prompt}</p>
        ))}
      </div>
    </section>
  )
}

function InlineIssue({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-coral/30 bg-card p-5">
      <p className="text-sm leading-relaxed text-subtle">{text}</p>
    </div>
  )
}

function OtherAssessments({ current, results }: { current: TestId; results: AllResults }) {
  return (
    <section className="mt-7">
      <p className="text-[10px] uppercase tracking-[0.26em] text-muted mb-3">Continue your Known profile</p>
      <div className="space-y-2">
        {VALID_TESTS.filter(id => id !== current).map(id => {
          const meta = TEST_META[id]
          const done = Boolean(results[id])
          return (
            <Link
              key={id}
              href={done ? `/results/${id}` : `/tests/${id}`}
              className="min-h-16 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <span className="text-xl" aria-hidden="true">{meta.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text">{meta.name}</p>
                <p className="text-xs text-muted">{done ? 'View saved results' : `${meta.estimatedMinutes} min · Start`}</p>
              </div>
              <span className="text-xs text-muted">→</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
