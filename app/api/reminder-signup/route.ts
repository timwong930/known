import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY')
  }
  return new Resend(apiKey)
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const resend = getResendClient()

    // Send confirmation + schedule reminders via Resend
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'results@yourdomain.com',
      to: email,
      subject: 'You\'re signed up for Discovery Suite reminders',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background:#080808;color:#F0EDE4;font-family:Georgia,serif;margin:0;padding:40px 20px;">
          <div style="max-width:480px;margin:0 auto;">
            <p style="font-size:11px;letter-spacing:4px;color:#666;text-transform:uppercase;text-align:center;margin-bottom:24px;">
              DISCOVERY SUITE
            </p>
            <h1 style="font-size:24px;text-align:center;color:#F0EDE4;margin:0 0 16px;">You're signed up.</h1>
            <p style="color:#999;font-size:14px;line-height:1.7;text-align:center;margin:0 0 24px;">
              We'll remind you to retake your assessments at 2 weeks, 1 month, 3 months, and 6 months.
              Each retake is completely free and will reveal something new about who you're becoming.
            </p>
            <div style="background:#161616;border:1px solid #222;border-radius:16px;padding:20px;margin-bottom:24px;">
              <p style="color:#C9A84C;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px;">WHEN WE'LL REACH OUT</p>
              <div style="space-y:8px;">
                ${[
                  ['2 weeks', 'A quick check-in — are you living from your strengths?'],
                  ['1 month', 'Deeper reflection — how has this changed how you see yourself?'],
                  ['3 months', 'Seasonal retake — are you in a role that fits who you are?'],
                  ['6 months', 'Half-year audit — has your calling become clearer?'],
                ].map(([time, desc]) => `
                  <div style="margin-bottom:10px;">
                    <span style="color:#C9A84C;font-size:12px;font-weight:bold;">${time}</span>
                    <span style="color:#999;font-size:12px;margin-left:8px;">${desc}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <p style="text-align:center;color:#444;font-size:11px;">
              Unsubscribe anytime. We will never spam you.
            </p>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Reminder signup error:', error)
    return NextResponse.json({ error: 'Failed to sign up' }, { status: 500 })
  }
}
