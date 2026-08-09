# Known v2

**Know yourself more clearly. Hold the results with open hands.**

Known is a Christian self-discovery and discernment tool built around three guided assessments. It helps people notice patterns in their gifts, temperament, and relationships without treating an assessment as a verdict, identity, prophecy, or substitute for spiritual discernment.

## Product direction

Known v2 is moving away from feeling like a collection of personality tests and toward a single, coherent discernment experience.

The three lenses are:
- **Talent Profile** — recurring gifts and strengths
- **Personality Profile** — IPIP-50 / Big Five temperament patterns
- **Connection Style** — patterns in how care is given and received

The long-term premium product is the **Known Profile**: a combined interpretation of all three lenses with reflection prompts for calling, work, relationships, growth, and conversations with trusted people.

## Product principles

1. **Lenses, not labels.** Results should create better questions, not pretend to define a person.
2. **Discernment over certainty.** Known should never imply that an assessment reveals God's will.
3. **Useful before paid.** The free experience should give real value and build trust.
4. **The synthesis is the product.** Individual scores matter less than the patterns across assessments.
5. **Quietly premium.** Avoid quiz-site gimmicks, overdone gradients, fake urgency, and AI-looking copy.
6. **Shareable by design.** Results should eventually generate tasteful cards people genuinely want to share.

## Current stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Stripe
- Resend
- Vercel
- Browser localStorage for current assessment state

## Current v2 status

The `rebrand-known-v2` branch contains the first Known v2 pass:
- Rebranded product and metadata from Discovery Suite to Known
- New landing experience and positioning
- Stronger distinction between self-knowledge and spiritual authority
- Known Profile positioned as the eventual centerpiece
- Existing assessment flows preserved
- Existing Stripe implementation preserved for later payment work

See [`KNOWN_V2_GAMEPLAN.md`](./KNOWN_V2_GAMEPLAN.md) for the implementation roadmap and continuation notes.

## Local setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Typical environment variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=results@yourdomain.com
```

## Important launch warning

The current payment unlock flow is **not production-secure yet**. Client-side redirect parameters and localStorage should not be considered proof of purchase. Before paid launch, verify Stripe sessions server-side and persist entitlements outside the browser.

## Assessment/IP notes

- Talent Profile: original theme names, descriptions, and questions
- Personality Profile: IPIP-50 items by Lewis Goldberg / public-domain IPIP material
- Connection Style: original style names, descriptions, and questions

Avoid marketing language that implies clinical diagnosis, guaranteed career fit, divine revelation, or scientifically validated conclusions beyond what the underlying instruments support.

## License

Original Known assessment content © respective project owner. IPIP material remains subject to its public-domain terms.
