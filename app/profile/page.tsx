'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { loadResults } from '@/lib/storage'
import ScriptureCard from '@/components/ScriptureCard'
import ReminderSignup from '@/components/ReminderSignup'
import {
  type AllResults, type TalentScores, type OceanScores, type ConnectScores,
  TALENT_THEMES, TALENT_DOMAINS, getTalentTop5, getTalentDomain,
  OCEAN_META, getOceanInterp,
  CONNECT_STYLES, getPrimaryConnect,
  TEST_META,
} from '@/lib/data'

export default function ProfilePage() {
  const [results, setResults] = useState<AllResults>({})

  useEffect(() => {
    setResults(loadResults())
  }, [])

  const completedTests = (['talent','ocean','connect'] as const).filter(id => !!results[id])
  const hasEnough = completedTests.length >= 2

  if (!hasEnough) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 text-center">
        <div className="text-4xl mb-4">🧭</div>
        <h2 className="font-display text-2xl text-text mb-3">Complete at least 2 tests first</h2>
        <p className="text-sm text-subtle mb-6 max-w-xs">Your full profile synthesizes all three assessments into one calling picture.</p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-gold text-background text-sm font-bold font-sans">
          Take the tests →
        </Link>
      </div>
    )
  }

  const talent = results.talent as TalentScores | undefined
  const ocean  = results.ocean  as OceanScores  | undefined
  const connect = results.connect as ConnectScores | undefined

  const top5 = talent ? getTalentTop5(talent) : []
  const primaryTalent = top5[0]
  const primaryDomain = primaryTalent ? getTalentDomain(primaryTalent) : ''
  const primaryConnectKey = connect ? getPrimaryConnect(connect) : null
  const primaryConnect = primaryConnectKey ? CONNECT_STYLES[primaryConnectKey] : null

  // Synthesize calling narrative
  const highOcean = ocean
    ? Object.entries(ocean).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k])=>OCEAN_META[k].name)
    : []

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-5 py-8">
        <Link href="/" className="text-muted text-sm font-sans mb-8 block hover:text-subtle">← Home</Link>

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.4em] text-muted uppercase mb-2">
            {completedTests.length}/3 assessments complete
          </p>
          <h1 className="font-display text-4xl text-text mb-3">Your Full Profile</h1>
          <p className="text-sm text-subtle max-w-sm mx-auto leading-relaxed">
            Wired with purpose. Here is everything you've discovered about yourself — synthesized.
          </p>
        </div>

        {/* Calling statement */}
        {top5.length > 0 && (
          <div className="bg-gradient-to-br from-[#1A1408] to-[#0E0E0E] border border-gold/30 rounded-2xl p-6 mb-6 text-center">
            <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-3">Your calling signature</p>
            <p className="font-display text-xl text-text leading-relaxed italic">
              "A person driven by{' '}
              <span className="text-gold not-italic font-semibold">{top5[0]}</span>
              {top5[1] && <> and <span className="text-gold not-italic font-semibold">{top5[1]}</span></>}
              {highOcean.length > 0 && <>, with a <span className="text-gold not-italic font-semibold">{highOcean[0]}</span> personality</>}
              {primaryConnect && <>, who connects through <span className="text-gold not-italic font-semibold">{primaryConnect.name}</span></>}."
            </p>
          </div>
        )}

        {/* Talent summary */}
        {top5.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] tracking-[0.3em] text-gold uppercase">⚡ Talent Profile — Top 5</p>
              <Link href="/results/talent" className="text-[10px] text-muted hover:text-subtle">Full results →</Link>
            </div>
            <div className="space-y-3">
              {top5.map((name, i) => {
                const theme = TALENT_THEMES[name]
                const domain = getTalentDomain(name)
                const color = TALENT_DOMAINS[domain]?.color || '#C9A84C'
                return (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold w-5 text-center" style={{ color }}>#{i+1}</span>
                    <span className="text-base">{theme.icon}</span>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-text">{name}</span>
                      <span className="text-[10px] text-muted ml-2">{domain}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Ocean summary */}
        {ocean && (
          <div className="bg-card border border-border rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] tracking-[0.3em] text-blue uppercase">🌊 Personality Profile</p>
              <Link href="/results/ocean" className="text-[10px] text-muted hover:text-subtle">Full results →</Link>
            </div>
            <div className="space-y-3">
              {(['O','C','E','A','N'] as const).map(trait => {
                const meta = OCEAN_META[trait]
                const pct = ocean[trait]
                const interp = getOceanInterp(trait, pct)
                return (
                  <div key={trait} className="flex items-center gap-3">
                    <span className="text-[10px]" style={{ color: meta.color }}>{meta.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-text">{meta.name}</span>
                        <span className="text-xs font-semibold" style={{ color: meta.color }}>{pct}%</span>
                      </div>
                      <div className="h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full rounded-full progress-fill" style={{ width: `${pct}%`, background: meta.color }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Connect summary */}
        {primaryConnect && (
          <div className="bg-card border border-border rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] tracking-[0.3em] text-coral uppercase">💛 Connection Style</p>
              <Link href="/results/connect" className="text-[10px] text-muted hover:text-subtle">Full results →</Link>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{primaryConnect.icon}</span>
              <h3 className="font-display text-xl text-text">{primaryConnect.name}</h3>
            </div>
            <p className="text-sm text-subtle leading-relaxed">{primaryConnect.desc}</p>
          </div>
        )}

        {/* What this means */}
        <div className="bg-gradient-to-br from-[#100A18] to-[#0E0E0E] border border-purple/20 rounded-2xl p-6 mb-6">
          <p className="text-[10px] tracking-[0.3em] text-purple uppercase mb-4">What this means for your calling</p>
          <p className="text-sm text-subtle leading-relaxed mb-4">
            Your gifts, personality, and connection style aren't random — they're a blueprint. The way you were wired points directly toward the kind of work that will feel both purposeful and sustainable.
          </p>
          {primaryDomain && (
            <p className="text-sm text-subtle leading-relaxed mb-4">
              Your top talents cluster in the <span className="text-text font-semibold">{primaryDomain}</span> domain — meaning that's where your most natural energy lives. Seek roles and communities that operate in that space.
            </p>
          )}
          {primaryConnect && (
            <p className="text-sm text-subtle leading-relaxed">
              You give and receive love through <span className="text-text font-semibold">{primaryConnect.name}</span> — which means the right team and community will honor that. Don't settle for environments that don't.
            </p>
          )}
        </div>

        {/* Incomplete tests */}
        {completedTests.length < 3 && (
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.3em] text-muted uppercase mb-3">Complete your profile</p>
            {(['talent','ocean','connect'] as const).filter(id => !results[id]).map(id => {
              const m = TEST_META[id]
              return (
                <Link key={id} href={`/tests/${id}`}
                  className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 mb-2 hover:border-border-light transition-colors">
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text">{m.name}</p>
                    <p className="text-xs text-muted">{m.estimatedMinutes} min · Start free</p>
                  </div>
                  <span className="text-xs text-muted">Start →</span>
                </Link>
              )
            })}
          </div>
        )}

        <ScriptureCard
          verse="For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do."
          reference="Ephesians 2:10"
          className="mb-6"
        />

        <ReminderSignup />
      </div>
    </div>
  )
}
