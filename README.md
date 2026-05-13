# Discovery Suite

**Know Yourself. Know Your Calling.**

A faith-centered, mobile-first self-discovery platform with three original assessments:
- ⚡ **Talent Profile** — 34 paired questions across 30 original talent themes
- 🌊 **Personality Profile** — IPIP-50 (public domain Big Five), 50 questions
- 💛 **Connection Style** — 30 paired questions across 5 original connection styles

**Complete free. Results unlock for a one-time $19.99 fee.**

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Stripe** — payments
- **Resend** — transactional email / PDF delivery
- **Vercel** — deployment

---

## Local Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd discovery-suite
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (https://resend.com/api-keys)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=results@yourdomain.com
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Stripe Setup

### Create a product

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Create a product: **"Discovery Suite Results Unlock"**
3. Price: **$19.99 one-time**
4. Copy the **Price ID** (starts with `price_`)

### Set up webhooks (for PDF email delivery)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select event: `checkout.session.completed`
4. Copy the **Webhook Secret** → add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

For local webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

---

## Resend Setup

1. Create account at [resend.com](https://resend.com)
2. Add & verify your domain
3. Create an API key
4. Set `RESEND_FROM_EMAIL` to a verified sender (e.g. `results@yourdomain.com`)

---

## Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/discovery-suite.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Framework preset: **Next.js** (auto-detected)
4. Add all environment variables from `.env.local`
5. Set `NEXT_PUBLIC_APP_URL` to your Vercel URL (e.g. `https://discovery-suite.vercel.app`)
6. Deploy

### 3. Update Stripe webhook

After deploying, update your Stripe webhook URL to:
`https://yourdomain.vercel.app/api/webhook`

---

## Project Structure

```
discovery-suite/
├── app/
│   ├── layout.tsx          # Root layout, fonts
│   ├── page.tsx            # Landing page (home)
│   ├── globals.css         # Global styles
│   ├── not-found.tsx       # 404 page
│   ├── profile/
│   │   └── page.tsx        # Full synthesis profile
│   ├── tests/
│   │   └── [testId]/
│   │       └── page.tsx    # Test runner
│   ├── results/
│   │   └── [testId]/
│   │       └── page.tsx    # Results + payment gate
│   └── api/
│       ├── checkout/       # Stripe checkout session
│       ├── webhook/        # Stripe webhook (PDF email)
│       └── reminder-signup/ # Email reminder signup
├── components/
│   ├── TestEngine.tsx      # Unified test runner
│   ├── PaymentPrompt.tsx   # Stripe payment UI
│   ├── PrayerBlock.tsx     # Pre-test prayer screen
│   ├── ProgressBar.tsx     # Progress indicator
│   ├── ReminderSignup.tsx  # Retake reminder signup
│   └── ScriptureCard.tsx   # Scripture display
├── lib/
│   ├── data.ts             # All test data, scoring, types
│   └── storage.ts          # localStorage helpers
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── .env.local.example
```

---

## Copyright Notes

- **Talent Profile**: 30 fully original theme names, descriptions, and questions. No Gallup trademarks used.
- **Personality Profile**: IPIP-50 items by Lewis Goldberg — public domain, free for all use.
- **Connection Style**: 5 fully original style names, descriptions, and questions. No Gary Chapman IP used.

---

## Pricing Model

| Action | Cost |
|--------|------|
| Take any test | Free |
| View results (1 test) | $19.99 one-time |
| PDF via email | Included |
| Retake tests | Free |
| Subscription | None — ever |

---

## Retake Recommendation

We recommend taking each assessment **2–3 times per year**. The reminder signup collects emails and sends follow-ups at:
- 2 weeks
- 1 month
- 3 months
- 6 months

---

## License

All original content © Discovery Suite. IPIP-50 items are public domain.
