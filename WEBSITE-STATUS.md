# KVL TECH Website — Status &amp; Gap Report

**Project:** kvlbusinesssolutions.com (Next.js app in `next-app/`)
**Last updated:** 2026-07-19
**Scope of this report:** the live Next.js website only. The `*.html` / `styles.css` / `partials.js` files at the repo root are a legacy static version of the site and were not touched in this engagement.

**2026-07-11 update:** All remaining Medium/Low gaps from the QA audit below (§1.5) plus 11 net-new features (referral system, marketplace filters, CRM search/export/bulk actions, workflow engine triggers, marketing pixels, blog expansion to 21 posts, Lead→Deal automation) were completed and independently re-verified via a live production build + curl checks. Full report: https://claude.ai/code/artifact/257afead-738b-42af-8ef2-9da90e5d8b6b — Production Readiness moved from 65/100 to 90/100. The §1.5 and §2 tables below are kept as a historical record of what was found; items now fixed are struck through inline.

**2026-07-11 update (Round 2 — fresh audit):** A second, independent Final Phase QA audit re-tested every prior fix for regressions and tested everything new since the last round for the first time. Verdict: **YES, production-ready** (93/100). One **Critical** bug was found fresh this round — dynamic pages (`/software/[slug]`, `/blog/[slug]`, `/projects/[slug]`) were soft-404ing (HTTP 200 for nonexistent slugs) — and fixed and verified on a real production build before the report was finalized. A second, Medium bug (a root-level route shadowing real 404 pages with plain text) was also found and fixed. Three independent testers flagged rate-limiting as broken; re-tested with a corrected methodology on the real production server and confirmed it works correctly — a false alarm, not a regression. Full report: https://claude.ai/code/artifact/c783497f-6270-45da-a54e-58d1aa0c6809 — Production Readiness moved from 90/100 to 93/100. See §1.6 for details.

**2026-07-11 update (Round 2 items closed):** All 6 non-blocking items surfaced by the Round 2 audit (§1.6) were fixed the same day — `QuoteModal` false-success bug, referral-system discoverability, Contact/Support form error display, blog related-post relevance ranking, chatbot WhatsApp digit-strip, and the 4 mega-menu Services links. Verified with a clean `tsc --noEmit` (only the same 2 pre-existing unrelated errors), a clean isolated `next build`, and a real `next start` production server confirming all touched pages/links. Nothing website-code-related remains open from either audit round — see §1.6.1.

**2026-07-19 update:** A full feature audit (real vs. demo across every section of the site) was written up — see `FEATURE-AUDIT-REAL-VS-FAKE.md` at the repo root. Alongside it, four fixes shipped: (1) the site's ISO 27001 claim was removed everywhere (metadata, About page, FAQs, download pages) since it was never actually certified — replaced with the real MSME registration + an on-request NDA, and the founding year was corrected from 2019 to 2015; (2) `/blog/[slug]`, `/industries/[slug]`, `/services/[slug]`, `/services`, and `/software/[slug]` were missing a page-specific `openGraph.images`, so social share cards fell back to the generic default image — now point at the per-page `/og` endpoint; (3) `/industries/[slug]` and `/services/[slug]` were force-static'd (`dynamic = 'force-static'`, `dynamicParams = false`), matching the same fix already applied to `/software/[slug]` and `/blog/[slug]` in §1.6; (4) CRM Development and Digital Marketing were added to the header mega menu — both service pages already existed but had no menu entry point.

**2026-07-19 update (Phase 21 — Revenue & Client Acquisition Infrastructure):** A large growth-engineering build across 4 phases, each verified with a clean `tsc --noEmit` (same 2 pre-existing unrelated errors, no new ones) and a full isolated `next build`.
- **Analytics/tracking:** added the missing pieces on top of the already-real GA4/GTM/Meta Pixel/Clarity/LinkedIn setup — a Google Ads conversion component (`components/analytics/GoogleAdsConversion.tsx`, env-gated, was missing entirely), scroll-depth tracking, and a centralized `trackEvent()` module (`components/analytics/track.ts`) that now fans out to GA4 + Ads conversions + a first-party event log. Added `trackEvent` calls to the forms that didn't have one yet (QuoteModal, CallBackWidget, Newsletter, Register, Support ticket, Hero CTAs).
- **First-party Conversion Events dashboard** (`/admin/conversion-events`) — real CTA-click/lead-source/landing-page numbers from this site's own DB, no GA4 Data API credentials needed.
- **IndexNow** now actively pings on blog/case-study publish or update, instead of only serving the key file.
- **Lead-magnet CTAs** — "Free Website Audit" and "Free AI Automation Consultation" modal (`LeadMagnetModal.tsx`), plus a per-page "Smart CTA" band (`SmartCTA.tsx`) above the footer that changes copy contextually (AI-automation pages vs. everywhere else).
- **Review-request automation** — Deal model got a real `contactEmail` field (the pre-existing `contactId` ref to `Contact` was declared but never actually populated anywhere in the codebase, so it couldn't have worked); when a deal moves to `won`/`repeat` with a contact email on file, a real email goes out asking for a testimonial, linking to a new no-login-required public page (`/reviews`) that feeds the existing (previously-empty) `Review` model. Manual "Request Review" resend button added to the CRM Kanban card. **Note:** this is separate from the pre-existing `app/api/cron/review-request` job, which asks `Lead`s (not `Deal`s) for an external Google review 7 days after `status: 'won'` — that one was already live and wasn't touched; the two don't share a dedupe path, so the same client could in principle get both a Google-review ask and an on-site-testimonial ask.
- **Internal Outreach CRM** (`/admin/outreach`) — drafts-only cold email/LinkedIn campaign manager (`OutreachCampaign` + `OutreachProspect` models). Generates a filled-in draft from a template, opens it in the admin's own email client via `mailto:` or the prospect's LinkedIn profile — never sends anything itself. Status (sent/replied/meeting booked/etc.) is tracked manually since there's no inbox/LinkedIn API integration to auto-detect replies. A "convert to deal" action links a replied prospect into the real CRM pipeline.
- **Revenue Dashboard** (`/admin/revenue`) — daily visitors, qualified leads, meetings booked, proposals in flight, won deals/value, pipeline value, average deal size, lead→customer conversion rate, best lead sources, top requested services (a proxy for industry interest — Lead has no dedicated industry field), and top landing pages for leads — all computed from real Mongo data (Deal, Lead, Order, Booking, VisitDailyLog, AnalyticsEvent). Campaign ROI is explicitly shown as "not available" rather than estimated, since no ad account is connected yet.

**Still open / needs Kamar's input (not a coding gap):** real GTM/Meta Pixel/Clarity/LinkedIn/Google Ads IDs; a real GSC verification code (Bing's was already set); real client testimonials/logos/awards (none fabricated — the trust-layer infra is ready, content is not); actually creating the Google Business Profile/Clutch/GoodFirms accounts (needs Kamar's own phone/postcard verification, not something this session can do); an ad account, once one exists, for Campaign ROI to become computable.

**2026-07-19 update (Phase 22 — Visitor Intelligence Platform, Phase A):** Architecture-first build (`PHASE22-VIP-ARCHITECTURE.md`) — visitor/session tracking, real UTM/traffic-source capture, deterministic behavioural lead scoring, and a new `/admin/vip` dashboard with per-visitor lead-journey timelines. Company Intelligence (reverse-IP-to-company) deliberately descoped — no vendor budget, and it can't be built without one. Device fingerprinting rejected in favor of a first-party cookie ID. See §1.8.

**2026-07-19 update (pushed &amp; deployed):** Both phases above were committed (`36f299d`), pushed to `origin/main`, and deployed to production via `git pull` + `npm run build` + `pm2 restart kvl-business` — clean build, clean restart, verified live. **This deploy surfaced a real bug:** VIP's geo capture assumed the app runs behind Vercel's edge network (reading `x-vercel-ip-*` headers); production actually runs on a self-hosted Hostinger VPS via PM2, so those headers never exist there and geo capture currently collects nothing. It also confirmed that **none of the `vercel.json` cron entries can be firing from Vercel's side either**, since this isn't a Vercel deployment — whatever runs the pre-existing crons in production is a separate, not-yet-located mechanism (likely a VPS crontab). See §2.6 for the fix plan.

This file is the single source of truth for what's actually been built vs. what's still open. Nothing below is aspirational — every "Done" item was verified with a production build and/or a live HTTP check; every "Gap" item is something that was found missing and deliberately not fabricated a fix for.

---

## 1. What's Been Built

### 1.1 International Expansion — 10 Country Pages + 11 Industry Pages
- `/software-development-company-{usa,uk,canada,australia,uae,singapore,germany,saudi-arabia,qatar,new-zealand}` — 10 fully unique country landing pages (`next-app/lib/data/country-pages.ts`, rendered via `next-app/components/country-landing/CountryLandingTemplate.tsx`).
- 11 international industry landing pages, distinct from the older domestic India-market industry pages: `/healthcare-software-development`, `/hospital-management-software-development`, `/school-erp-development`, `/restaurant-pos-software-development`, `/retail-software-development`, `/manufacturing-erp-development`, `/construction-erp-software-development`, `/real-estate-software-development`, `/logistics-fleet-management-software`, `/finance-banking-software-development`, `/government-digital-solutions` (`next-app/lib/data/industry-landing-pages.ts`, rendered via `next-app/components/industry-landing/IndustryLandingTemplate.tsx`).
- `/global` hub page linking to all 21 pages above.
- **Bug found and fixed:** the original country-page route (`software-development-company-[country]`) used a Next.js folder-naming pattern that doesn't actually work (a static prefix can't be combined with a bracketed dynamic segment in one folder). It silently 404'd in production even with real data. Replaced with 10 individual static route folders — confirmed working via production build + live HTTP checks.
- `/software-development-company-patna` — dedicated local-SEO page for the actual HQ market (Patna/Bihar), separate from the international pages.
- All 21+1 pages are in `next-app/app/sitemap.ts`.

### 1.2 SEO &amp; Technical Fixes
- **Fixed:** Contact page map was showing Pune coordinates instead of Patna (`next-app/app/contact/page.tsx`) — now correct (25.5941, 85.1376).
- **Fixed:** `/global` + all 21 country/industry pages were orphaned (zero inbound links from anywhere clickable on the site). Added to the Footer's Company column — now reachable from every page.
- **Added:** `ContactPage` JSON-LD schema, `GeoCoordinates` in the LocalBusiness schema, explicit `font-display: swap`, AVIF/WebP image format tuning in `next.config.js`.
- **Added:** unique title/description/canonical/OG metadata on Home, About, Services-list (previously all three shared the generic sitewide fallback — a duplicate-content issue).
- **Added:** real Google Maps link (address-based) on Contact page and Footer.
- **Added:** `/site-map` — human-readable HTML sitemap linking every page on the site.
- **Added:** 4 new service pages that the site was missing — CRM Development, API Development, White Label Solutions, Enterprise Integrations (`next-app/lib/data/services.ts` + `service-details.ts`).
- **Added:** domestic Finance &amp; NBFC industry page, `/industries/finance` — the one domestic industry vertical that had no page.
- **Fixed:** Footer's Services/Industries links pointed to generic hub pages instead of the actual specific pages — now link correctly.
- **Fixed:** `/software/[slug]` breadcrumb was missing its "Software" parent link (only page of its kind with this specific gap).
- **Fixed (QA phase):** duplicate brand suffix in `&lt;title&gt;` on 32 pages (all 10 country pages, all 11 international industry pages, all 11 domestic industry pages) — title was rendering the brand name twice (e.g. "... | KVL Business Solutions · KVL Business Solutions"). Hardcoded suffix stripped from `country-pages.ts`, `industry-landing-pages.ts`, and `industries/[slug]/page.tsx`.
- **Fixed (QA phase):** wrong canonical URL on `/software` and all 15 `/software/[slug]` pages — they were declaring the bare homepage as canonical instead of their own path. Both files now set `alternates.canonical` correctly.
- **Scaffolded, not activated:** Google Search Console + Bing Webmaster verification meta tags (`next-app/app/layout.tsx`, reads `NEXT_PUBLIC_GSC_VERIFICATION` / `NEXT_PUBLIC_BING_VERIFICATION` env vars — currently unset) and an IndexNow key-file route (reads `INDEXNOW_KEY` env var — currently unset). These need real codes from Kamar to actually turn on.
- **Bug found and fixed (QA phase):** the original `/[indexnowkey]` route was breaking `next build` entirely (`PageNotFoundError: Cannot find module for page: /[indexnowkey]`). Fixed at the time by adding `export const dynamic = 'force-dynamic'`.
- **Superseded fix (Round 2, see §1.6):** that same root-level route turned out to also shadow every real single-segment 404 typo on the site with a bare plain-text response. Replaced entirely — moved to `next-app/app/api/indexnow/[key]/route.ts` plus a `rewrites()` entry in `next.config.js` mapping the external `/{key}.txt` URL IndexNow requires to that internal API route. The old `app/[indexnowkey]/` folder no longer exists.

### 1.3 CRM
- `Deal.stage` pipeline extended from `lead → qualified → proposal → negotiation → won → lost` to include a new `repeat` stage: `... → won → repeat → lost` (`next-app/lib/models/Deal.ts`). Kanban board (`next-app/app/dashboard/crm/page.tsx`) updated to show all 7 columns, and the "Won" total in the header now includes `repeat`-stage deals so recurring clients don't disappear from that number.
- **Confirmed live end-to-end (QA phase):** a real test deal was walked through every stage including `repeat`, each transition persisted correctly with no regression from the schema change.

### 1.4 Marketing &amp; Sales Assets (not website code — reference docs)
These were produced as standalone reference documents, not changes to the website itself:
- **LinkedIn playbook** — Company Page copy, Kamar's founder profile copy, 4-week content calendar, connection/outreach templates.
- **Enterprise sales documentation system** — 25+ templates: Company Profile, Proposal, Quotation, SOW, BRS/TRS/FRS, contracts (NDA/MSA/Project Agreement), invoicing, AMC/SLA, onboarding kit, closure/handover docs.
- **Client acquisition &amp; revenue engine** — cold email system, Google Business Profile / Clutch / GoodFirms / GitHub / Facebook / YouTube setup guidance, referral program design, partnership strategy, analytics framework, 90-day plan.

None of these are live anywhere yet — they're copy-ready templates waiting to be pasted into the real LinkedIn/Clutch/GBP/etc. profiles, which is itself one of the gaps below.

### 1.5 Production Readiness QA Audit — 5 Blocking Issues Found &amp; Fixed
A full QA pass tested every page, form, auth flow, CRM, and security/SEO surface against a live server (real HTTP requests, real form submissions, a real logged-in test session, four isolated production builds). Verdict at the time: **not yet production-ready**, with 5 concrete blocking issues — all fixed and re-verified since:
- **Fixed:** rate limiting was trivially bypassable — `clientIp()` in `next-app/lib/rate-limit.ts` trusted the first (client-forgeable) entry in `X-Forwarded-For`; now trusts the last entry (the one appended by the actual reverse proxy). Verified live: 6 requests with a varying forged first-hop but the same real last-hop → correctly rate-limited on request 6.
- **Fixed:** no security response headers at all. Added `headers()` in `next-app/next.config.js` — HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and a `Content-Security-Policy` scoped to the actual third-party origins in use (Google Analytics, Razorpay checkout, the OpenStreetMap map embed) so it doesn't silently break checkout or analytics.
- **Fixed:** WhatsApp links were malformed in ~9 files — `NEXT_PUBLIC_WHATSAPP` is set with a leading `+`, and most files interpolated it into a `wa.me/...` URL without stripping it, producing an invalid link. All 8 consumer files plus `lib/whatsapp.ts` itself now strip non-digits before building the link.
- **Fixed:** the two title/canonical bugs listed in §1.2 above.

**Originally open from this audit — all confirmed fixed as of the 20-task gap-closure round, and re-verified with zero regressions in the Round 2 fresh audit (§1.6):**
| Finding | Severity | File(s) |
|---|---|---|
| ~~Unauthenticated users hitting a protected route land on the default NextAuth sign-in page, not the branded `/login`~~ | Medium | `next-app/middleware.ts` |
| ~~Footer social icons render as dead `#` links until an admin configures Site Settings~~ | Medium | `lib/models/SiteSettings.ts`, `Footer.tsx` |
| ~~Form inputs (`Contact`, `Book Demo`, `Register`) have no `id`/`htmlFor` label association~~ | Medium (a11y) | `ContactClient.tsx`, `book-demo/page.tsx`, `register/page.tsx` |
| ~~`--text-3` CSS token is low-contrast~~ — now 4.83:1 light / 4.57:1 dark, both WCAG AA | Medium (a11y) | `app/globals.css` |
| ~~No search/filter UI on the Software Marketplace listing~~ | Medium (UX) | `app/software/page.tsx` |
| ~~Zod validation errors return the raw stringified error object to direct API callers~~ | Low | `/api/lead`, `/api/register`, `/api/newsletter`, `/api/booking`, `/api/quote` |
| ~~Email verification token consumed via GET~~ | Low | `app/api/auth/verify/route.ts` |
| ~~Account-menu icon button has no `aria-label`~~ | Low (a11y) | `components/layout/Header.tsx` |
| ~~No search/filter on the CRM Kanban board~~ | Low | `app/dashboard/crm/page.tsx` |

**Test data created during this audit — cleaned up 2026-07-11.** All records matching the QA test identifiers (synthetic `@kvltech-internal.test` / `qa-audit-8rupiya+*@gmail.com` emails, placeholder phone `9999999999`, `qa-test`/`qa-audit`/`security-qa` source tags) were queried, previewed, and deleted from the production MongoDB. Final counts removed: **30 leads, 1 subscriber, 1 deal, 1 user** — verified zero remaining afterward.

**Explicitly not verified** (needs real tooling this environment doesn't have): JS console errors, hydration warnings, dark-mode visual toggle, cross-browser rendering, real screen-reader behavior, true color-contrast ratios, real Core Web Vitals/Lighthouse score, and the Admin Panel (requires `role: 'admin'`, which wasn't granted to the test account during this pass).

### 1.6 Fresh QA Audit — Round 2 (2026-07-11)

A second, independent Final Phase QA audit — 7 parallel testers re-checking every prior fix for regressions plus first-time coverage of everything built since (referral system, CRM search/filters/export, marketplace filters, 21-post blog, workflow triggers). Full report: https://claude.ai/code/artifact/c783497f-6270-45da-a54e-58d1aa0c6809

**Found and fixed during this round:**
- **Critical — soft-404 on dynamic content pages.** `/software/[slug]`, `/blog/[slug]`, `/projects/[slug]` returned HTTP 200 (with correct "not found" copy) instead of 404 for nonexistent slugs — confirmed on a genuinely fresh production build (`x-nextjs-cache: MISS`), not a caching artifact. Root cause: a known Next.js 14.2.5 behavior where `notFound()` doesn't always propagate a real 404 status for dynamically-rendered pages. Fixed by adding `export const dynamic = 'force-static'; export const dynamicParams = false;` to all three files (safe since each has a fixed, fully-known slug catalog). Verified: unknown slugs now 404, real content still 200.
- **Medium — root-level typo URLs served a bare plain-text 404 instead of the branded page.** The `/[indexnowkey]` route (a root-level dynamic segment) intercepted every single-segment URL typo before Next's real `not-found.tsx` could run. Fixed by moving it to `app/api/indexnow/[key]/route.ts` + a `next.config.js` rewrite (see §1.2). Verified: typos now show the real branded 404 page.

**Clarified as a false alarm, not a real defect:**
- Rate limiting was independently flagged as broken by three different test angles. Re-tested with a corrected methodology on the real production server (fixed last-hop IP, varied only the spoofable first hop) and confirmed request 6 and 7 both correctly return 429. The original "broken" findings were dev-mode/Fast-Refresh artifacts and flawed test setups, not a regression in the fix from §1.5.

**Findings from this round — all fixed same-day (2026-07-11):**
| Finding | Severity | File(s) | Fix |
|---|---|---|---|
| ~~`QuoteModal` shows "Quote sent! 🎉" even when the request actually failed~~ | Medium-High | `components/widgets/QuoteModal.tsx` | Now parses the response, checks `res.ok`/`d.ok`, and shows the real error inline instead of a false success state |
| ~~Referral system (`/dashboard/referrals`) has zero discoverable entry point~~ | Medium | `app/dashboard/page.tsx`, `UserMenuDropdown.tsx` | Added a "Refer a friend" tile on the dashboard and a "Referrals" item in the account dropdown menu |
| ~~Contact form and Support ticket form discard the real API error message on failure~~ | Medium | `app/contact/ContactClient.tsx`, `app/support/page.tsx` | Both now parse and display `d.error` from the API response; the support ticket form previously showed no error text at all |
| ~~Blog "related posts" not relevance-ranked~~ | Low | `app/blog/[slug]/page.tsx` | Added `rankRelatedPosts()` — same weighted-scoring pattern (category + shared service/industry slugs) as the existing case-study ranker |
| ~~Chatbot route doesn't strip non-digit characters from the WhatsApp number~~ | Low | `app/api/chatbot/route.ts` | Now `.replace(/\D/g, '')`s the number before building the `wa.me` link, matching every other consumer |
| ~~4 mega-menu "Services" items link to the generic `/services` page~~ | Low | `components/layout/header/megaMenuData.ts` | Repointed to their real pages: `/services/gps`, `/services/automation`, `/services/cctv`, `/services/ai` |

Everything else tested this round — auth flows, CRM/Referral system (verified fully live end-to-end), SEO/Schema/Sitemap (132 URLs, 22/22 sampled 200), security headers, accessibility — passed with zero regressions.

### 1.6.1 Round 2 Closure — Verification (2026-07-11)
All 6 fixes above were verified together: `npx tsc --noEmit` showed only the same 2 pre-existing, unrelated errors (`Header.tsx` TS4104, `DownloadGate.tsx` TS2322) with zero new errors; a clean isolated `rm -rf .next && npm run build` completed successfully with all routes generated; a real `next start` production server (not dev mode) confirmed `/support`, `/contact`, `/dashboard`, `/dashboard/referrals`, and the 4 new `/services/{gps,automation,cctv,ai}` links all resolve correctly, and that a manufacturing-themed blog post now surfaces a genuinely related automation post instead of the previous arbitrary first-3 order.

### 1.7 Phase 21 — Revenue & Client Acquisition Infrastructure (2026-07-19)

A 4-phase growth-engineering build. Each phase verified with a clean `npx tsc --noEmit` (same 2 pre-existing unrelated errors, zero new ones) and a full isolated `next build`.

**Phase 1 — Analytics/tracking + SEO:**
- `components/analytics/GoogleAdsConversion.tsx` — was missing entirely; env-gated (`NEXT_PUBLIC_GOOGLE_ADS_ID`), consent-respecting, matches the existing GA4/Meta/LinkedIn/Clarity component pattern.
- `components/analytics/ScrollDepthTracker.tsx` — fires `scroll_depth` at 25/50/75/100% once per page view.
- `components/analytics/track.ts` — new centralized `trackEvent()` that fans out to GA4/GTM, Google Ads conversions (for the subset of events mapped to a conversion label), and this site's own DB. `GoogleAnalytics.tsx` now re-exports from it so every existing call site kept working unchanged.
- `trackEvent` calls added where missing: `QuoteModal.tsx` (`proposal_request`), `CallBackWidget.tsx`, `NewsletterForm.tsx`, `app/register/page.tsx`, `app/support/page.tsx`, and the two Hero CTAs via a new `components/analytics/TrackedLink.tsx`.
- `lib/models/AnalyticsEvent.ts` + `app/api/events/route.ts` — first-party event log (rate-limited, validated), feeding a new admin page `app/admin/conversion-events/page.tsx` (CTA clicks, event breakdown, top converting pages — all real, no GA4 Data API needed).
- `lib/indexnow.ts` — IndexNow now actively pings `https://api.indexnow.org/indexnow` on blog/case-study create or update (`app/api/admin/blog/route.ts`, `.../blog/[id]/route.ts`, `.../case-studies/route.ts`, `.../case-studies/[id]/route.ts`). Previously it only served the key file and never pushed anything.
- Confirmed already-working and left untouched: GSC verification meta tag (`layout.tsx`'s `verification.google`, reads `NEXT_PUBLIC_GSC_VERIFICATION`) — the Explore-agent pass that scoped this work initially reported it missing, but it was already there.

**Phase 2 — Lead capture + trust layer:**
- `components/widgets/LeadMagnetModal.tsx` — "Free Website Audit" / "Free AI Automation Consultation" modal, posts to the existing real `/api/lead` (no new backend needed).
- `components/shared/SmartCTA.tsx` — a CTA band above the footer on every public page except ones that are already a conversion flow (`/contact`, `/book-demo`, `/register`, `/login`, `/dashboard`, `/checkout`, `/support`); copy changes based on path (AI/automation pages get the AI-consultation offer, everything else gets the audit offer).
- `lib/models/Deal.ts` gained a real `contactEmail` field (the pre-existing `contactId` ref to `Contact` was declared but never populated anywhere in the codebase — dead code, not usable) and `reviewRequestedAt`. Surfaced in the CRM Kanban edit form (`app/dashboard/crm/page.tsx`).
- `lib/review-request.ts` + `lib/email.ts`'s `reviewRequestEmail()` — when a deal moves to `won`/`repeat` with a `contactEmail` on file, a real email goes out (`app/api/crm/deals/[id]/route.ts`) asking for a testimonial. Manual resend via a new "Request review" button on the Kanban card, backed by `app/api/crm/deals/[id]/request-review/route.ts`.
- `app/reviews/page.tsx` — new, no-login-required public review submission page (posts to the existing `/api/reviews`, which was already public and unauthenticated). Review-request emails link here with `?name=&company=` prefilled.
- **Important interaction to know about:** this is a *second*, independent review-request mechanism. `app/api/cron/review-request/route.ts` already existed and is untouched — it asks `Lead`s (not `Deal`s) for an external Google review, 7 days after `Lead.status` becomes `'won'`. The two don't share a dedupe path, so the same client could receive both a Google-review ask (from the old cron) and an on-site-testimonial ask (from the new Deal-based trigger). Not a bug, just worth knowing before it looks like a duplicate-email complaint from a client.

**Phase 3 — Internal outreach CRM (`/admin/outreach`), drafts-only:**
- `lib/models/OutreachCampaign.ts` + `lib/models/OutreachProspect.ts` — new models. A campaign has a message template (`{{name}}`/`{{company}}` placeholders); a prospect has manually-tracked status (`pending → drafted → sent → opened → replied → meeting_booked`, or `bounced`/`unsubscribed`) since there's no inbox/LinkedIn API integration to auto-detect opens or replies.
- `app/admin/outreach/page.tsx` (campaign list/create) + `app/admin/outreach/[id]/page.tsx` (prospect table, bulk-paste add, per-prospect draft generation).
- Sending is never automatic: the "draft" is filled-in text the admin copies, or a `mailto:` link that opens their own email client, or a link to the prospect's LinkedIn profile. The system holds no SMTP/LinkedIn credentials and never calls a send API.
- "Convert to deal" (`app/api/admin/outreach/prospects/[id]/convert/route.ts`) creates a real `Deal` linked back to the prospect, so a reply that turns into a client shows up in the same CRM pipeline as inbound leads.

**Phase 4 — Revenue Dashboard (`/admin/revenue`):**
- `app/api/admin/revenue/route.ts` — daily visitors (from `VisitDailyLog`), qualified leads, meetings booked (`Booking`), proposals in flight, won deals/value, pipeline value, average deal size, lead→customer conversion rate, best lead sources (`Lead.source`), top requested services (proxy for industry interest — `Lead` has no dedicated industry field, so this reports what's actually tracked instead of inventing a taxonomy), and top landing pages for leads (`AnalyticsEvent`). All computed from this site's own Mongo data.
- Campaign ROI is explicitly rendered as "not available — no ad platform connected yet" rather than estimated or left at a misleading 0.

### 1.8 Phase 22 — KVL Visitor Intelligence Platform (VIP), Phase A (2026-07-19)

A 16-module "visitor intelligence" system was scoped (full architecture doc: `PHASE22-VIP-ARCHITECTURE.md` at repo root). Per that doc's own build-vs-buy classification, 13 of 16 modules are honestly buildable in-house; **Module 10 (Company Intelligence — reverse-IP-to-company identification) was descoped entirely** (no vendor budget approved — this literally cannot be built without a paid provider like Clearbit/Leadfeeder, so it was not faked), and **device fingerprinting was rejected in favor of a first-party cookie visitor ID** (legal risk + declining real-world accuracy). Only **Phase A** of the roadmap was built this round — heatmaps, session replay, and the paid geo/ISP/proxy/VPN tier remain future phases pending a real legal review (session replay in particular needs a Privacy Policy rewrite first — see the architecture doc §2.8).

**What's real and live:**
- New Mongo collections: `VipVisitor`, `VipSession`, `VipPageView`, `VipEvent` (90-day TTL — real data-minimization, not just a storage-cost decision), `VipLeadScore`.
- Client SDK `components/vip/VipTracker.tsx` — a separate pipeline from the Phase 21 marketing-pixel `trackEvent()` module by design (this one feeds KVL's own internal DB, not third parties). Cookie-based visitor/session identity (`vip_vid` 2yr, `vip_sid` 30min sliding), gated on the same `kvl_consent` cookie as everything else. Tracks real clicks (with rage-click detection), scroll milestones, form start/submit (never field *values* — masking by construction, nothing sensitive is ever captured, not redacted after the fact), copy/paste, JS errors, and classifies WhatsApp/call/download clicks from real `href` patterns. No mousemove/heatmap capture yet (that's Phase B).
- `app/api/vip/events/route.ts` — public, rate-limited ingest endpoint. Geo (`country`/`city`/`region`/`timezone`/`lat`/`lng`) is read from Vercel's edge-network headers (`x-vercel-ip-*`) when present — real, attributed data (`source: 'vercel-edge'`), left entirely absent rather than guessed otherwise. **Correction, post-deploy (see the 2026-07-19 deployment note below): this assumption was wrong for the real production environment** — `vercel.json` exists in the repo, but production actually runs on a self-hosted Hostinger VPS via PM2 (`next start`), not behind Vercel's edge network, so these headers will never be present there and geo capture will silently produce no data (fails safe, doesn't fabricate — but also doesn't work). `lib/vip/traffic-source.ts` classifies first-touch channel (google-organic, facebook-ads, direct, referral:host, etc.) from real UTM params/referrer — this closes a real, previously-total gap (the site had zero UTM tracking before this), and is unaffected by the geo-header issue since it doesn't depend on Vercel headers.
- `lib/vip/link.ts` — links a `VipVisitor` to a real `Lead` the moment one is created, by reading the same `vip_vid` cookie the browser already sends (no frontend changes needed). Wired into `/api/lead`, `/api/quote`, `/api/booking`.
- `lib/vip/lead-score.ts` — deterministic, fully explainable behavioural lead score (0-100, hot/warm/cold), same rubric style as the pre-existing `lib/lead-tier.ts`. Every point traces to a real signal (session count, pricing/portfolio visits, contact attempts, distinct services/industries viewed, time on site) — this is a different, complementary signal from the pre-existing AI *intent* scorer (`lib/ai/lead-scorer.ts`, which reads free-text message content), not a replacement for it. Recomputed live whenever an admin opens a visitor's timeline, and batch-recomputed daily for all known visitors via `app/api/cron/vip-lead-scoring/route.ts` (added to `vercel.json`).
- Admin UI: `/admin/vip` (live-ish overview — 30s polling, not a true live stream; top pages/channels/countries; known-visitor list with scores) and `/admin/vip/visitors/[vid]` (Module 8 lead-journey timeline — every session, every page in order, notable events, score breakdown).

**Deliberately not built this round (see `PHASE22-VIP-ARCHITECTURE.md` for the full reasoning):** heatmaps and session replay (Phase B — needs the masking/consent-tier work live first); ISP/ASN/proxy/VPN detection and Company Intelligence (Phase C — needs a paid-vendor budget decision); granular consent UI, RBAC/audit log for admin replay access, and the Privacy Policy rewrite (Phase D — needs real legal review, especially given the site already serves UK/Germany/EU-adjacent markets via the Phase-earlier country pages).

Verified with a clean `npx tsc --noEmit` (same 2 pre-existing unrelated errors, zero new) and a full isolated `next build` (all new routes — `/admin/vip`, `/admin/vip/visitors/[vid]`, `/api/vip/events`, `/api/admin/vip/*`, `/api/cron/vip-lead-scoring` — generated with no errors).

**2026-07-19 — Pushed and deployed to production.** Committed (`36f299d`) and pushed to `origin/main`, then deployed live: `git pull` + `npm run build` + `pm2 restart kvl-business` on the real production host — confirmed to be a Hostinger VPS (`root@187.127.148.237`, PM2 process `kvl-business`, `exec cwd: /var/www/kvl/next-app`, `next start -p 3003`), **not Vercel** despite `vercel.json` existing in the repo. Build succeeded (306 pages, all new routes present), PM2 restart was clean (`✓ Ready in 463ms`, no errors in the fresh log output). This deploy is what surfaced the Vercel-geo-header issue noted above — worth fixing next since Module 2 (Geo Analytics) currently produces zero data in the real environment as a direct result. The likely fix: a self-hosted MaxMind GeoLite2 lookup (free account + `.mmdb` file, offline lookups from the existing `clientIp()` helper — still zero recurring vendor cost, consistent with the original Phase A "no new vendor" plan) instead of reading Vercel headers that don't exist here.
- Also surfaced by this deploy: this VPS runs many other PM2-managed apps beyond this website (`aapkaplot`, `gravity-*`, `kvl-admin/api/parent/student/teacher` — the School ERP demo cluster, `kvl-tech` — the legacy app, `restro-*`, `vidyt`, `8rupiya`) — useful to know before ever running a broad `pm2 restart` or `pm2 delete` on this box; always target `kvl-business` by name.

---

## 2. Known Gaps — Not Yet Done

### 2.1 Website / Technical
| Gap | Why it wasn't fixed | Effort to close |
|---|---|---|
| Raw `&lt;img&gt;` tags (not `next/image`) in `Header.tsx`, `MegaMenuPanel.tsx`, `UserMenuDropdown.tsx`, `FileUploader.tsx`, `brand/page.tsx`, `website-demos/DemosClient.tsx` | All are small (avatars/thumbnails), low real CWV impact — converting risked visual regressions for little gain | Small |
| No caching/`revalidate` strategy beyond the existing 30-second in-memory `SiteSettings` cache | Existing cache already covers the main risk; adding blanket `revalidate` risked showing stale admin-edited content | Small–Medium |
| ~~Case study `industrySlug` field never rendered~~ / ~~blog still 5 posts, no byline~~ | Both resolved as part of the 20-task closure (real author byline added, blog expanded to 21 posts) | — |
| ~~The 6 items found in the Round 2 fresh audit~~ (`QuoteModal` false-success, referral discoverability, Contact/Support error display, blog related-post ranking, chatbot digit-strip, mega-menu links) | All fixed same-day, 2026-07-11 — see §1.6/§1.6.1 for details | — |

### 2.2 Search Engine / Verification &amp; Marketing Pixels (needs real credentials, not more code)
- Google Search Console: not verified — needs a real verification code from Kamar's GSC account, set as `NEXT_PUBLIC_GSC_VERIFICATION`. The meta tag itself is already wired up in `layout.tsx` — just the value is missing.
- Bing Webmaster Tools: already verified (`NEXT_PUBLIC_BING_VERIFICATION` set).
- IndexNow: per the 2026-07-18 feature audit, `INDEXNOW_KEY` is already set on the VPS — the key-file route and (as of Phase 21, §1.7) the active ping-on-publish should both already be working in production. Not independently re-verified against the live VPS in this session.
- Google Ads conversion tracking, GTM, Meta Pixel, Microsoft Clarity, LinkedIn Insight Tag: all code-complete and env-gated (Phase 21 added the missing Google Ads piece; the rest already existed) — need real IDs in `NEXT_PUBLIC_GOOGLE_ADS_ID` / `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_META_PIXEL_ID` / `NEXT_PUBLIC_CLARITY_ID` / `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` to actually start tracking.

### 2.3 CRM / Automation
- ~~Lead → Deal handoff unclear~~ / ~~missing `proposal_sent`/`deal_won`/`deal_lost` Workflow triggers~~ / ~~no referral tracking system~~ / ~~no Meta Pixel~~ — all resolved as part of the 20-task closure (`Lead.dealId`, `fireTrigger()` calls on real stage transitions, full referral-code system, marketing pixels wired up). The one remaining gap is referral **discoverability**, not functionality — see §1.6.

### 2.4 Trust Layer &amp; Outreach — content/adoption gaps, not code gaps
- No real client testimonials, client logos, awards, or tech-partner badges exist — none were fabricated. The infrastructure to collect and display them is real and live (`/reviews` submission page, `Review` model, the Deal-based review-request email in §1.7) — it just has no real content yet because no client has gone through the new flow since it shipped.
- The Outreach CRM (`/admin/outreach`, §1.7) has zero campaigns/prospects in it yet — it's a real, working tool, but someone has to actually create a campaign and paste in a prospect list before it does anything.

### 2.5 External Platforms (copy is ready, nothing is live)
- Google Business Profile — not yet set up/optimized with the prepared copy.
- Clutch profile — not yet created.
- GoodFirms profile — not yet created.
- GitHub organization — not yet created.
- Facebook Business page — not yet created.
- YouTube channel — not yet created; zero videos published.
- LinkedIn Company Page and Kamar's founder profile — copy is ready but not confirmed as pasted into the real profiles yet.
- Cold email outreach — templates exist, campaign not yet running.

### 2.6 Visitor Intelligence Platform (VIP) — Phases B/C/D not built, plus a real bug found on deploy
- Heatmaps, session replay, ISP/ASN/proxy/VPN detection, Company Intelligence, granular consent UI, RBAC/audit log for replay access, and the Privacy Policy rewrite are all **not built** — see §1.8 and `PHASE22-VIP-ARCHITECTURE.md`. Company Intelligence specifically needs a paid-vendor decision (Clearbit/Leadfeeder-class); session replay needs real legal review first, not just code.
- **Confirmed bug (2026-07-19 deploy): VIP geo capture (Module 2) produces zero data in production.** It reads Vercel edge headers (`x-vercel-ip-*`), but production is a self-hosted Hostinger VPS (PM2, `next start`), not Vercel — those headers never exist there. Needs a self-hosted MaxMind GeoLite2 lookup instead (free, zero recurring cost, works from the IP `clientIp()` already extracts) — not yet implemented.
- **Bigger, now-confirmed finding: production does not run on Vercel at all**, despite `vercel.json` existing in the repo with 5 cron entries (4 pre-existing + the new `vip-lead-scoring`). Vercel Cron only fires for apps actually deployed on Vercel — since this app runs via PM2 on a VPS instead, **none of the `vercel.json` cron entries can be firing from Vercel's side.** Whatever actually triggers the pre-existing 4 crons in production (`renewal-reminders`, `abandoned-orders`, `expire-coupons`, `workflow-triggers`) must be a separate mechanism outside this repo — most likely a real VPS crontab hitting these URLs with a `CRON_SECRET` bearer token (`lib/cron-auth.ts` supports exactly that path). **Action needed:** run `crontab -l` on the VPS to see what's actually scheduled, and add `/api/cron/vip-lead-scoring` (plus confirm `lead-followup`, `review-request`, `lead-nurture` — the 3 cron routes that were never even in `vercel.json`) to whatever that real schedule is. Until then, VIP lead scores only update when an admin manually opens a visitor's timeline (which computes fresh on-demand), not on the intended daily batch.

---

## 3. Suggested Next Priorities (in order)

1. ~~Clean up the QA test data in the production MongoDB~~ — **done 2026-07-11** (both audit rounds).
2. ~~Confirm the Lead → Deal handoff behavior~~ / ~~fix the 9 Medium/Low QA items~~ — **done** as part of the 20-task closure round.
3. ~~Fix the 6 small non-blocking items from the Round 2 fresh audit~~ — **done 2026-07-11** (§1.6.1). No open website-code gaps remain from either QA audit round.
4. ~~Get real GSC + Bing verification codes and an IndexNow key from Kamar~~ — Bing and IndexNow are done; only `NEXT_PUBLIC_GSC_VERIFICATION` is still missing.
5. Get real GTM / Meta Pixel / Microsoft Clarity / LinkedIn Insight / Google Ads IDs from Kamar and drop them into env vars — all the code is ready and waiting (§1.7, §2.2), this is purely a config step.
6. Actually set up Google Business Profile (highest ROI-for-effort of the external platforms) using the prepared copy.
7. Paste the LinkedIn Company Page and founder profile copy into the real profiles.
8. Create the first real Outreach CRM campaign (`/admin/outreach`) and start using the cold email/LinkedIn drafts-only flow (§1.7) to generate the first real leads through this whole system.
9. As real deals start closing, watch `/admin/revenue` and `/admin/conversion-events` for real numbers instead of the currently-empty charts — and confirm the first real review comes in through `/reviews` once a `Deal` hits `won`/`repeat` with a `contactEmail` on file.
10. **Run `crontab -l` on the production VPS** (§2.6) to find the real cron scheduler and add `/api/cron/vip-lead-scoring` to it — `vercel.json` cannot trigger anything here since production isn't on Vercel. While there, confirm `lead-followup`/`review-request`/`lead-nurture` (never in `vercel.json` either) are actually scheduled somewhere too.
11. Implement the MaxMind GeoLite2 fix for VIP geo capture (§2.6) — as deployed, Module 2 (Geo Analytics) silently collects nothing in production.
12. Watch `/admin/vip` for a few days once real traffic hits it, then decide on the Phase B/C/D questions in `PHASE22-VIP-ARCHITECTURE.md` §4 (heatmap/session-replay legal review, Company Intelligence vendor budget) with real usage data in hand instead of guessing upfront.
