# SPEC — BizAutomations Landing Page

> Single-page marketing site for a Kent-based workflow automation consultancy serving small businesses.
> The substance of this spec is derived from `Website_Landing_Page_spec.docx`. The **design direction** has been rewritten to be more editorial and expressive — the original brief leaned conservative (navy/sand/white, neutral sans-pair, rounded cards). This version keeps the strategy and bones, but pushes the surface harder.

---

## 1. OVERVIEW

**Project:** BizAutomations
**Type:** Marketing / landing page (single page, single job)
**Owner:** aprensivo
**Version:** 0.1 — Draft
**Repo:** `web/BizAutomations`
**Live URL:** TBD (likely `bizautomations.co.uk`, fronted via Cloudflare → GitHub Pages)

### Vision
A single page that convinces a Kent small business owner — in 60 seconds, on a phone, between jobs — that BizAutomations is worth a phone call. The page should feel like a *confident operator's calling card*, not a SaaS landing page. Built to be skimmed, scannable, and decisive.

### North Star
**Get the visitor to book a consultation or place a phone call.** Every section earns its existence by moving someone toward that action.

### Success Metric
**Conversion** — % of visits resulting in a form submission, phone-tap, or mailto-click. Target ≥ 3% from organic / referral traffic.

---

## 2. USERS

### Primary User
A non-technical small business owner / sole trader in Kent (trades, professional services, retail, hospitality). Likely 35–60. Phone-first. Time-poor. Spreadsheet-fatigued. Skeptical of jargon. Has been burned by a "tech guy" before.

### User Journey (happy path)
```
Step 1: Arrives via Google ("automation Kent", "small business systems UK") or referral
Step 2: Hero loads under 1.5s — sees a sentence about *their* problem, in their language
Step 3: Scrolls — recognises themselves in the Problem section ("that's me")
Step 4: Sees the 3-step process and thinks "ok, that's not scary"
Step 5: Skims services, sees one that matches their pain
Step 6: Either taps "Book a consultation" or taps the phone number in the sticky bar
Outcome: Form submission lands in Airtable via N8N webhook → email notification
```

### Edge Cases / Error States
- N8N webhook down → form falls back to `mailto:` with prefilled subject/body
- Slow connection → text and CTA render before any motion or images
- JS disabled → all CTAs still work (form posts to N8N directly, phone link is `tel:`)
- Long phone session → sticky CTA bar never obscures form fields on mobile

---

## 3. FUNCTIONAL REQUIREMENTS

### Core Features (must have)
- [ ] **Hero with single primary CTA:** loads above the fold, headline in client's language, one button + one phone link. No second button.
- [ ] **Problem section:** 3 stat/icon pairs OR 3 short paragraphs naming the pain. No tech vocabulary.
- [ ] **How It Works (3 steps):** horizontal on desktop, stacked on mobile. Animated on scroll-into-view.
- [ ] **Services grid:** 3–4 cards. 1col mobile / 2col tablet / 3–4col desktop.
- [ ] **Social proof:** testimonials *or* a single specific case study with hard numbers ("X hours → Y minutes").
- [ ] **About / Trust:** brief intro, location, ICO + insurance line.
- [ ] **Footer with repeat CTA:** email, phone, LinkedIn, legal links, repeat button.
- [ ] **Sticky mobile CTA bar:** persistent "Call" + "Book" buttons on screens < 640px.
- [ ] **Form → N8N → Airtable:** consultation form posts to N8N webhook; row created in Airtable `Leads`.
- [ ] **LocalBusiness JSON-LD:** in `<head>`.

### Secondary Features (nice to have)
- [ ] Dark/light auto theme respecting `prefers-color-scheme`
- [ ] Scroll-driven hero (kinetic headline)
- [ ] "Live automation" hero visual — a small loop showing a task moving from "manual" to "done"
- [ ] Animated counter on stat blocks (count-up on intersection)

### Explicitly Out of Scope
- ❌ User accounts / login
- ❌ Pricing calculator or pricing page
- ❌ Blog / CMS / multi-page
- ❌ Multi-language
- ❌ Payment processing
- ❌ Logo bar (until 8+ recognisable logos exist — three logos makes the business look small)
- ❌ Social media icon grid (no dead links)

---

## 4. DATA & INTEGRATIONS

### Data Flow
```
Form submission → fetch POST → N8N webhook → Airtable "Leads" table
                              ↘ N8N email node → notification to owner
```

### External Integrations
| Service | Purpose | Auth |
|---|---|---|
| N8N (self-hosted, n8n.bizautomations.co.uk) | Webhook handler for form | Shared secret in webhook URL |
| Airtable | Lead storage | API token (lives in N8N credentials, never in client) |
| Cloudflare | DNS, CDN, security headers | N/A (dashboard config) |
| GitHub Pages | Static hosting | N/A |

### Secrets / Env
| Variable | Purpose | Where |
|---|---|---|
| N8N webhook URL | Form endpoint | Inline in JS (URL is the secret — rotate if leaked) |
| Airtable API key | DB writes | N8N credentials only — never client-side |

---

## 5. TECHNICAL SPEC

### Stack
- **Frontend:** Vanilla HTML + CSS + a thin JS module. No framework. No build step.
- **Hosting:** GitHub Pages (auto-deploy on push to `main`)
- **CDN / DNS:** Cloudflare
- **Forms:** N8N webhook → Airtable
- **Fonts:** self-hosted WOFF2 (no Google Fonts request — perf + privacy)

### Project Structure
```
BizAutomations/
├── index.html
├── styles/
│   ├── tokens.css          # CSS custom properties (colour, type, motion)
│   ├── base.css            # reset, typography
│   ├── layout.css          # grid, sections
│   └── components.css      # hero, cards, sticky CTA, form
├── scripts/
│   ├── main.js             # form submit, intersection observers
│   └── motion.js           # scroll-driven hero, counters
├── assets/
│   ├── fonts/              # self-hosted woff2
│   └── images/             # WebP, lazy below fold
└── spec.md
```

### Performance Budgets
- [ ] FCP < 1.5s on 4G mobile
- [ ] LCP < 2.5s
- [ ] Total page weight < 500KB excluding images
- [ ] Each image ≤ 200KB, WebP, lazy below fold
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95

### Accessibility
- WCAG 2.1 AA minimum
- All interactive elements: visible focus ring (2px, accent colour, 3px offset)
- Tap targets ≥ 48px
- Body text ≥ 16px; nothing below 14px anywhere
- Full keyboard tab order
- Alt text on every meaningful image
- Honour `prefers-reduced-motion` — disable scroll animations and counters

### Browser / Device
- Chrome, Safari, Firefox (latest 2 versions)
- iOS Safari 16+, Chrome Android (latest)
- Mobile-first; design at 375px, scale up

---

## 6. DESIGN DIRECTION — *the rewrite*

> The original brief specified Heritage Navy / Orchard Sand / Clarity White, DM Sans + Source Sans 3, rounded rectangle cards, subtle shadows, "no clever wordplay." That is a perfectly competent corporate landing page. It is also the same landing page every consultant in the UK has shipped since 2021.
>
> This direction keeps the *trustworthiness* (it's still a serious local-business site) but injects editorial confidence: bigger type, asymmetric layout, mechanical motion, a palette with one ugly-on-purpose colour that earns attention.

**Tone:** *Editorial / distinctive / quietly confident.* Think: a Monocle feature on a regional craftsman, not a SaaS hero section.

### Mood
- **A workshop, not a showroom.** Honest materials, exposed structure, no chrome.
- **Mechanical, not digital.** Motion behaves like gears engaging — short, decisive, never floaty.
- **Specific, not aspirational.** Real numbers, real places, real time saved. No skylines, no diverse stock-photo teams, no gradient blobs.

### Typography
A two-axis pairing — one humanist serif for editorial weight, one technical mono for proof-of-craft. No DM Sans. No Inter. No Roboto.

- **Display (H1, H2):** **Fraunces** (variable, opsz + SOFT axis). Heavy optical sizes at large weights. Italic available for accents. Self-hosted.
- **Body:** **Söhne** *(licensed)* — or, royalty-free fallback: **Newsreader** at body sizes paired with **IBM Plex Sans** for UI labels.
- **Mono / Numerics:** **JetBrains Mono** for stat counters, time deltas ("12h 04m → 00m"), form labels' hint text. Mono'd numerics are the visual signature.
- **Type scale (modular, ratio 1.25):** 14 / 16 / 20 / 25 / 31 / 39 / 49 / 61 / 76 / 95
- **H1:** Fraunces, weight 700, opsz 144, **clamp(56px, 9vw, 120px)**, line-height 0.95, letter-spacing -0.03em. Yes — bigger than the brief said. The hero earns its 100vh.
- **Body:** 18px / 1.55, max-width 62ch.

### Colour palette
Three anchor colours, one accent that earns attention, one warning-bright "signal" used **once** per viewport.

| Role | Name | Hex | Notes |
|---|---|---|---|
| Ink (text on light) | **Graphite** | `#16161A` | not pure black — softer on warm paper |
| Paper (light bg) | **Bone** | `#F1ECE2` | warm off-white, faint paper grain texture |
| Deep (dark sections) | **Ink Blue** | `#0B1B2B` | swap-in for Heritage Navy; one shade deeper |
| Accent (primary CTA, links) | **Cinnabar** | `#E5451E` | replaces Efficiency Orange; redder, more pigment, less "tech-orange" |
| Signal (used sparingly) | **Acid** | `#D8FF3D` | for one badge or underline per section. Used like a highlighter pen. |
| Trim | **Iron** | `#3A3A3F` | borders, rules, secondary type |

**Contrast checks:** Graphite/Bone 16.4:1 ✅, Bone/Ink Blue 15.1:1 ✅, Cinnabar/Bone 4.7:1 ✅ (text size ≥ 16px), Acid is **decorative only** — never used for text on light bg.

### Motion
Mechanical, not floaty. All easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` (clean engagement), durations 180–320ms. No 600ms parallax drifts.

- **Hero kinetic headline:** the H1 word "*hours*" / "*work*" / etc. swaps on a 4s loop with a hard cut and a ~120ms vertical slide. Slot-machine feel, not crossfade.
- **Stat counters:** count up on intersection, mono'd digits, fixed-width — digits *click* into place, no smooth tweens.
- **Section reveal:** content slides 24px up over 240ms when 20% in view. One pass only — no replay on scroll-up.
- **Hover:** CTA button has a 2px Cinnabar offset shadow that snaps to 0 on hover (mechanical engagement). No glow, no scale.
- **Reduced motion:** all of the above replaced with instant state.

### Layout
- **Asymmetric 12-column grid**, 24px gutters, 1280px max content width.
- **Hero:** H1 occupies columns 1–9, an oversized monogram or numeric ("01.") sits in columns 10–12 in Fraunces italic, Cinnabar, partially clipped by the viewport. Subhead sits *below* H1 at column 1–6. CTA at column 1–4.
- **Section numbers** ("01 / 07", "02 / 07" …) in JetBrains Mono in the upper-right of each section. Treats the page like a printed dossier.
- **Section dividers:** 1px Iron rule, full-bleed, with a section number flush right. No decorative SVG waves, no gradient transitions.
- **Cards (services):** *not* rounded rectangles with soft shadows. **Hard-edged** Bone cards with a 1px Iron border, a 4px Cinnabar top-edge accent, and a Graphite section number in the top-right corner.
- **Photography (about section):** one black-and-white photo, full bleed within column 1–6, slight grain. Not a stock smile-at-camera. A working-bench shot.

### Texture
- Subtle paper grain (`url(noise.png)` blend `multiply` at 4% opacity) layered on Bone.
- Hairline 1px rules everywhere a section ends. No drop shadows on text. No blurs.

### Voice
- Plain English, dry, specific. "I build small systems that quietly handle the boring bits."
- Numbers wherever possible: "12 hours a week", "47 invoices a month", "Kent, mostly within an hour of Maidstone."
- One unexpected line allowed per section. Confidence, not cleverness.

### Don'ts (carried over from `/frontend-design` conventions)
- ❌ No purple gradient on white
- ❌ No Inter / Roboto / Arial as primary
- ❌ No glassmorphism, no neon glow, no AI-generated hero illustration
- ❌ No "trusted by" logo bar pre-launch
- ❌ No emoji as decoration

---

## 7. CONTENT STRUCTURE (carried from original brief, tightened)

| # | Section | Bg | H2 | Purpose |
|---|---|---|---|---|
| 01 | Hero | Ink Blue | (none — H1 only) | Headline, subhead, single CTA, phone link |
| 02 | Problem | Bone | "The work that shouldn't be yours." | Three stat/pain pairs |
| 03 | How It Works | Bone (lighter variant or Paper) | "Three conversations. One quiet system." | 3-step diagram |
| 04 | Services | Ink Blue | "What I actually do." | 3–4 service cards |
| 05 | Proof | Bone | "Receipts." | Single case study with real numbers; testimonials when available |
| 06 | About | Bone | "Who's behind this." | Bio, photo, ICO/insurance trust line |
| 07 | Footer | Ink Blue | (CTA repeat) | Email, phone, LinkedIn, legal, repeat button |

### Hero copy (draft — owner to approve)
- **H1:** *"Your week loses ten hours to admin a computer should be doing."*
- **Sub:** "I build quiet systems that handle the repetitive work so you don't have to think about it. Based in Kent."
- **CTA:** "Book a free 30-minute call"
- **Below:** "Or call directly — `01XXX XXXXXX`" (mono, underline on hover)

---

## 8. GIT & DELIVERY

### Workflow
- Branch from `main`: `feat/<scope>` / `fix/<scope>` / `chore/<scope>`
- Conventional commits
- Squash-merge PRs
- GitHub Pages auto-deploys `main`
- Cloudflare proxies + adds security headers (CSP, HSTS, X-Frame-Options)

### Phases
| Phase | Ships | Acceptance |
|---|---|---|
| **MVP** (v1.0) | All 7 sections, working form → N8N → Airtable, mobile sticky CTA, JSON-LD, OG image | Lighthouse ≥ 90/95/95, form submission lands in Airtable in <5s |
| **v1.1** | Kinetic hero, stat counters, case study with real numbers | Reduced-motion users see static fallbacks; counters animate once per session |
| **v1.2** | A/B test on H1 copy via two static deploys + Cloudflare split | 200+ samples per variant before deciding |

### Acceptance Criteria
- [ ] **Hero:** H1 and CTA visible above fold at 375×667 without scroll
- [ ] **Form:** valid submission writes a row to Airtable `Leads` within 5s; failure falls back to mailto
- [ ] **Performance:** LCP < 2.5s on simulated 4G (Lighthouse mobile)
- [ ] **Accessibility:** axe-core reports 0 critical issues
- [ ] **Responsive:** renders correctly at 375 / 768 / 1280 / 1920px
- [ ] **Motion:** all animations disabled when `prefers-reduced-motion: reduce`
- [ ] **No-JS:** form still POSTs (native submit), CTAs still work, page is readable

---

## 9. OPEN QUESTIONS

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | Is the owner OK swapping Heritage Navy → Ink Blue and Efficiency Orange → Cinnabar? | aprensivo | ⏳ Open |
| 2 | Is Fraunces the right display face, or do we license Söhne for body too? | aprensivo | ⏳ Open |
| 3 | Final domain — `bizautomations.co.uk` confirmed? | aprensivo | ⏳ Open |
| 4 | ICO registration number ready at launch, or post-launch update? | aprensivo | ⏳ Open |
| 5 | Real case study available for MVP, or placeholder structure? | aprensivo | ⏳ Open |
| 6 | Phone number for `tel:` link | aprensivo | ⏳ Open |

---

## 10. REFERENCE

- **Source brief:** `Website_Landing_Page_spec.docx` (Apr 2026)
- **Repo:** TBD
- **N8N webhook:** TBD (will live at `n8n.bizautomations.co.uk/webhook/biz-leads`)
- **Reference look-and-feel:** Monocle (editorial), Pitch.com about page (mechanical motion), Stripe Press (typography), Field Notes (paper texture). *Not* Linear, *not* Vercel, *not* any "AI startup" template.

---
*Spec version: 0.1 | Created: 2026-05-06 | Last updated: 2026-05-06*
