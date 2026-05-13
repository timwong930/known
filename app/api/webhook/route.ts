import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }
  return new Stripe(secretKey, {
    apiVersion: '2024-06-20',
  })
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY')
  }
  return new Resend(apiKey)
}

export async function POST(req: NextRequest) {
  const stripe = getStripeClient()
  const resend = getResendClient()
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Webhook error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { testId, wantsPdf, pdfEmail } = session.metadata || {}

    if (wantsPdf === 'true' && pdfEmail) {
      await sendResultsPdfEmail(resend, pdfEmail, testId)
    }
  }

  return NextResponse.json({ received: true })
}

async function sendResultsPdfEmail(resend: Resend, email: string, testId: string) {
  const testNames: Record<string, string> = {
    talent: 'Talent Profile',
    ocean: 'Personality Profile',
    connect: 'Connection Style',
  }
  const testName = testNames[testId] || 'Assessment'

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'results@yourdomain.com',
      to: email,
      subject: `Your ${testName} Results — Discovery Suite`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Your Results</title>
        </head>
        <body style="background:#080808;color:#F0EDE4;font-family:Georgia,serif;margin:0;padding:40px 20px;">
          <div style="max-width:560px;margin:0 auto;">
            <div style="text-align:center;margin-bottom:32px;">
              <p style="font-size:11px;letter-spacing:4px;color:#666;text-transform:uppercase;margin-bottom:8px;">
                DISCOVERY SUITE
              </p>
              <h1 style="font-size:28px;color:#F0EDE4;margin:0 0 8px;">Your ${testName} Results</h1>
              <p style="color:#999;font-size:14px;margin:0;">
                Thank you for taking the assessment.
              </p>
            </div>

            <div style="background:#161616;border:1px solid #222;border-radius:16px;padding:24px;margin-bottom:24px;">
              <p style="color:#C9A84C;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px;">
                YOUR RESULTS ARE READY
              </p>
              <p style="color:#F0EDE4;font-size:15px;line-height:1.7;margin:0 0 16px;">
                Your detailed results are available online. Visit the link below to view your full report, including interpretation, career insights, and reflection prompts.
              </p>
              <a
                href="${process.env.NEXT_PUBLIC_APP_URL}/results/${testId}?paid=true"
                style="display:inline-block;background:#C9A84C;color:#080808;padding:14px 24px;border-radius:10px;font-size:14px;font-weight:bold;text-decoration:none;font-family:sans-serif;"
              >
                View My Results →
              </a>
            </div>

            <div style="background:#111;border:1px solid #1A1A1A;border-radius:16px;padding:20px;margin-bottom:24px;text-align:center;">
              <p style="font-style:italic;color:#F0EDE4;opacity:0.7;font-size:15px;line-height:1.8;margin:0 0 8px;">
                "For we are God's handiwork, created in Christ Jesus to do good works,
                which God prepared in advance for us to do."
              </p>
              <p style="font-size:11px;letter-spacing:3px;color:#666;text-transform:uppercase;margin:0;">
                Ephesians 2:10
              </p>
            </div>

            <div style="background:#161616;border:1px solid #222;border-radius:16px;padding:20px;margin-bottom:24px;">
              <p style="color:#666;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 10px;">
                GROW WITH IT
              </p>
              <p style="color:#999;font-size:13px;line-height:1.7;margin:0;">
                We recommend retaking this assessment 2–3 times per year. As you grow, your results will deepen and shift. Each retake reveals something new about who you're becoming.
              </p>
            </div>

            <p style="text-align:center;color:#444;font-size:11px;line-height:1.8;">
              Discovery Suite — Know Yourself. Know Your Calling.<br />
              Taking tests is always free. Results are a one-time charge.
            </p>
          </div>
        </body>
        </html>
      `,
    })
  } catch (err) {
    console.error('Failed to send results email:', err)
  }
}
