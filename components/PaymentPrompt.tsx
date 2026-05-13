'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import type { TestId } from '@/lib/data'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface Props {
  testId: TestId
  testName: string
  onAlreadyPaid?: () => void
}

const PRICE = '$19.99'

export default function PaymentPrompt({ testId, testName, onAlreadyPaid }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [wantsPdf, setWantsPdf] = useState(true)
  const [pdfEmail, setPdfEmail] = useState('')

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId,
          wantsPdf,
          pdfEmail: wantsPdf ? pdfEmail : undefined,
          returnUrl: `${window.location.origin}/results/${testId}?paid=true`,
        }),
      })
      const { url, error: err } = await res.json()
      if (err) throw new Error(err)
      const stripe = await stripePromise
      if (url) window.location.href = url
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border-light rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1A1408] to-[#0E0E0E] px-6 py-6 border-b border-border">
        <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-2">Results ready</p>
        <h3 className="font-display text-2xl text-text">Unlock your {testName} results</h3>
        <p className="text-sm text-subtle mt-2 leading-relaxed">
          Your answers have been scored. Taking the test is always{' '}
          <span className="text-gold font-semibold">completely free</span>. Unlocking your
          detailed results report is a one-time {PRICE} charge.
        </p>
      </div>

      {/* What you get */}
      <div className="px-6 py-5 border-b border-border">
        <p className="text-[10px] tracking-[0.3em] text-muted uppercase mb-3">What's included</p>
        <div className="space-y-2.5">
          {[
            'Your top results with detailed interpretation',
            'Domain & pattern analysis',
            'Career & calling recommendations',
            'Faith-centered reflection prompts',
            'Guidance on how to use results in community',
          ].map(item => (
            <div key={item} className="flex items-start gap-2.5">
              <span className="text-gold text-xs mt-0.5">✓</span>
              <span className="text-sm text-subtle">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PDF option */}
      <div className="px-6 py-5 border-b border-border">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={wantsPdf}
              onChange={e => setWantsPdf(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${wantsPdf ? 'bg-gold border-gold' : 'border-border-light'}`}>
              {wantsPdf && <span className="text-background text-[10px] leading-none">✓</span>}
            </div>
          </div>
          <div>
            <p className="text-sm text-text font-medium">Email me a PDF of my results</p>
            <p className="text-xs text-muted mt-0.5">Save, print, or share with a mentor or pastor.</p>
          </div>
        </label>

        {wantsPdf && (
          <div className="mt-3">
            <input
              type="email"
              value={pdfEmail}
              onChange={e => setPdfEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:border-gold/50 transition-colors font-sans"
            />
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 py-5">
        {error && <p className="text-xs text-coral mb-3">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={loading || (wantsPdf && !pdfEmail)}
          className="w-full py-4 rounded-xl bg-gold text-background font-sans font-bold text-sm tracking-wide hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Redirecting to payment…' : `Unlock Results — ${PRICE} one-time`}
        </button>

        <p className="text-[10px] text-muted text-center mt-3">
          Secure checkout via Stripe. Taking the tests is always free.
          <br />Results are a one-time charge — no subscriptions.
        </p>

        {onAlreadyPaid && (
          <button
            onClick={onAlreadyPaid}
            className="w-full text-center text-[11px] text-muted mt-2 underline underline-offset-2"
          >
            I already paid — show my results
          </button>
        )}
      </div>
    </div>
  )
}
