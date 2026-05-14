# Sparkline Labs Website — Audit, Copy Deck & Execution Plan (v2)

**Site:** `sparklinelabs.co.zw` (Next.js 16 App Router, Tailwind v4, shadcn/ui)
**Purpose of this doc:** Working document — paste-ready copy, metadata, and structural changes. Not strategy theatre.

---

## 0. Operating principles for the rewrite

Every line of copy on this site must do one of three things: prove competence, narrow the buyer, or move them toward WhatsApp/email. If a sentence does none of those, cut it.

The voice is **execution-focused, declarative, specific to Zimbabwe**. No aspirational filler. No "we obsess over your success." Active verbs, concrete timelines, named tools. If a competitor in Berlin could ship the same line word-for-word, rewrite it.

"Lively" in this document means: content that updates, status badges that change, CTAs that connect to humans within hours, case studies that get added when projects close. It does **not** mean animation. Make sure the correct schema.og structured data is applied everywhere, page, etc

---

## 1. The brutal audit — short version

The credibility leaks anyone clicking through will find within five minutes:

DataPulse and LaunchKit don't exist. Both have `href="#"`. Both have stock-style placeholder images. In a low-trust market this is fatal — once a buyer realises two of three "products" are imaginary, they assume the third is too. **Delete both. Replace the section with one real product plus an honest "in development" list.** Design implications in §3.

Two domains contradict each other in the codebase. `app/layout.tsx` says `sparklinelabs.co.zw`. `app/robots.ts` and `app/sitemap.ts` say `sparklinelabs.com`. The footer email is `hello@sparklinelabs.com`. Pick `.co.zw`, update everything to match, set the email up on Zoho or Google Workspace.

Placeholder verification codes are still in production: `"google-site-verification-code"`, `"yandex-verification-code"`, `"bing-verification-code"`. Either fill with real codes from each console, or delete the keys.

Every primary CTA is a dead button. "Start a Project", "Schedule a Call", "Explore Our Products", "View Services", "Build Faster", "See Your Data" — none of them have an `href` or `onClick`. A visitor who wants to hire you literally cannot.

Generic agency copy throughout. "Software that works as hard as you do." "We obsess over your success." "No surprises." None of this is defensible, falsifiable, or specific to Zimbabwe. Replace per §5.

Two more structural issues: no proof of work (zero case studies, zero client mentions, zero screenshots of real systems) and no content surface (no blog, no FAQ, no resources). Both fixed by Sanity + the first case study in §7 and §8.

---

## 2. The positioning sentence the whole site must defend

> **Sparkline Labs builds custom software for Zimbabwean and African businesses — operated manually first, automated second, sold on outcomes not retainers. We're the team behind Propertyzone.**

Every page on the site must be consistent with that sentence. If a section of copy contradicts it (e.g. talks about "growing your business at scale" without naming Africa, or quotes hourly rates), rewrite or cut.

---

## 3. Design issue — the products section is built for three, you have one

### The problem

`components/products.tsx` and `app/products/page.tsx` are both hardcoded to a 3-column / 3-section layout. If you delete DataPulse and LaunchKit and leave the file as-is, you'll have one card centred in a 3-col grid (looks under-built) or three cards with two duplicates (worse). Either way it screams "we don't have product market fit."

### The fix — single featured + honest pipeline

**Home page Products section** becomes a single full-width feature card (Propertyzone) with a status pill ("Live") and below it, a thin "currently building" list with neutral type and grey status pills. No fake screenshots, no fake CTAs.

Structurally:

```
[ Section header: "What we've built" ]

[ Full-width feature card: Propertyzone ]
  - Status pill: "● Live"
  - Logo, tagline, 1-line description
  - 3–4 features (real ones)
  - Real screenshot or live preview
  - Two CTAs: "Visit propzone.co.zw" (external) | "Read the case study" (/work/propertyzone)

[ Subsection header: "Currently in development" ]
[ Two thin rows, no images, no fake screenshots ]
  Row 1: Agency CRM — "○ Private beta, Q2 2026" — short description
  Row 2: WhatsApp Lead Router — "○ In design, Q3 2026" — short description
[ Note line: "We ship one product to live status before announcing the next." ]
```

This communicates three things simultaneously: we've shipped something real, we're not pretending about the rest, and we have a deliberate cadence (which is itself a credibility signal). When DataPulse becomes real, the row promotes into a feature card. No design rework needed — the layout scales.

Status pill colours: green (`--chart-2`) for Live, amber (`--chart-4`) for Private beta, grey (`--muted-foreground`) for In design. Use the existing OKLCH tokens.

**Products page (`/products`)** uses the same pattern but with full detail: Propertyzone gets a long-form treatment (similar to the current section design, just real), then the "In development" section, then a final CTA.

Full copy for both layouts in §5.5 and §6.

---

## 4. The site map — current vs. proposed

What the site has now:
- `/` — home
- `/products` — products page

What it needs:
- `/` — home (rewritten)
- `/products` — products page (rewritten, real content)
- `/work` — case studies index
- `/work/propertyzone` — flagship case study (first one to ship)
- `/blog` — blog index
- `/blog/[slug]` — blog post template
- `/studio` — Sanity studio (no public copy; route only)

Six public routes. All driven from Sanity except `/` and `/studio` themselves. Team page and contact page are explicitly deferred — for now, contact is a WhatsApp deep link, about-the-company narrative sits inline on the home page.

---

## 5. Home page — paste-ready copy, component by component

### 5.1 `components/header.tsx`

Nav unchanged in structure. CTA button now functional.

```
Logo: sparkline labs
Nav:  Services · Products · Work · Blog
CTA:  "Book a call" → https://wa.me/263XXXXXXXXX?text=Hi%20Sparkline%2C%20I%27d%20like%20to%20discuss%20a%20project
```

Replace the "Start a Project" button text with `Book a call` and wire the WhatsApp deep link. Add `Work` and `Blog` links to the nav once those routes exist. Update both desktop and mobile nav.

> Replace `+263XXXXXXXXX` with the actual receiving number. Use a founder's number or register a dedicated WhatsApp Business number. Don't ship with the placeholder.

### 5.2 `components/hero.tsx`

**Current copy (delete entirely):**

> Software that works as hard as you do
> Your vision, built to perform
> Custom software and powerful SaaS tools that help you move faster, serve better, and scale without limits.
> [Start a Project] [Explore Our Products]

**New copy:**

```
PRE-HEADLINE:  Software development — Harare, Zimbabwe

H1:            We build the software African
               businesses actually use.

SUBHEAD:       We're the team behind Propertyzone. We build custom platforms,
               internal tools, and SaaS products for businesses operating in real
               Zimbabwean conditions — USD pricing, WhatsApp-first customers,
               ZESA-tolerant architecture, Paynow on the rails.

PRIMARY CTA:   Book a call           → wa.me link
SECONDARY CTA: See Propertyzone live → https://propzone.co.zw
```

Why each line earns its place:

The pre-headline geo-tags you. Google sees "Harare, Zimbabwe" and slightly biases local rankings; humans clock you as local (a trust signal for Zimbabwean buyers, a transparency signal for foreign ones).

The H1 names the market explicitly and makes a defensible claim — "actually use" implies you've shipped something with users, which the next line then proves.

The subhead does four things at once: claims credibility (Propertyzone), names what you build (custom platforms, internal tools, SaaS), and lists four specific local realities that signal market knowledge (USD pricing, WhatsApp, ZESA, Paynow). No competitor in Berlin can copy this paragraph without lying.

The primary CTA leads to WhatsApp because the Zimbabwean B2B buying motion runs on WhatsApp. Forms have lower conversion locally. The secondary CTA is the Propertyzone backlink — do-follow, contextual, anchor text "See Propertyzone live".

### 5.3 `components/problem.tsx`

**Current copy (delete):**

> The reality
> Great ideas deserve great execution
> You need software that delivers. Not promises. Not delays. Just results that move your business forward.

**New copy:**

```
PRE-HEADLINE:  The reality

H2:            Most software sold into Zimbabwe
               doesn't fit Zimbabwe.

BODY:          Foreign SaaS breaks on local payment rails, assumes 24/7 power,
               and prices in currencies your customers don't hold. Local builds
               often ship without a roadmap and stall after launch — leaving
               you with code nobody can extend.

               We build for the conditions that actually exist on the ground:
               USD pricing, WhatsApp as a primary channel, offline-tolerant
               flows, and operators who need to run the system manually before
               it ever sees automation.
```

Keep the existing image on the right (`abstract-minimal-black-and-white-geometric-shapes-.jpg`) — it's the one abstract asset on the site that works. Don't swap.

### 5.4 `components/services.tsx`

**Current copy (delete):**

> Custom Development — Web apps and platforms built exactly for your workflow.
> System Integration — Connect your tools. Automate everything.
> Technical Strategy — Expert guidance on architecture and scaling.

**New copy:**

```
PRE-HEADLINE:  Services
H2:            What we build

CARD 1
Title: Custom platforms
Body:  End-to-end web platforms and internal tools. Built on Next.js,
       TypeScript, and the same stack that runs Propertyzone in production.

CARD 2
Title: Integrations & automation
Body:  WhatsApp, Paynow, EcoCash, Google Workspace, your CRM, your sheets.
       We wire the workflows already running your business so they stop
       running on copy-paste.

CARD 3
Title: Technical strategy
Body:  Stuck between vendor pitches and engineering quotes? We deliver
       architecture, a roadmap, and a build proposal — flat fee, two-week
       turnaround.
```

Keep the Tailwind classes and image references on the cards; just replace the strings.

### 5.5 `components/products.tsx` — full redesign

**Replace the entire component.** Don't try to patch the 3-card grid. The layout change is in §3; here's the copy.

```
PRE-HEADLINE:  What we've built
H2:            One product live. More on the way.

╔═══════════════════════════════════════════════════════════════════╗
║  FEATURE CARD — full width                                        ║
╠═══════════════════════════════════════════════════════════════════╣
║  Status pill:   ● Live                                            ║
║                                                                   ║
║  Product name:  Propertyzone                                      ║
║                                                                   ║
║  Tagline:       Zimbabwe's intent-first property platform         ║
║                                                                   ║
║  Description:   A property listing and lead management platform   ║
║                 for verified buyers, renters, agents, and         ║
║                 landlords. Built around intent — not just         ║
║                 impressions.                                      ║
║                                                                   ║
║  Features:      • Intent-tagged listings (buy / rent / invest)    ║
║                 • Verified buyer & renter profiles                ║
║                 • Direct WhatsApp-routed enquiries                ║
║                 • Suburb-level content depth (Pamusha)            ║
║                                                                   ║
║  CTAs:          [ Visit propzone.co.zw → ]                        ║
║                 [ Read the case study → ]                         ║
╚═══════════════════════════════════════════════════════════════════╝

[ DIVIDER ]

SUBSECTION:    Currently in development

ROW 1
Pill:          ○ Private beta · Q2 2026
Name:          Agency CRM
Body:          A CRM built around how Zimbabwean agencies actually work:
               WhatsApp-first lead handling, USD/ZWL dual pricing,
               manual-first workflows that agents can run before automating.

ROW 2
Pill:          ○ In design · Q3 2026
Name:          WhatsApp Lead Router
Body:          A routing layer that takes inbound WhatsApp enquiries from
               Propertyzone (and any portal that adds it) and assigns them
               to agents based on suburb, listing ref, and response SLA.

FOOTER NOTE:   We ship one product to live status before announcing the
               next. No vapourware.
```

The "no vapourware" line does real positioning work — it puts you against the typical Zimbabwean software pitch ("we can build anything!") and reinforces execution-first as a brand promise. Don't soften it.

### 5.6 `components/process.tsx`

**Current copy (delete):**

> Listen → understand your goals
> Plan → clear roadmap
> Build → weekly progress
> Launch → ship and iterate

**New copy:**

```
PRE-HEADLINE:  How we work
H2:            Four stages. No retainers. No scope theatre.

01  Discovery (paid, 1 week)
    A scoping call, a written brief, a 1-page architecture diagram,
    and a fixed-price build proposal. You leave week one with a yes/no
    decision — not a follow-up "next steps" deck.

02  Pilot (2 weeks, fixed price)
    We build the riskiest slice first. If the pilot doesn't validate
    the approach, we stop — and you keep everything we built, no
    cancellation fee.

03  Build (4–8 weeks, fixed price)
    Weekly demo. Weekly progress note. Fixed scope, fixed price,
    fixed timeline. Scope changes get re-quoted, not absorbed.

04  Handover & operate
    We train your team to run the system manually first. We automate
    after we've seen the workflow run for real, with real data,
    in your hands.
```

The "paid discovery" line is important. It filters out tyre-kickers immediately (a Zimbabwean-market necessity given how many "let's chat" calls go nowhere), and signals that you value your time — which raises perceived value of the whole engagement.

### 5.7 `components/why-sparkline.tsx`

**Current copy (delete):**

> Speed Without Sacrifice — Ship faster without cutting corners on quality.
> Built to Last — Scalable architecture that grows with you.
> Your Team, Extended — We work alongside you, not in a silo.
> No Surprises — Transparent timelines. Clear communication.

**New copy:**

```
PRE-HEADLINE:  Why Sparkline
H2:            We built Propertyzone. Now we build for you.

LEAD:    We don't sell retainers. We sell outcomes — a defined deliverable
         for a fixed price, on a fixed timeline. That's the same commercial
         model we use for Propertyzone, and it's the only one we offer
         clients.

CARD 1 — icon: Zap
Title: Outcome-tied pricing
Body:  Flat fee per deliverable. No hourly bills, no scope creep,
       no "discovery extension" invoices.

CARD 2 — icon: Shield
Title: Manual-first design
Body:  We run the workflow manually with you before we automate it.
       Saves you money. Stops you automating the wrong thing.

CARD 3 — icon: Users
Title: Zimbabwe-native stack
Body:  USD billing, WhatsApp routing, Paynow / EcoCash integration,
       ZESA-tolerant architecture. Each one shipped in production.

CARD 4 — icon: Clock
Title: Founder-led delivery
Body:  Code is written by the founders. No offshoring. No agency
       middlemen. You talk to the people building it.
```

The lead paragraph contains a contextual "Propertyzone" mention — second backlink on the home page (the first is the hero secondary CTA). Wrap "Propertyzone" in an anchor link to `https://propzone.co.zw`.

### 5.8 `components/cta.tsx`

**Current copy (delete):**

> Ready to build something great?
> No pitch decks. No pressure. Just a real conversation about your goals.
> [Schedule a Call]

**New copy:**

```
H2:    Got a project? Let's talk on WhatsApp.

BODY:  Send a message describing what you want built. We respond within
       two working hours during weekdays (Harare time) with whether it's
       a fit and what the next step is. No pitch deck. No discovery call
       until we've both decided it's worth one.

CTA:   Start on WhatsApp → wa.me link
```

The "two working hours" line is a hard public commitment. If you can't keep it, change it to "within one working day" before publishing. Public SLAs you miss damage you more than no SLA at all.

The reason WhatsApp and not email: lower friction for Zimbabwean buyers, faster sales cycle, and the conversation history stays with you (unlike a contact form which often dies in a CMS).

### 5.9 `components/footer.tsx`

**Current copy (delete):**

> sparkline labs
> Services · Products · Process · hello@sparklinelabs.com

**New copy:**

```
LEFT COLUMN
  Logo + name: sparkline labs
  Tagline:     Software for African businesses.

COLUMN 1 — Company
  Services
  Products
  Work
  Blog

COLUMN 2 — Contact
  WhatsApp: +263 XX XXX XXXX     ← wa.me link
  Email:    sales@sparklinelabs.co.zw

BOTTOM ROW
  © 2026 Sparkline Labs.
  We built Propertyzone.          ← anchor link to https://propzone.co.zw
  All rights reserved.
```

The "We built Propertyzone" footer line is the site-wide backlink (every indexed page passes it). Keep the anchor text exactly that — short, brand-named, do-follow.

### 5.10 Home page — what to add that isn't in the components today

Two strips between WhySparkline and the CTA section:

**Latest writing strip.** Three latest blog posts pulled from Sanity. Small cards with title, date, excerpt. The point is to put a visible "this site was updated recently" timestamp in front of the visitor. Empty-state copy if Sanity has no posts: *"First post lands this week."* Don't ship that empty state for more than seven days.

**Selected work strip.** Case study cards pulled from Sanity, ordered by `publishedAt desc`. Probably one card at launch (Propertyzone). Show it big rather than padding with placeholders. Each card: image + title + outcome line (e.g. *"From zero to X agencies in Y months"*) + "Read case study" link.

Both strips are pure Sanity fetches in server components with `revalidate: 300`.

Copy for each strip header:

```
LATEST WRITING STRIP
Pre-headline:  Latest writing
H2:            What we've been figuring out.
Link:          See all posts → /blog

SELECTED WORK STRIP
Pre-headline:  Selected work
H2:            Things we've shipped.
Link:          See all work → /work
```

---

## 6. Products page (`/products`) — paste-ready copy

The page restructure: drop the 3-section alternating layout. Lead with a tight hero, then one long Propertyzone feature, then "In development", then the bottom CTA.

### 6.1 Page hero

**Current copy (delete):**

> Our Products
> Tools we built. Problems we solved.
> We don't just build for clients. We create products that address real pain points we've experienced ourselves.

**New copy:**

```
PRE-HEADLINE:  Products

H1:            One product live.
               Two in active development.

SUBHEAD:       We build products in the same domains we build for clients —
               property, payments, and pipeline-heavy workflows. Our
               flagship is Propertyzone. Everything else is still in the
               kitchen, and we'll tell you exactly where it is on the menu.
```

### 6.2 Propertyzone featured section

```
STATUS PILL:    ● Live · launched 2025
PRODUCT NAME:   Propertyzone
URL:            propzone.co.zw          ← anchor link, do-follow
TAGLINE:        Zimbabwe's intent-first property platform.

DESCRIPTION:
    Propertyzone is a property listing and lead management platform that
    connects verified buyers, renters, agents, and landlords. Built around
    intent — not just impressions. Every enquiry carries a "what are you
    here to do" signal so agents stop drowning in unqualified leads.

WHAT IT DOES:
    • Intent-tagged listings — buy, rent, invest, viewing-only.
    • Verified buyer and renter profiles, reducing time-waster enquiries.
    • Direct agent–client messaging routed to WhatsApp.
    • Lead qualification and engagement tracking dashboards.
    • Suburb-level content depth (Pamusha — Where to Live) with
      neighbourhood reviews, school proximity, security info, and a
      growing real estate glossary.
    • SEO-optimised listing pages with JSON-LD, OG image generation,
      and structured data for buy/rent intent.

WHO IT'S FOR:
    EAC-registered real estate agencies in Zimbabwe, with active
    expansion to Nigeria. Property seekers searching for honest,
    detail-rich listings instead of stock photos and missing addresses.

CTAs:
    [ Visit propzone.co.zw → ]            (external, do-follow)
    [ Read the full case study → ]        (/work/propertyzone)
```

The `propzone.co.zw` URL at the top is a second anchor on this page — intentional, not over-linking, because the two anchors serve different purposes (header credential vs. body CTA).

### 6.3 In development section

```
SECTION HEADER:    Currently in development

ROW 1
Status pill:       ○ Private beta · Q2 2026
Name:              Agency CRM
Description:       A CRM built around how Zimbabwean agencies actually
                   work. WhatsApp-first lead handling, USD/ZWL dual pricing,
                   manual-first workflows that agents can run before automating.
                   Currently in closed beta with 3 agencies.
CTA:               [ Request beta access → ]  (WhatsApp deep link, prefilled)

ROW 2
Status pill:       ○ In design · Q3 2026
Name:              WhatsApp Lead Router
Description:       A routing layer that takes inbound WhatsApp enquiries —
                   from Propertyzone or any portal that integrates it —
                   and auto-assigns them to agents based on suburb,
                   listing reference number, and response SLA.
CTA:               [ Get notified at launch → ]  (WhatsApp deep link)

FOOTER NOTE:       We ship one product to live status before announcing the
                   next. No vapourware.
```

### 6.4 Bottom CTA on products page

**Current copy (delete):**

> Need something custom?
> Our products are great. But sometimes you need something built just for you. Let's talk.

**New copy:**

```
H2:        Need something we haven't built yet?

BODY:      Most of our revenue comes from custom builds — internal tools,
           SaaS MVPs, and platform work for businesses that need something
           specific. If you've got a project, send us a WhatsApp message
           and we'll come back within two working hours.

CTA 1:     Start on WhatsApp →
CTA 2:     See how we work →    (anchor link to /#process)
```

---

## 7. Propertyzone case study — `/work/propertyzone` full copy

This is the highest-equity page on the site. It carries the most Propertyzone backlinks, it's the deepest proof-of-work artefact, and it's what someone serious about hiring you will read before booking the call.

```
URL:           /work/propertyzone
Layout:        Single column, max ~720px reading width, plus full-width hero
```

### Hero

```
PRE-HEADLINE:  Case study

H1:            Building Propertyzone — Zimbabwe's
               intent-first property platform.

SUBHEAD:       What we built, what it cost, what we learned, and
               what's next.

META LINE:     Published [date] · Reading time ~6 min ·
               Status: ● Live in production

HERO IMAGE:    Real screenshot of the Propertyzone listings page on
               mobile (where most traffic lives).
```

### Section 1 — The problem

```
H2:            The problem

BODY:
    By late 2024, the two dominant property portals in Zimbabwe —
    Propertybook.co.zw and property.co.zw — had captured most of the
    listing inventory but were optimised for impressions, not intent.
    Agents got dozens of enquiries a day, most of them from people
    who weren't actually buying or renting. Time-wasters.

    Three problems compounded:

    1. No intent signal on enquiries. An agent couldn't tell, before
       responding, whether the lead was a serious buyer with budget
       or a window-shopper.

    2. Listings were thin. Stock photos, missing addresses, no
       suburb-level context, no school proximity, no borehole status —
       all the things a Zimbabwean buyer actually cares about.

    3. Agencies were paying flat monthly listing fees regardless of
       whether they got a single qualified lead.

    We weren't trying to replace the incumbents. We were trying to
    give agents a third channel that solved the intent and qualification
    problem — and a pricing model where they paid for outcomes, not
    impressions.
```

### Section 2 — What we built

```
H2:            What we built

BODY:
    Propertyzone shipped to production in 2025, built on Next.js App
    Router, TypeScript, Tailwind CSS, shadcn/ui, Clerk for auth, and
    React Hook Form + Zod for form handling. The full stack is
    deliberately boring and operator-friendly: no exotic frameworks,
    no fragile dependencies, easy to extend.

    The core components:

    Intent-tagged listings.
    Every enquiry on Propertyzone carries an intent flag — buy, rent,
    invest, or viewing-only. Agents see the intent before they respond,
    so they can prioritise their pipeline instead of triaging it.

    Verified buyer and renter profiles.
    Users sign up before enquiring. Phone, email, and a verified
    location reduce the volume of throwaway enquiries dramatically.

    WhatsApp-routed messaging.
    Every direct enquiry routes to the agent's WhatsApp with the
    listing reference, intent tag, and qualification data already in
    the message. The agent never has to ask "which property?" on
    their first reply.

    Where to Live (Pamusha).
    Suburb-level content depth — neighbourhood reviews covering
    security, schools, water reliability, ZESA reliability, distance
    to CBD, and amenities. Plus an 80-plus term Zimbabwe real estate
    glossary with alphabet navigation, JSON-LD structured data, and
    client-side search. This is the SEO content moat — incumbents
    have inventory, we have depth.

    Performance.
    The mobile PageSpeed score moved meaningfully across both the
    listings and property detail pages. LCP optimisation on the hero,
    Cloudflare caching, GTM lazy-loading, dynamic imports on
    everything below the fold.

    Outcome-tied commercials.
    Agencies don't pay a monthly fee. They pay for verified leads, or
    they get a "free until 10 verified leads" runway during onboarding.
    The pricing matches the value.
```

### Section 3 — Outcomes

```
H2:            Outcomes

BODY (template — fill in real numbers when publishing):

    • X EAC-registered agencies live on the platform
    • Y verified listings published
    • Z verified buyer / renter accounts
    • Mobile PageSpeed score: from A → B
    • Average time from listing publication to first qualified lead:
      [number]

    What we learned: agencies don't sign up to portals — they get
    onboarded by humans. The "free until 10 verified leads" model
    works only when paired with manual listing upload on the
    agency's behalf during weeks 1–2. The friction of "publish your
    listings yourself" is what kills most onboarding.
```

Ship even with rough numbers. A case study with imprecise but real metrics beats a perfectly written case study with no numbers.

### Section 4 — What's next

```
H2:            What's next

BODY:
    Expansion to Nigeria is in scoping — a market with similar
    structural problems (impression-optimised portals, low buyer
    intent signal) at roughly 20× the addressable inventory.

    On the platform itself: the Agency CRM (Q2 2026) and the
    WhatsApp Lead Router (Q3 2026) are both built to interoperate
    with Propertyzone, turning the portal into a lead engine for
    agencies running their own pipelines.

    Propertyzone is live and accepting agency partners now.
    Visit propzone.co.zw to see active listings or to apply
    as an agency.
```

The closing line is the strongest in-content backlink on the entire site — long-form context, contextual anchor, do-follow.

### Section 5 — Tech and team

```
H2:            Tech and team

STACK:    Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui,
          Clerk, React Hook Form, Zod, Sanity, pnpm, Vercel + Cloudflare.
TEAM:     Sparkline Labs founders (product strategy + frontend,
          backend infrastructure, financial & legal).
STARTED:  2024
LIVE:     2025
```

### Section 6 — End-of-case CTA

```
H2:    Want this for your business?

BODY:  We build platforms like Propertyzone for clients with
       category-specific problems. Property, payments, logistics,
       service businesses with pipeline-heavy workflows. Two-week
       paid discovery. Outcome-tied pricing. Zero retainers.

CTA:   Book a call on WhatsApp →
```

---

## 8. Blog — index page and first six posts

### 8.1 Blog index page (`/blog`)

```
PRE-HEADLINE:  Notes
H1:            Notes from building software in Zimbabwe.

SUBHEAD:       What we've learned shipping Propertyzone and custom
               builds — payment rails, WhatsApp as infrastructure,
               offline-tolerant architecture, and the commercial
               models that work for African SMEs.

[ List of posts, newest first, from Sanity ]
[ Each post: title, excerpt, date, reading time, tags ]
```

### 8.2 The first six posts to publish

One per week. Working titles and target queries:

| # | Working title | Target query |
|---|--------------|--------------|
| 1 | How we built USD pricing into Propertyzone's listings (and why it matters in Zimbabwe) | *USD pricing SaaS Zimbabwe* / *USD billing African SaaS* |
| 2 | WhatsApp as a CRM channel: what we learned from Propertyzone's lead flow | *WhatsApp CRM Zimbabwe* / *WhatsApp lead management business* |
| 3 | Building for ZESA load-shedding: offline-first patterns we use in production | *offline-first web app Zimbabwe* / *PWA load shedding* |
| 4 | Paynow vs. Stripe vs. Flutterwave: what we recommend for Zimbabwean SaaS | *Paynow integration developer* / *payment gateway Zimbabwe comparison* |
| 5 | Why we sell on outcomes, not retainers — and how it works for African SMEs | *outcome based pricing software Zimbabwe* / *fixed price software development* |
| 6 | The real estate tech stack for African markets in 2026 | *real estate platform Zimbabwe* / *proptech Africa* |

Each post must contain at least one contextual `propzone.co.zw` backlink with varied anchor text. Each post must end with a "Want this built for your business?" inline CTA linking to WhatsApp.

### 8.3 Blog post template structure

```
URL:           /blog/[slug]
Layout:        Single column, max-width ~720px reading width
Required:      H1, author byline, published date, reading time, tags,
               hero image (or no image — text is fine), body, related
               posts, end-of-post CTA
SEO:           Article JSON-LD, OG image (Satori-generated), canonical URL
```

End-of-post CTA copy (same on every post):

```
H3:     Building something like this?
Body:   We build platforms, internal tools, and integrations for
        Zimbabwean and African businesses. Outcome-tied pricing,
        two-week paid discovery.
CTA:    Start on WhatsApp →
```

---

## 9. SEO metadata — paste-ready Next.js Metadata objects

### 9.1 Root layout (`app/layout.tsx`) — replace the existing `metadata` export

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://sparklinelabs.co.zw"),
  title: {
    default: "Sparkline Labs — Custom software for African businesses",
    template: "%s | Sparkline Labs",
  },
  description:
    "We build custom software, internal tools, and SaaS products for Zimbabwean and African businesses. Outcome-tied pricing, manual-first design. We built Propertyzone.",
  keywords: [
    "custom software development Zimbabwe",
    "software developer Harare",
    "Next.js developer Zimbabwe",
    "SaaS development Africa",
    "internal tools Zimbabwe",
    "Paynow integration developer",
    "WhatsApp integration Zimbabwe",
    "real estate platform Zimbabwe",
    "Propertyzone",
    "Sparkline Labs",
  ],
  authors: [{ name: "Sparkline Labs", url: "https://sparklinelabs.co.zw" }],
  creator: "Sparkline Labs",
  publisher: "Sparkline Labs",
  category: "Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_ZW",
    url: "https://sparklinelabs.co.zw",
    siteName: "Sparkline Labs",
    title: "Sparkline Labs — Custom software for African businesses",
    description:
      "We build custom software for Zimbabwean and African businesses. Outcome-tied pricing, manual-first design. We built Propertyzone.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sparkline Labs — Custom software for African businesses",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparkline Labs — Custom software for African businesses",
    description:
      "Custom software for Zimbabwean and African businesses. Outcome-tied pricing. We built Propertyzone.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://sparklinelabs.co.zw",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  applicationName: "Sparkline Labs",
  referrer: "origin-when-cross-origin",
};
```

Two key changes vs. current:
- Delete the entire `verification` block until you have real codes. Add them back after registering in each Search Console.
- Delete the `apple-mobile-web-app-capable` and `mobile-web-app-capable` legacy entries in `other` — both deprecated.

### 9.2 Home page (`app/page.tsx`)

```typescript
export const metadata: Metadata = {
  title: "Custom software for African businesses",
  description:
    "We build custom software, internal tools, and SaaS products for Zimbabwean and African businesses. Outcome-tied pricing, two-week paid discovery, zero retainers. We're the team behind Propertyzone.",
  alternates: { canonical: "https://sparklinelabs.co.zw" },
  openGraph: {
    title: "Sparkline Labs — Custom software for African businesses",
    description:
      "We build for Zimbabwean and African businesses. USD pricing, WhatsApp-first, Paynow on the rails. We built Propertyzone.",
    url: "https://sparklinelabs.co.zw",
  },
};
```

### 9.3 Products page (`app/products/page.tsx`)

```typescript
export const metadata: Metadata = {
  title: "Products",
  description:
    "Products we've built and run. Propertyzone is our flagship real estate platform — live in Zimbabwe. Two more products in active development.",
  keywords: [
    "Propertyzone",
    "real estate platform Zimbabwe",
    "property listing Zimbabwe",
    "agency CRM Zimbabwe",
    "WhatsApp lead routing",
    "Sparkline Labs products",
  ],
  alternates: { canonical: "https://sparklinelabs.co.zw/products" },
  openGraph: {
    title: "Products | Sparkline Labs",
    description:
      "Propertyzone is live. Agency CRM in private beta. WhatsApp Lead Router in design. No vapourware.",
    url: "https://sparklinelabs.co.zw/products",
  },
};
```

### 9.4 Work index (`app/work/page.tsx`)

```typescript
export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected case studies from Sparkline Labs. How we built Propertyzone, custom platforms, internal tools, and SaaS products for Zimbabwean and African businesses.",
  alternates: { canonical: "https://sparklinelabs.co.zw/work" },
  openGraph: {
    title: "Work | Sparkline Labs",
    description: "Case studies — how we ship software in Zimbabwe.",
    url: "https://sparklinelabs.co.zw/work",
  },
};
```

### 9.5 Propertyzone case study (`app/work/propertyzone/page.tsx`)

```typescript
export const metadata: Metadata = {
  title: "Propertyzone case study — Zimbabwe's intent-first property platform",
  description:
    "How we built Propertyzone — the property platform connecting verified buyers, renters, and agents in Zimbabwe. Tech stack, architecture, outcomes, lessons learned.",
  keywords: [
    "Propertyzone case study",
    "real estate platform development Zimbabwe",
    "Next.js property platform",
    "proptech Zimbabwe",
    "Sparkline Labs Propertyzone",
  ],
  alternates: { canonical: "https://sparklinelabs.co.zw/work/propertyzone" },
  openGraph: {
    title: "Propertyzone case study | Sparkline Labs",
    description:
      "We built Zimbabwe's intent-first property platform. Here's how, what it cost, and what's next.",
    url: "https://sparklinelabs.co.zw/work/propertyzone",
    type: "article",
    images: [
      {
        url: "/og-propertyzone-case-study.jpg",
        width: 1200,
        height: 630,
        alt: "Propertyzone case study",
      },
    ],
  },
};
```

Plus an `Article` JSON-LD block on this page:

```typescript
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Building Propertyzone — Zimbabwe's intent-first property platform",
  description:
    "A case study on building Propertyzone, the intent-first property platform serving Zimbabwean real estate agencies.",
  image: "https://sparklinelabs.co.zw/og-propertyzone-case-study.jpg",
  datePublished: "2026-XX-XX",
  dateModified: "2026-XX-XX",
  author: {
    "@type": "Organization",
    name: "Sparkline Labs",
    url: "https://sparklinelabs.co.zw",
  },
  publisher: {
    "@type": "Organization",
    name: "Sparkline Labs",
    logo: {
      "@type": "ImageObject",
      url: "https://sparklinelabs.co.zw/icon.svg",
    },
  },
  about: {
    "@type": "SoftwareApplication",
    name: "Propertyzone",
    url: "https://propzone.co.zw",
    applicationCategory: "BusinessApplication",
  },
};
```

The `about` block is a clean structured-data reference to Propertyzone — readable by Google's knowledge graph.

### 9.6 Blog index (`app/blog/page.tsx`)

```typescript
export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on building software in Zimbabwe — payment rails, WhatsApp as infrastructure, offline-tolerant architecture, commercial models for African SMEs.",
  alternates: { canonical: "https://sparklinelabs.co.zw/blog" },
  openGraph: {
    title: "Blog | Sparkline Labs",
    description:
      "Notes from building software in Zimbabwe — what works, what doesn't, and why.",
    url: "https://sparklinelabs.co.zw/blog",
  },
};
```

### 9.7 Blog post template (`app/blog/[slug]/page.tsx`)

Dynamic — pull from Sanity per post.

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await client.fetch(postBySlugQuery, { slug: params.slug });
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://sparklinelabs.co.zw/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://sparklinelabs.co.zw/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author?.name ?? "Sparkline Labs"],
      images: post.ogImage ? [{ url: post.ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}
```

### 9.8 `app/robots.ts` — replace entirely

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://sparklinelabs.co.zw";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio/", "/admin/", "/_next/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```

`/studio` is in `disallow`. The Sanity Studio is internal-only; it should never be indexed.

### 9.9 `app/sitemap.ts` — replace entirely

```typescript
import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { allPostSlugsQuery, allCaseStudySlugsQuery } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sparklinelabs.co.zw";
  const now = new Date();

  const [posts, caseStudies] = await Promise.all([
    client.fetch<{ slug: string; _updatedAt: string }[]>(allPostSlugsQuery),
    client.fetch<{ slug: string; _updatedAt: string }[]>(allCaseStudySlugsQuery),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  const caseStudyRoutes = caseStudies.map((c) => ({
    url: `${baseUrl}/work/${c.slug}`,
    lastModified: new Date(c._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseStudyRoutes, ...postRoutes];
}
```

Drop the product anchor entries from the current sitemap — they're not separate URLs and they polluted priority weighting.

---

## 10. Sanity CMS — three schemas, embedded studio

### 10.1 What's in Sanity

Three document types. No more for now.

**`product`**
- `name` (string)
- `slug` (slug from name)
- `tagline` (string, max 80 chars)
- `description` (text)
- `status` (string, enum: `live`, `private_beta`, `in_design`, `archived`)
- `statusDate` (string, e.g. "Q2 2026", "launched 2025")
- `href` (URL — external)
- `features` (array of strings, max 6)
- `coverImage` (image)
- `screenshot` (image)
- `order` (number, for sorting)
- `seo` (object: title, description, ogImage)

**`caseStudy`**
- `title` (string)
- `slug`
- `clientName` (string, nullable for own products)
- `industry` (string)
- `productRef` (reference to a `product`, optional)
- `heroImage` (image)
- `problem` (portable text)
- `solution` (portable text)
- `outcomes` (portable text)
- `techStack` (array of strings)
- `testimonialQuote` (text, nullable)
- `testimonialAuthor` (string, nullable)
- `publishedAt` (datetime)
- `seo` (object)

**`post`**
- `title`
- `slug`
- `excerpt` (text, ~160 chars)
- `body` (portable text)
- `author` (string, default "Sparkline Labs")
- `category` (string)
- `tags` (array of strings)
- `coverImage` (image, optional)
- `publishedAt` (datetime)
- `updatedAt` (datetime)
- `seo` (object)

### 10.2 Studio embed at `/studio`

```
Install:  pnpm add next-sanity @sanity/vision sanity @portabletext/react @sanity/image-url

Folder structure:

sanity/
  schemas/
    product.ts
    caseStudy.ts
    post.ts
    objects/seo.ts
    index.ts
  lib/
    client.ts
    queries.ts
    image.ts

sanity.config.ts

app/
  studio/
    [[...tool]]/
      page.tsx     ← Studio mounted here
```

Critical: in `sanity.config.ts` set `basePath: "/studio"`. The Studio is gated by Sanity's hosted login (Google + email) — no additional auth needed. Disallow `/studio` in robots (already in §9.8).

### 10.3 GROQ queries

In `sanity/lib/queries.ts`:

```typescript
export const allProductsQuery = `*[_type == "product"] | order(order asc) {
  _id, name, slug, tagline, description, status, statusDate,
  href, features, "coverImage": coverImage.asset->url,
  "screenshot": screenshot.asset->url
}`;

export const liveProductsQuery = `*[_type == "product" && status == "live"] | order(order asc) {
  _id, name, slug, tagline, description, status, statusDate,
  href, features, "screenshot": screenshot.asset->url
}`;

export const inDevelopmentProductsQuery = `*[_type == "product" && status in ["private_beta", "in_design"]] | order(order asc) {
  _id, name, status, statusDate, description, tagline
}`;

export const caseStudyBySlugQuery = `*[_type == "caseStudy" && slug.current == $slug][0] {
  ..., "heroImage": heroImage.asset->url, productRef->{name, slug, href}
}`;

export const allCaseStudiesQuery = `*[_type == "caseStudy"] | order(publishedAt desc) {
  title, slug, industry, clientName, "heroImage": heroImage.asset->url,
  publishedAt, productRef->{name, href}
}`;

export const allPostSlugsQuery = `*[_type == "post" && defined(slug.current)] {
  "slug": slug.current, _updatedAt
}`;

export const allCaseStudySlugsQuery = `*[_type == "caseStudy" && defined(slug.current)] {
  "slug": slug.current, _updatedAt
}`;

export const latestPostsQuery = `*[_type == "post"] | order(publishedAt desc)[0...3] {
  title, slug, excerpt, publishedAt, "coverImage": coverImage.asset->url
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  ..., "ogImage": seo.ogImage.asset->url
}`;
```

---

## 11. Propertyzone backlinks — final map

Across the proposed site, Propertyzone backlinks live in these locations. All do-follow. Anchor text varied per SEO best practice.

| Page | Location | Anchor text |
|------|----------|-------------|
| `/` | Hero secondary CTA | "See Propertyzone live" |
| `/` | WhySparkline lead paragraph | "Propertyzone" |
| `/` | Selected work card | "Propertyzone" (card title) |
| `/` | Footer (site-wide) | "We built Propertyzone." |
| `/products` | Propertyzone feature header URL line | "propzone.co.zw" |
| `/products` | Propertyzone feature CTA | "Visit propzone.co.zw" |
| `/work/propertyzone` | Multiple in-body | "Propertyzone", "propzone.co.zw", "apply as an agency" |
| `/work/propertyzone` | Final CTA | "Visit propzone.co.zw" |
| `/work/propertyzone` | Article schema `about` | structured-data reference |
| Every `/blog/[slug]` | At least one in-body contextual link | varied anchor |

Total contextual backlinks at launch: ~8–10. After the first three blog posts: ~12–14. Healthy range — strong enough to pass real equity, varied enough not to look manipulative.

---

## 12. Required image assets

Referenced in the copy and metadata but don't exist in the repo today. Generate before launch.

| Path | Purpose | Spec |
|------|---------|------|
| `/og-image.jpg` | Site-wide OG | 1200×630, brand colours, Sparkline lockup, tagline |
| `/og-products.jpg` | Products page OG | 1200×630, "Products" treatment |
| `/og-propertyzone-case-study.jpg` | Case study OG | 1200×630, Propertyzone screenshot composite |
| `/og-blog-default.jpg` | Blog index + post fallback | 1200×630, "Notes" treatment |
| `/screenshots/propertyzone-listing-mobile.png` | Case study hero | Real mobile listings screenshot |
| `/screenshots/propertyzone-detail-mobile.png` | Case study body | Real mobile property detail screenshot |
| `/screenshots/propertyzone-where-to-live.png` | Case study body | Real Pamusha screenshot |
| `/apple-touch-icon.png` | PWA + iOS | 180×180 |
| `/icon-192.png` | PWA | 192×192 |
| `/favicon.ico` | Browser | Multi-size .ico |

Generate the OG images with Satori — you already have the playbook from Propertyzone, port the same approach.

---

## 13. Execution sequence

**Week 1 — Stop the bleeding.**
Pick `.co.zw` as canonical. Update `metadataBase`, `alternates.canonical`, `robots.ts`, `sitemap.ts`, `openGraph.url`, footer email, organization schema URL. Delete the `verification` block. Set up `sales@sparklinelabs.co.zw` on Zoho or Workspace. Get a WhatsApp business number. Wire every CTA (`Book a call`, `Start on WhatsApp`) to `wa.me/263XXXXXXXXX?text=...`. Delete DataPulse and LaunchKit references from `components/products.tsx` and `app/products/page.tsx`. Replace home Products section with the §5.5 layout. Update Products page hero per §6.1. Verify all four pages render without console errors.

**Week 2 — Sanity + the first case study.**
Install `next-sanity` and dependencies. Create the three schemas. Mount Studio at `/studio`. Create a Sanity project, get the project ID, deploy. Migrate the Propertyzone product entry into Sanity (products page is now CMS-driven). Write and publish `/work/propertyzone` using §7 copy and real numbers — even rough ones. Add `/work` index page that lists case studies from Sanity. Update home page Selected Work strip to pull from Sanity.

**Week 3 — Brand voice swap.**
Replace all home page component copy (`hero.tsx`, `problem.tsx`, `services.tsx`, `process.tsx`, `why-sparkline.tsx`, `cta.tsx`, `footer.tsx`) with the §5 copy. Update `header.tsx` nav and CTA. Generate all OG images per §12.

**Week 4 — Blog launch.**
Build `/blog` index and `/blog/[slug]` template against Sanity. Add Article JSON-LD per §9.7. Write and publish post #1 ("USD pricing") and post #2 ("WhatsApp as a CRM channel"). Surface the latest 3 posts in the home page Latest Writing strip. Submit sitemap to Google Search Console and Bing Webmaster Tools. Replace placeholder verification codes with real ones.

**Weeks 5–10 — Compound.**
One blog post per week (posts 3–6 from §8.2, then continue based on what ranks). One case study per month (or per closed project). Monitor Search Console weekly. After 90 days, review which queries you've taken, which posts pulled enquiries, and double down.

---

## 14. The hard pushback you should accept

Three things on the record before you build any of this.

**The `.co.zw` decision is final.** Don't keep `.com` references "in case". Either you own and 301 `.com → .co.zw`, or you remove every `.com` mention from the codebase. Half-measures here are why search engines are confused right now.

**The "no vapourware" line on the products page is a public commitment.** If you write it, you can't quietly add a fake third product later when DataPulse takes longer to ship. The line does brand work — back it up.

**The two-hour WhatsApp response SLA on the CTA section is a public commitment.** If you can't keep it on Harare weekdays, change the language now to "within one working day" before publishing. Public SLAs you miss damage you more than no SLA at all.

---

## 15. One-paragraph executive summary

The Sparkline Labs site has three credibility leaks (fake products, mismatched domains, dead CTAs) and a brand voice that's interchangeable with any agency website on Earth. The fix is four weeks of work: pick `.co.zw`, delete the fake products and replace the section with one real product plus an honest in-development list, install Sanity to drive products + case studies + blog, swap the generic copy for the §5 deck (Zimbabwe-native, outcome-tied, manual-first), publish the Propertyzone case study at `/work/propertyzone` with multiple do-follow backlinks to `propzone.co.zw`, ship one blog post a week for six weeks on Zimbabwean software topics, and wire every CTA to WhatsApp. After this, the site stops looking abandoned because the content is genuinely updating, the products section is honest, the case study is proof, the blog is rhythm, and every button on the page actually moves the visitor toward a real conversation. No animations required.