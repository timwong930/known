'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function ResultsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Known results render error:', error)
  }, [error])

  return (
    <main className="min-h-[100dvh] bg-background flex items-center justify-center px-5 text-center">
      <div className="max-w-sm">
        <div className="font-display text-4xl text-gold mb-4">Known.</div>
        <h1 className="font-display text-2xl text-text mb-3">We hit a results error</h1>
        <p className="text-sm leading-relaxed text-subtle mb-6">
          Your assessment may still be saved. Try loading the result again before retaking anything.
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full min-h-12 rounded-xl bg-gold px-6 text-sm font-bold text-background"
          >
            Try results again
          </button>
          <Link href="/" className="flex min-h-12 items-center justify-center rounded-xl border border-border text-sm text-subtle">
            Back to Known
          </Link>
        </div>
      </div>
    </main>
  )
}
