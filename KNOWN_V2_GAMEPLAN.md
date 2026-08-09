# Known v2 — Product & Engineering Game Plan

This file is the continuation brief for future work on Known. Read this before making major product changes.

## North star

Known should become a polished Christian self-discovery and discernment product — not a generic personality-test website with Christian copy layered on top.

The core promise:

> Help people notice meaningful patterns in how they are wired, then give them better language and questions for prayerful discernment.

Known must consistently communicate that assessments are **lenses, not verdicts**. The product should never imply that a score reveals God's will, determines identity, replaces Scripture/community/pastoral care, or predicts a person's future.

## Current v2 branch

Primary working branch: `rebrand-known-v2`

Completed in the first v2 pass:
- Rebranded Discovery Suite → Known
- Reworked page metadata/SEO positioning
- Rebuilt landing page around discernment rather than quizzes
- Positioned the combined **Known Profile** as the eventual hero product
- Preserved current three assessment flows
- Preserved current Stripe/Resend implementation for later work
- Added clear spiritual-authority disclaimer language
- Updated README with product principles and launch warning

## Priority 0 — Protect what already works

Before any major feature work:
- Run `npm install`
- Run `npm run build`
- Run lint/type checks available in the repo
- Manually test all 3 assessments end-to-end on desktop and mobile
- Confirm in-progress answers survive refresh
- Confirm completed results still load from localStorage
- Confirm `/profile` still renders after completing multiple tests
- Confirm Stripe checkout still launches in test mode if env vars are present

Do not merge v2 to main until the build and assessment flows pass.

## Priority 1 — Rebuild results as the core product experience

The current results screens are functional but should feel significantly more valuable and editorial.

For each individual assessment, create a two-layer result:

### Free result
Give enough real value to create trust:
- Primary outcome / top pattern
- Short interpretation
- One strength to lean into
- One tension or blind spot to consider
- 2–3 reflection questions
- Clear invitation to complete the other lenses

Do not use manipulative blur-only paywalls as the only value reveal.

### Full result
Eventually include:
- Full rankings / trait breakdown
- Rich interpretation
- Strengths
- Friction points / overuse risks
- Work/environment implications
- Relationship implications where appropriate
- Reflection prompts
- Practical experiments to try
- Share card

Keep language probabilistic: "you may", "you tend to", "this can show up as". Avoid deterministic claims.

## Priority 2 — Make the Known Profile the hero product

The combined profile is the main differentiation.

Build `/profile` around intersections rather than simply stacking three reports.

Suggested sections:
1. **Your pattern at a glance** — concise synthesis
2. **How you tend to contribute** — gifts + temperament
3. **How you tend to work** — energy, structure, collaboration, decision tendencies
4. **How you tend to connect** — temperament + connection style
5. **Where tension may show up** — contradictory or overused patterns
6. **Environments where you may thrive** — framed as hypotheses, not prescriptions
7. **Questions for calling** — prayer/reflection prompts
8. **Questions to ask people who know you well**
9. **Try this next** — small real-life experiments

Important: do not automatically generate spiritual claims such as "God made you to be X" from scores.

## Priority 3 — Monetization redesign

Current pricing is inherited and temporary. Do not optimize it until the product value is stronger.

Recommended direction to test:
- Assessments: free
- Useful individual summaries: free
- Full Known Profile: one-time purchase
- Optional polished PDF included

Initial pricing experiment range: roughly $14.99–$24.99 for the combined product, but validate with users before committing.

### Critical payment security work before accepting real payments

Current implementation is not production-safe because purchase entitlement can be inferred client-side from redirect params/localStorage.

Required:
- Verify Stripe Checkout Session server-side
- Validate session status + purchased product
- Never grant paid entitlement because `?paid=true` exists
- Remove or redesign "I already paid" bypass behavior
- Persist purchase entitlement server-side
- Add idempotent webhook processing
- Validate webhook signatures
- Avoid trusting client-provided return URLs without validation
- Add purchase recovery

Do this before promoting paid checkout publicly.

## Priority 4 — Accounts and durable persistence

Current results are browser-local. This is acceptable for prototyping but weak for a paid product.

Recommended minimal account model:
- Magic-link email auth
- Anonymous use remains allowed until save/purchase
- Store assessment results server-side after opt-in/account creation
- Preserve local progress during migration
- Associate purchases with verified email/user ID
- Let users reopen their Known Profile on another device

Possible backend choices: Supabase, Postgres + auth provider, or another simple hosted backend. Keep architecture boring and maintainable.

## Priority 5 — Sharing / organic growth loop

Build tasteful share cards that expose enough identity to be interesting without oversharing private results.

Examples:
- "My top Known pattern: Builder"
- "I tend toward high Openness + high Conscientiousness"
- "Three things I learned about how I work"

Each card should include subtle Known branding and a call to discover your own profile.

Needed:
- OG image generation or downloadable social card
- Native share button on mobile
- Copy-link flow
- Privacy-safe defaults
- Do not expose full results without explicit user action

## Priority 6 — Trust, methodology, and transparency

Create public pages:
- `/about`
- `/methodology`
- `/privacy`
- `/terms`
- `/support`

Methodology page should clearly identify:
- Which content is original
- Which assessment uses IPIP-50
- How scores are calculated
- Limitations of each assessment
- What Known is not
- No clinical/diagnostic use

Review copyright/trademark language before public promotion.

## Priority 7 — Product analytics

Before trying to grow traffic, add privacy-conscious analytics.

Track funnel events such as:
- Landing viewed
- Assessment started
- Assessment abandoned
- Assessment completed
- Free results viewed
- Second assessment started
- All three completed
- Known Profile viewed
- Upgrade CTA viewed/clicked
- Checkout started/completed
- Share clicked

Core success metrics:
- Landing → first assessment start
- Assessment completion rate
- First assessment → second assessment conversion
- % completing all three
- Known Profile view rate
- Share rate
- Paid conversion once monetization is enabled

Do not optimize vanity traffic before measuring completion and retention behavior.

## Priority 8 — SEO / public launch pages

Create useful indexable content instead of generic AI-written blog spam.

Potential landing pages/topics:
- Christian strengths assessment
- Christian personality assessment
- How personality tests fit with Christian discernment
- Gifts vs personality vs calling
- Questions to ask when discerning career direction
- How to use personality frameworks without letting them define you

Each page should lead naturally into one assessment.

## Priority 9 — Visual polish

Known v2 visual direction:
- Quiet, editorial, reflective
- Warm dark neutral palette
- Gold used sparingly
- Strong typography and whitespace
- Minimal emoji usage
- Avoid giant gradients, excessive rounded cards, fake testimonials, neon effects, and generic AI-SaaS visual patterns

Before launch add:
- Known wordmark/logo treatment
- Favicon/app icons
- OG image
- Better empty/loading/error states
- Mobile Safari QA
- Accessibility audit
- Keyboard/focus states
- Reduced-motion support

## Priority 10 — User validation before scaling

Get 10–20 people through the full experience before spending meaningfully on ads.

Ask:
- Did the results feel accurate enough to be useful?
- What felt generic?
- What felt uncomfortable or overly certain?
- Did the faith framing feel helpful or forced?
- Which part would you share with someone else?
- Would you pay for the combined profile? Why/why not?
- What would make the report worth paying for?

Use this feedback to reshape the Known Profile before optimizing marketing.

## Suggested implementation sequence

1. Build/test current v2 branch
2. Fix any regressions
3. Redesign individual results with meaningful free summaries
4. Redesign `/profile` as true synthesis
5. Add share cards
6. Add methodology/about/privacy/support pages
7. Add analytics
8. Add durable backend/accounts
9. Secure payments + restructure offer
10. User test
11. SEO/content
12. Public launch

## Definition of v2 launch-ready

Known v2 is ready for a real public push when:
- All assessments work reliably on mobile
- Results survive across devices for registered/paying users
- Free result experience is genuinely useful
- Known Profile feels worth sharing and/or paying for
- Payment entitlement is server-verified
- Privacy/terms/methodology/support pages exist
- Analytics show the full funnel
- No misleading spiritual, clinical, scientific, or career-certainty claims remain
- At least a small group of real users has completed the product and given feedback

## Future-self reminder

Do not solve low conversion by adding urgency, dark patterns, more quizzes, or more copy.

If Known is not converting, first ask whether the result is insightful enough that someone would tell a friend about it. The product's moat should be the quality of the synthesis and the care of the framing — not the number of assessment questions.
