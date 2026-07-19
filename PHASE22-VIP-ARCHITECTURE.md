# Phase 22 — KVL Visitor Intelligence Platform (VIP): Architecture

**Status:** DRAFT — for review before any code is written, per the brief.
**Scope of this doc:** architecture, DB schema, API design, event model, storage strategy, privacy model, scalability plan, phased roadmap, and — most importantly — an honest build-vs-buy classification of all 16 requested modules.

---

## 0. Reality check first

The brief describes, combined, what Microsoft Clarity + Hotjar + FullStory + Mixpanel + Clearbit Reveal/Leadfeeder do as separate commercial products, tightly wired into one CRM. That's the right ambition for a sales-focused platform, but it means some modules are pure engineering (buildable in-house, right now, on the existing stack) and some are **not buildable at all without a paid third-party data provider** — no amount of code changes that, because the underlying data (IP→ISP/ASN ownership records, IP→company identity) is proprietary and not derivable from public sources. Per the brief's own rule — *"never guess, only show verified information," "never fabricate"* — the honest move for those modules is to name the real dependency, not fake a homebrew approximation.

**Current stack, confirmed from the codebase (this determines what's realistic):**
- Next.js 14 on Vercel (`vercel.json` has real cron entries already), MongoDB via Mongoose, NextAuth.
- No Redis, no queue system, no `rrweb` or any session-replay library, no IP-intelligence library anywhere in `package.json` today.
- Edge middleware (`middleware.ts`) cannot touch Mongoose directly (existing referral-click capture already works around this by firing a `fetch()` to a Node API route) — any edge-level capture in VIP has to follow the same pattern.
- Zero UTM capture exists today — this is a real, confirmed gap (Module 3's "UTM" item is not scope-creep, it's missing).
- `lib/lead-tier.ts` already computes a deterministic lead tier from real Lead fields — Module 9 (AI Lead Scoring) should extend this, not replace it with something that invents numbers.
- `app/privacy/page.tsx` currently states *"We do not use third-party advertising cookies"* and discloses only basic usage-data collection. That statement is already slightly stale after Phase 21's Meta Pixel/LinkedIn Insight/Google Ads wiring, and would become materially false once session replay, mouse tracking, or third-party company identification go live. **The Privacy Policy needs a real rewrite before any of this reaches real traffic** — flagged here, not fixed in this doc.

---

## 1. Module-by-module build classification

| # | Module | In-house, buildable now | Needs a paid vendor | Legal/privacy risk |
|---|---|---|---|---|
| 1 | Visitor Intelligence (ID/session/returning/CRM link) | ✅ Yes — cookie-based identity | — | Low (first-party ID) |
| 2 | Geo Analytics (country/city) | ✅ Partial — free-tier IP geolocation (MaxMind GeoLite2) covers country/city/timezone reasonably | ⚠️ ISP / ASN / **proxy / VPN detection** need a paid provider for real accuracy | Medium (IP is personal data under GDPR) |
| 3 | Traffic Analytics (UTM/referrer/campaign) | ✅ Yes — real gap, straightforward to close | — | Low |
| 4 | Website Behaviour (clicks/scroll/rage-click/etc.) | ✅ Yes | — | Medium (behavioral profiling) |
| 5 | Heatmaps | ✅ Yes — aggregated from Module 4 events | — | Low (aggregate, not per-person once rolled up) |
| 6 | Session Replay | ✅ Yes, via `rrweb` (open source) + object storage | — (storage cost, not a data-vendor dependency) | **High** — full DOM/interaction capture |
| 7 | Page Intelligence | ✅ Yes — derived from Modules 3–4 | — | Low |
| 8 | Lead Journey | ✅ Yes — ties Modules 1–4 to existing `Lead`/`Deal` | — | Low |
| 9 | AI Lead Scoring | ✅ Yes — deterministic scoring from real tracked signals, extends `lib/lead-tier.ts` | — | Low |
| 10 | Company Intelligence (reverse IP → company) | ❌ **Cannot be built from scratch** — this is Clearbit Reveal/Leadfeeder/Albacross/Snitcher's entire product | ✅ **Required**: one of the above | **High** — deanonymizing visiting companies is a GDPR-scrutinized practice (arguable "legitimate interest" for B2B, needs a documented assessment) |
| 11 | Live Dashboard | ✅ Yes | — | Low |
| 12 | AI Recommendations | ✅ Yes — reuses existing `lib/ai/router.ts` (`chatRouted`), fed real aggregates | — | Low |
| 13 | Sales Dashboard | ✅ Yes — mostly already exists (`/admin/revenue` from Phase 21), extend with daily/weekly/monthly rollups | — | Low |
| 14 | Performance (Redis/Queue/Workers) | ✅ Partial — V1 doesn't need Redis (see §2.7); Redis becomes worth adopting only if real volume demands it | ⚠️ Upstash Redis (serverless, Vercel-native) if/when needed | — |
| 15 | Security/Compliance (GDPR/CCPA/RBAC/retention) | ✅ Yes, engineering half (RBAC, encryption at rest via Mongo, audit log, TTL retention) | — | **This whole module IS the legal/privacy risk control** — needs real legal review, not just code, before go-live |
| 16 | Admin Panel | ✅ Yes — same pattern as the 25+ existing `/admin/*` sections | — | Low |

**Bottom line:** 13 of 16 modules are fully buildable in-house on the current stack. **Module 10 (Company Intelligence) hard-requires a paid vendor** — there is no honest in-house version of it. Module 2's ISP/ASN/proxy/VPN sub-features need at least a MaxMind/IPinfo subscription for real accuracy (a free GeoLite2 database gives country/city only, not proxy/VPN flags reliably). Module 6 (Session Replay) and the behavioral-tracking side of Module 4 push the site into a meaningfully higher privacy-risk tier than it operates in today, which Module 15 has to actually resolve, not just checkbox.

---

## 2. Architecture

### 2.1 Ingestion layer — client SDK
A single deferred, code-split script (loaded the same way `FloatingWidgets` already is — `next/dynamic` with `ssr: false`, mounted late, zero LCP impact), responsible for:
- Reading/setting a first-party `vip_vid` cookie (2-year expiry) as the **visitor identity**. **Recommendation: no canvas/WebGL/audio device fingerprinting** — it's declining in accuracy industry-wide (Safari ITP, Firefox ETP, and most ad-blockers now actively strip fingerprint entropy) and several EU DPAs have specifically fined companies for canvas fingerprinting as a cookie-deletion-evasion technique. A first-party cookie ID, upgraded to a real identity the moment someone submits a form or logs in, is both more accurate in practice and the defensible-by-default choice. (Open question #3 below if this needs to be revisited.)
- A `vip_sid` session cookie (30-minute sliding-expiry window, matching the industry-standard "session" definition).
- Batching events in memory and flushing via `navigator.sendBeacon` (reliable on tab-close/navigation, non-blocking) every ~5s or 25 events, whichever first.
- **Sampling at the source**, not after the fact: raw `mousemove` is throttled client-side to ~10 samples/sec before it's even queued — this is how Clarity/Hotjar operate too, and matters for both cost and for not shipping literally-continuous mouse coordinates to the server.
- **Hard-coded field masking before capture** (not a togglable setting): any `input[type=password]`, `input[autocomplete*=cc-]`, anything with a new `data-vip-mask` attribute, and common OTP-pattern fields are replaced with `••••` at the DOM-serialization step inside the browser — this data must never leave the client, full stop.
- Respecting consent: extends the existing `kvl_consent` cookie (currently binary accept/reject) into a second, purpose-specific tier — `kvl_consent_behavioral` — since GDPR requires purpose-specific consent, and session replay/mouse tracking is a materially different purpose than "please let analytics.js load."

### 2.2 Server-side ingestion
- `POST /api/vip/events` — Node.js runtime (not edge, since it writes to Mongo directly), accepts a batch array, validates with Zod, rate-limits per `vip_vid` (reusing `lib/rate-limit.ts`), and bulk-inserts.
- Middleware-level capture (UTM params, referrer, first-touch) follows the existing referral-click pattern: edge middleware reads the query string and cookies, then fires a fire-and-forget `fetch()` to a Node API route for the actual DB write (mongoose can't run at the edge — same constraint the referral system already works within).

### 2.3 Database schema (Mongoose, new collections)

```
VipVisitor
  vid: string (unique, indexed)         — the vip_vid cookie value
  firstSeenAt / lastSeenAt: Date
  sessionCount: number
  knownLeadId: ObjectId ref Lead        — set once this visitor submits any form
  knownDealId: ObjectId ref Deal
  knownUserId: ObjectId ref User        — set once this visitor logs in
  companyMatchId: ObjectId ref VipCompanyMatch (nullable — only if Module 10 vendor is connected)

VipSession
  sessionId: string (unique, indexed)
  vid: string (indexed, ref VipVisitor)
  startedAt / endedAt: Date
  device: { type, os, browser }         — parsed from User-Agent, real data
  referrer: string
  utm: { source, medium, campaign, term, content }
  landingPage / exitPage: string
  pageViewCount: number
  durationSeconds: number
  geo: { country, region, city, timezone, lat, lng, source: 'maxmind-geolite2' }   — `source` field always states which provider produced it, never silently blended
  ipIntel: { isp, asn, isProxy, isVpn, isHosting, isBot, source: 'ipinfo'|null }    — entirely null/absent until a real vendor is connected — no heuristic guess written into a field named like a verified one

VipPageView
  sessionId, vid, path, enteredAt, exitedAt
  scrollDepthPct: number
  timeOnPageSeconds: number
  isExit / isBounce: boolean

VipEvent   (highest-volume collection — TTL-indexed, see §2.6)
  sessionId, vid, ts: Date
  type: enum (see §2.4)
  path: string
  payload: Mixed                        — shape depends on `type`

VipReplayChunk
  sessionId, seq: number
  storageRef: string                    — pointer into object storage (§2.5), not the blob itself
  durationMs, sizeBytes

VipHeatmapAggregate                     — precomputed by a batch job, never per-request
  path, device: 'desktop'|'mobile', bucketX, bucketY, clickCount, hoverMs
  computedForRange: { from: Date, to: Date }

VipCompanyMatch                         — only populated once a Module 10 vendor is connected
  ip: string, companyName, domain, industry, employeeRange, country, techStack: [string]
  source: string (vendor name)          — always attributed, never inferred silently
  matchedAt: Date, cacheExpiresAt: Date  — cached, not re-queried every pageview (cost control)

VipLeadScore
  vid / leadId, score: number, tier: 'hot'|'warm'|'cold'
  breakdown: [{ signal: string, weight: number, value: number }]   — fully explainable, matches "never invent scores"
  computedAt: Date
```

### 2.4 Event model (Module 4 → `VipEvent.type` enum)
`page_view, click, dead_click, rage_click, hover_start, hover_end, scroll_milestone, focus, blur, form_start, form_field_change (masked), form_submit, copy, paste, download, cta_click, link_click, chatbot_open, whatsapp_click, call_click, proposal_download, book_meeting_start, book_meeting_complete, js_error, console_error, network_error`

Every event carries `{ vid, sessionId, ts, path, type, payload }` — a single flat envelope, so the ingestion endpoint and the query layer don't need per-type branching at the transport level.

### 2.5 Storage strategy
- **System of record stays MongoDB** (no new database engine forced into the stack) for everything except session-replay blobs.
- **Session replay chunks → object storage, not Mongo.** This codebase already has a real Cloudinary integration (`FileUploader`, used for admin uploads) — reusing it for replay-chunk storage (as raw/private assets) avoids standing up a new S3/R2 bucket and credential set. If replay volume grows large enough that Cloudinary's pricing model stops making sense, an S3-compatible bucket (Cloudflare R2, cheapest egress) is the natural next step — not adopted speculatively upfront.
- **TTL indexes** on `VipEvent` (raw behavioral events) and `VipReplayChunk` — e.g., 90-day raw retention, matching a defensible GDPR data-minimization stance — after which only the already-rolled-up aggregates (`VipHeatmapAggregate`, `VipSession` summaries) survive.
- **`VipCompanyMatch` is cached with a TTL**, not re-queried on every pageview from the same IP — this directly controls the recurring cost of whichever paid vendor is chosen for Module 10.

### 2.6 API design (admin-facing, all behind `requireAdmin`, matching every existing `/api/admin/*` route in this codebase)
```
GET  /api/admin/vip/live                 — live visitor count, current pages (poll or SSE)
GET  /api/admin/vip/visitors             — list, filter by known-lead/known-customer/returning
GET  /api/admin/vip/visitors/:vid        — full timeline for one visitor
GET  /api/admin/vip/sessions/:id
GET  /api/admin/vip/sessions/:id/replay  — streams replay chunks for playback
GET  /api/admin/vip/heatmap?path=&device=
GET  /api/admin/vip/pages                — Module 7 page intelligence table
GET  /api/admin/vip/funnels/:id          — Module 8 lead-journey funnel
GET  /api/admin/vip/companies            — Module 10, empty/disabled until a vendor is connected
GET  /api/admin/vip/scores               — Module 9 lead scores, with breakdown
GET  /api/admin/vip/recommendations      — Module 12, AI-generated from real aggregates
POST /api/vip/events                     — public ingest endpoint (rate-limited, not admin-gated)
```

### 2.7 Scalability & performance plan
- **No Redis/queue in V1.** Nothing in this codebase currently uses one — 7 cron jobs already run real workloads directly against MongoDB on a schedule (`vercel.json`). Heatmap aggregation and lead-score recomputation fit the same pattern: a scheduled job, not a queue worker. If real traffic volume later proves this insufficient, **Upstash Redis** (serverless, Vercel-native, pay-per-request) is the natural upgrade — but adopting it now, before there's a volume problem to solve, would be exactly the kind of unnecessary infrastructure this codebase has avoided everywhere else.
- Client-side sampling + batching (§2.1) keeps request volume and payload size down before anything hits the server.
- The ingest endpoint is rate-limited per-visitor (`lib/rate-limit.ts`, already used by every other public POST route in this app).
- Session replay is **sampled**, not recorded for 100% of sessions (e.g., a real percentage + always-on for high-value pages like `/contact`, `/pricing`, `/book-demo`) — this must be disclosed as sampling, not silently framed as "every session," to stay inside the brief's own "never fabricate" spirit while keeping storage cost sane.

### 2.8 Privacy & legal model
- This is the module that most needs sign-off before code, not after. Session replay + granular behavioral capture + (if Module 10 is adopted) company deanonymization sit in a different risk tier than the pixel-tracking work from Phase 21.
- **Concretely needed before go-live:** a rewritten Privacy Policy (current one states no third-party ad cookies are used, which is already borderline stale and would become clearly false); a second, purpose-specific consent tier for behavioral tracking (not bundled into the existing binary accept/reject); a documented lawful basis (consent for individual-level EU/UK visitor tracking; a written Legitimate Interest Assessment if Module 10's B2B company identification is pursued under GDPR Recital 47 reasoning); a real data-subject-erasure path (delete one visitor's full VIP history on request); and RBAC + an access-log audit trail specifically for who in the admin panel opened session replays (replay of a real person's browsing session is sensitive regardless of what it contains).
- I'm not a lawyer and this document isn't legal advice — flagging that a real legal/compliance review is needed given the site already serves UK/Germany/other EU-adjacent markets through the Phase-earlier country pages.

---

## 3. Phased roadmap

**Phase A — Foundation (in-house, zero new vendor cost):** visitor/session identity (cookie-based), UTM/referrer capture (closes a real, currently-total gap), page intelligence (time-on-page, scroll%, exit/bounce), core behavioral events (click, scroll, rage-click, dead-click, form interactions — via real DOM listeners, no vendor needed), lead journey timeline wired to the existing `Lead`/`Deal` models, deterministic lead scoring extending `lib/lead-tier.ts`, admin Live Dashboard, AI Recommendations (reusing the existing `chatRouted` helper against real aggregates). **This phase alone delivers most of the sales value** (Modules 1, 3, 4, 7, 8, 9, 11, 12, 13) and needs no new spend or legal sign-off beyond the consent-tier addition.

**Phase B — Heatmaps + Session Replay (in-house engineering, real storage cost, higher privacy tier):** click/scroll/hover heatmap aggregation off Phase A's event stream; `rrweb`-based session replay with hard field-masking, sampled recording. This is where the consent-tier and masking work in §2.1/§2.8 has to actually be live first, not added after the fact.

**Phase C — Vendor-dependent modules (needs a budget decision):** Geo ISP/ASN/proxy/VPN detection (MaxMind or IPinfo subscription) and Company Intelligence (Clearbit Reveal / Leadfeeder / Albacross-class provider) — I'm not quoting prices here since they change and guessing would be exactly the kind of fabrication this brief explicitly rules out; get current quotes before committing.

**Phase D — Compliance hardening:** granular consent UI, RBAC + audit log for admin access to replays/PII, TTL-based retention enforcement, DSAR erasure flow, and the Privacy Policy rewrite (with real legal review).

---

## 4. Decisions (2026-07-19)

1. **Company Intelligence (Module 10) — descoped.** No vendor budget approved right now. `VipCompanyMatch` stays in the schema as a documented-but-unpopulated collection so it can be switched on later without a schema migration, but no vendor integration is built.
2. **Device fingerprinting — skipped, cookie-based identity confirmed.** `vip_vid` first-party cookie is the visitor identity. No canvas/WebGL/audio fingerprinting.
3. **Geo (Module 2, non-ISP/ASN/proxy/VPN portion) — using Vercel's edge geo headers, not a paid API.** `vercel.json` in this repo confirms the app runs behind Vercel's edge network, which populates `x-vercel-ip-country` / `-city` / `-country-region` / `-timezone` / `-latitude` / `-longitude` on every request at zero cost, sourced from Vercel's own IP database — real, verified, attributed data (`source: 'vercel-edge'`), not a guess. ISP/ASN/proxy/VPN detection is still out of scope until a Phase C vendor decision.
4. **Starting phase: Phase A**, confirmed. Built in this pass — see `WEBSITE-STATUS.md` §1.8 for the as-built record once complete.
