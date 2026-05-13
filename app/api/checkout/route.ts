import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }
  return new Stripe(secretKey, {
    apiVersion: '2024-06-20',
  })
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripeClient()
    const { testId, wantsPdf, pdfEmail, returnUrl } = await req.json()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Discovery Suite — Results Unlock`,
              description: `Detailed results report for your ${testId === 'talent' ? 'Talent Profile' : testId === 'ocean' ? 'Personality Profile' : 'Connection Style'} assessment${wantsPdf ? ' + PDF via email' : ''}`,
            },
            unit_amount: 1999, // $19.99
          },
          quantity: 1,
        },
      ],
      metadata: {
        testId,
        wantsPdf: String(wantsPdf),
        pdfEmail: pdfEmail || '',
      },
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&paid=true`,
      cancel_url: `${appUrl}/results/${testId}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error)
    const message = error instanceof Error ? error.message : 'Stripe error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
