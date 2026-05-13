'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { loadResults, isTestPaid, markResultsPaid } from '@/lib/storage'
import PaymentPrompt from '@/components/PaymentPrompt'
import ReminderSignup from '@/components/ReminderSignup'
import ScriptureCard from '@/components/ScriptureCard'
import {
  type TestId, type AllResults,
  TALENT_THEMES, TALENT_DOMAINS, getTalentTop5, getTalentDomain,
  OCEAN_META, OCEAN_INTERP, getOceanInterp,
  CONNECT_STYLES, getPrimaryConnect,
  TEST_META,
} from '@/lib/data'

export default function ResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const testId = params.testId as TestId
  const meta = TEST_META[testId]

  const [results, setResults] = useState<AllResults>({})
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const r = loadResults()
    setResults(r)

    // Check for successful payment redirect
    const paidParam = searchParams.get('paid')
    const sessionId = searchParams.get('session_id')

    if (paidParam === 'true' || sessionId) {
      markResultsPaid([testId])
      setPaid(true)
    } else {
      setPaid(isTestPaid(testId))
    }
    setLoading(false)
  }, [testId, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    )
  }

  const testData = results[testId]

  // No test data — redirect to test
  if (!testData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 text-center">
        <p className="font-display text-2xl text-text mb-3">No results found</p>
        <p className="text-sm text-muted mb-6">Complete the {meta.name} test first.</p>
        <Link href={`/tests/${testId}`} className="px-6 py-3 rounded-xl text-sm font-semibold text-background" style={{ background: meta.color }}>
          Take the test →
        </Link>
      </div>
    )
  }

  // Not paid — show payment gate with blurred preview
  if (!paid) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-5 py-8">
          <button onClick={() => router.push('/')} className="text-muted text-sm font-sans mb-6 block hover:text-subtle">← Home</button>

          {/* Header */}
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: meta.color }}>Results ready</p>
            <h1 className="font-display text-3xl text-text mb-2">{meta.name}</h1>
            <p className="text-sm text-subtle">You completed the assessment. Unlock your full results below.</p>
          </div>

          {/* Blurred preview */}
          <div className="relative mb-6 rounded-2xl overflow-hidden">
            <div className="blur-sm pointer-events-none">
              <BlurredPreview testId={testId} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent flex items-end justify-center pb-6">
              <div className="text-center">
                <p className="text-lg font-display text-text mb-1">Your results are ready</p>
                <p className="text-xs text-muted">Unlock below to reveal</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <PaymentPrompt
            testId={testId}
            testName={meta.name}
            onAlreadyPaid={() => {
              markResultsPaid([testId])
              setPaid(true)
            }}
          />
        </div>
      </div>
    )
  }

  // Paid — show full results
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-5 py-8">
        <button onClick={() => router.push('/')} className="text-muted text-sm font-sans mb-6 block hover:text-subtle">← Home</button>

        {/* Header */}
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: meta.color }}>
            {meta.icon} {meta.name}
          </p>
          <h1 className="font-display text-3xl text-text">Your Results</h1>
        </div>

        {/* Results content */}
        {testId === 'talent' && <TalentResults data={testData as Record<string, number>} />}
        {testId === 'ocean'  && <OceanResults  data={testData as Record<string, number>} />}
        {testId === 'connect'&& <ConnectResults data={testData as Record<string, number>} />}

        <ScriptureCard
          verse="For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do."
          reference="Ephesians 2:10"
          className="my-6"
        />

        {/* Retake recommendation */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-4">
          <p className="text-[10px] tracking-[0.3em] text-muted uppercase mb-2">Grow with it</p>
          <p className="text-sm text-subtle leading-relaxed">
            We recommend retaking this assessment <span className="text-text font-semibold">2–3 times per year</span>. As you grow, your results will deepen and shift. Each retake reveals something new.
          </p>
        </div>

        <ReminderSignup />

        {/* Other tests */}
        <div className="mt-6">
          <p className="text-[10px] tracking-[0.3em] text-muted uppercase mb-3">Complete your profile</p>
          <div className="space-y-2">
            {(['talent','ocean','connect'] as TestId[]).filter(id => id !== testId).map(id => {
              const m = TEST_META[id]
              const done = !!results[id]
              return (
                <Link key={id} href={done ? `/results/${id}` : `/tests/${id}`}
                  className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:border-border-light transition-colors">
                  <span className="text-lg">{m.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text">{m.name}</p>
                    <p className="text-xs text-muted">{done ? 'View results' : `${m.estimatedMinutes} min · Start free`}</p>
                  </div>
                  <span className="text-xs text-muted">{done ? '→' : 'Start →'}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Blurred Preview ───────────────────────────────────────────────────────────

function BlurredPreview({ testId }: { testId: TestId }) {
  const placeholders = testId === 'talent'
    ? ['Your #1 Talent', 'Your #2 Talent', 'Your #3 Talent']
    : testId === 'ocean'
    ? ['Openness', 'Conscientiousness', 'Extraversion']
    : ['Primary Style', 'Secondary Style']

  return (
    <div className="space-y-3 p-4">
      {placeholders.map((p, i) => (
        <div key={p} className="bg-card border border-border rounded-2xl p-4">
          <div className="flex justify-between mb-2">
            <div className="h-3 bg-border-light rounded w-20" />
            <div className="h-3 bg-border-light rounded w-10" />
          </div>
          <div className="h-5 bg-border-light rounded w-32 mb-2" />
          <div className="h-3 bg-border-light rounded w-full mb-1" />
          <div className="h-3 bg-border-light rounded w-3/4" />
        </div>
      ))}
    </div>
  )
}

// ── Talent Results ────────────────────────────────────────────────────────────

function TalentResults({ data }: { data: Record<string, number> }) {
  const top5 = getTalentTop5(data)

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <p className="text-xs text-subtle">Your 5 dominant talents, ranked by frequency of selection across 34 paired questions.</p>
      </div>

      {top5.map((name, i) => {
        const theme = TALENT_THEMES[name]
        const domain = getTalentDomain(name)
        const domainColor = TALENT_DOMAINS[domain]?.color || '#C9A84C'
        return (
          <div key={name} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: domainColor }}>
                #{i+1} · {domain}
              </span>
              <span className="text-[10px] text-muted">{data[name]} pts</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{theme.icon}</span>
              <h3 className="font-display text-2xl text-text">{name}</h3>
            </div>
            <p className="text-sm text-subtle leading-relaxed mb-4">{theme.desc}</p>
            <div className="pt-3 border-t border-border">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5">Best-fit roles</p>
              <p className="text-xs text-subtle">{theme.career}</p>
            </div>
          </div>
        )
      })}

      {/* Domain summary */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-[10px] tracking-[0.3em] text-muted uppercase mb-4">Domain breakdown</p>
        {Object.entries(TALENT_DOMAINS).map(([domain, { color, themes }]) => {
          const hits = top5.filter(n => themes.includes(n))
          if (!hits.length) return null
          return (
            <div key={domain} className="flex items-start gap-2 mb-3">
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
              <div>
                <span className="text-xs font-semibold" style={{ color }}>{domain}: </span>
                <span className="text-xs text-subtle">{hits.join(', ')}</span>
              </div>
            </div>
          )
        })}
        <p className="text-xs text-muted italic mt-3 leading-relaxed">
          Your dominant domain shapes what kinds of work will feel most natural and energizing to you.
        </p>
      </div>

      {/* Reflection */}
      <div className="bg-gradient-to-br from-[#1A1408] to-[#0E0E0E] border border-gold/20 rounded-2xl p-5">
        <p className="text-[10px] tracking-[0.3em] text-gold uppercase mb-3">Reflection prompts</p>
        <div className="space-y-3">
          {[
            `Where in your current life is your ${top5[0]} talent most visible?`,
            `Is there a role, project, or community where these 5 talents could be fully expressed?`,
            'Who in your life calls out these gifts in you? Are you around them enough?',
          ].map(q => (
            <p key={q} className="text-sm text-subtle leading-relaxed">· {q}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Ocean Results ─────────────────────────────────────────────────────────────

function OceanResults({ data }: { data: Record<string, number> }) {
  const order: Array<'O'|'C'|'E'|'A'|'N'> = ['O','C','E','A','N']

  return (
    <div className="space-y-4">
      <p className="text-xs text-subtle mb-2">
        Scored using the public-domain IPIP-50 instrument. Results shown as percentages with reverse-scoring applied.
      </p>

      {order.map(trait => {
        const meta = OCEAN_META[trait]
        const pct = data[trait] || 0
        const interp = getOceanInterp(trait, pct)
        return (
          <div key={trait} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{meta.icon}</span>
                <h3 className="font-display text-xl text-text">{meta.name}</h3>
              </div>
              <span className="font-display text-2xl" style={{ color: meta.color }}>{pct}%</span>
            </div>

            <div className="h-1.5 bg-border rounded-full overflow-hidden mb-4">
              <div className="h-full rounded-full progress-fill" style={{ width: `${pct}%`, background: meta.color }} />
            </div>

            <div className="mb-3">
              <span
                className="inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ color: meta.color, background: meta.color + '18' }}
              >
                {interp.label}
              </span>
            </div>

            <p className="text-sm text-subtle leading-relaxed mb-4">{interp.desc}</p>

            <div className="pt-3 border-t border-border">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5">Career fit</p>
              <p className="text-xs text-subtle">{interp.career}</p>
            </div>
          </div>
        )
      })}

      <div className="bg-gradient-to-br from-[#0A1020] to-[#0E0E0E] border border-blue/20 rounded-2xl p-5">
        <p className="text-[10px] tracking-[0.3em] text-blue uppercase mb-3">Reflection prompts</p>
        <div className="space-y-3">
          {[
            'Which of these traits do you most clearly see in yourself day-to-day?',
            'Which result surprised you — and what might that reveal?',
            'How do your traits combine? A high E + high A creates a very different leader than high E + low A.',
          ].map(q => (
            <p key={q} className="text-sm text-subtle leading-relaxed">· {q}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Connect Results ───────────────────────────────────────────────────────────

function ConnectResults({ data }: { data: Record<string, number> }) {
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1])
  const primaryKey = sorted[0][0]
  const secondaryKey = sorted[1][0]
  const primary = CONNECT_STYLES[primaryKey]
  const secondary = CONNECT_STYLES[secondaryKey]
  const total = Object.values(data).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-4">
      {/* Primary */}
      <div className="rounded-2xl border p-5" style={{ borderColor: primary.color + '55', background: primary.color + '08' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: primary.color }}>
            Primary · {sorted[0][1]} pts
          </span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{primary.icon}</span>
          <h3 className="font-display text-2xl text-text">{primary.name}</h3>
        </div>
        <p className="text-sm text-subtle leading-relaxed mb-5">{primary.desc}</p>

        <div className="space-y-3">
          <div className="bg-background/50 rounded-xl p-4">
            <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: primary.color }}>How you give</p>
            <p className="text-xs text-subtle leading-relaxed">{primary.give}</p>
          </div>
          <div className="bg-background/50 rounded-xl p-4">
            <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: primary.color }}>How you receive</p>
            <p className="text-xs text-subtle leading-relaxed">{primary.receive}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t" style={{ borderColor: primary.color + '33' }}>
          <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5">Career / community fit</p>
          <p className="text-xs text-subtle">{primary.career}</p>
        </div>
      </div>

      {/* Secondary */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: secondary.color }}>
          Secondary · {sorted[1][1]} pts
        </span>
        <div className="flex items-center gap-3 mt-3 mb-3">
          <span className="text-2xl">{secondary.icon}</span>
          <h3 className="font-display text-xl text-text">{secondary.name}</h3>
        </div>
        <p className="text-sm text-subtle leading-relaxed">{secondary.desc}</p>
      </div>

      {/* All 5 chart */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-[10px] tracking-[0.3em] text-muted uppercase mb-4">All 5 styles</p>
        {sorted.map(([key, score]) => {
          const style = CONNECT_STYLES[key]
          const pct = Math.round((score / total) * 100)
          return (
            <div key={key} className="mb-4">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-text">{style.icon} {style.name}</span>
                <span className="text-xs font-semibold" style={{ color: style.color }}>{score} pts</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full progress-fill" style={{ width: `${pct}%`, background: style.color }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Reflection */}
      <div className="bg-gradient-to-br from-[#1A0E08] to-[#0E0E0E] border border-coral/20 rounded-2xl p-5">
        <p className="text-[10px] tracking-[0.3em] text-coral uppercase mb-3">Reflection prompts</p>
        <div className="space-y-3">
          {[
            `Think of your closest relationships. Do they honor your ${primary.name} style?`,
            `Is there someone in your life whose connection style is very different from yours? How can you bridge that gap?`,
            'How might knowing your style change how you show up in your community or ministry team?',
          ].map(q => (
            <p key={q} className="text-sm text-subtle leading-relaxed">· {q}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
