'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import type { TestId } from '@/lib/data'

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

  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const paymentsReady = Boolean(stripePublishableKey?.startsWith('pk_'))

  async function handleCheckout() {
    if (!stripePublishableKey || !paymentsReady) {
      setError('Payments are not configured for this preview yet.')
      return
    }

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

      // Stripe is loaded only when checkout is actually requested and a
      // publishable key is present. This prevents preview deployments without
      // Stripe environment variables from crashing the results page.
      const stripe = await loadStripe(stripePublishableKey)
      if (!stripe) throw new Error('Stripe could not be initialized.')

      if (url) window.location.href = url
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Known v2 is intentionally testable before payment configuration is done.
  // Do not block the result experience or crash preview deployments simply
  // because Stripe keys have not been added to the Preview environment yet.
  if (!paymentsReady) {
    return (
      <div className="bg-card border border-border-light rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-[#1A1408] to-[#0E0E0E] px-5 sm:px-6 py-6 border-b border-border">
          <p className="text-[10px] tracking-[0.35em] text-gold uppercase mb-2">Known v2 preview</p>
          <h3 className="font-display text-2xl text-text">Your {testName} results are ready</h3>
          <p className="text-sm text-subtle mt-2 leading-relaxed">
            Payments are being configured separately. For now, you can continue into the full result experience so this version can be tested end-to-end.
          </p>
        </div>

        <div className="px-5 sm:px-6 py-5">
          <button
            onClick={onAlreadyPaid}
            disabled={!onAlreadyPaid}
            className="w-full min-h-12 py-3.5 rounded-xl bg-gold text-background font-sans font-bold text-sm tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View my results →
          </button>
          <p className="text-[11px] text-muted text-center mt-3 leading-relaxed">
            Preview mode only. Payment verification will be completed before a paid public launch.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border-light rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-br from-[#1A1408] to-[#0E0E0E] px-5 sm:px-6 py-6 border-b border-border">
        <p className="text-[10px] tracking-[0.4em] text-gold uppercase mb-2">Results ready</p>
        <h3 className="font-display text-2xl text-text">Unlock your {testName} results</h3>
        <p className="text-sm text-subtle mt-2 leading-relaxed">
          Your answers have been scored. Taking the test is always{' '}
          <span className="text-gold font-semibold">completely free</span>. Unlocking your
          detailed results report is a one-time {PRICE} charge.
        </p>
      </div>

      <div className="px-5 sm:px-6 py-5 border-b border-border">
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

      <div className="px-5 sm:px-6 py-5 border-b border-border">
        <label className="flex items-start gap-3 cursor-pointer min-h-11">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={wantsPdf}
              onChange={e => setWantsPdf(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${wantsPdf ? 'bg-gold border-gold' : 'border-border-light'}`}>
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
              autoComplete="email"
              inputMode="email"
              className="w-full min-h-12 bg-background border border-border rounded-xl px-4 py-3 text-base sm:text-sm text-text placeholder-muted focus:outline-none focus:border-gold/50 transition-colors font-sans"
            />
          </div>
        )}
      </div>

      <div className="px-5 sm:px-6 py-5">
        {error && <p className="text-xs text-coral mb-3">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={loading || (wantsPdf && !pdfEmail)}
          className="w-full min-h-12 py-3.5 rounded-xl bg-gold text-background font-sans font-bold text-sm tracking-wide hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Redirecting to payment…' : `Unlock Results — ${PRICE} one-time`}
        </button>

        <p className="text-[10px] text-muted text-center mt-3">
          Secure checkout via Stripe. Taking the tests is always free.
          <br />Results are a one-time charge — no subscriptions.
        </p>
      </div>
    </div>
  )
}
