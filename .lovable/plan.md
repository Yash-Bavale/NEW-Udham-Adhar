# Udyam SEO Recovery Implementation Plan

Scope is **public website only** (marketing pages + SEO). No CRM, admin, payment, workflow, or backend logic is touched. Existing layouts (`SiteShell`, `Header`, `Footer`, `LeadForm`, `DisclaimerBar`) stay as-is — we only edit their content/props and add new content blocks.

---

## Phase 1 — CRITICAL fixes (sitewide)

1. **Prominent disclaimer banner** above header on every public route.
  - Update `src/components/site/DisclaimerBar.tsx` to render an amber/yellow banner with the verbatim copy from §3.2: "Business Help Services is a private registration consultancy. We are not affiliated with… The official government portal for Udyam registration is udyamregistration.gov.in."
  - Ensure it sits above `Header` inside `SiteShell` and is visible on load (no JS gating). Admin routes unaffected.
2. **robots.txt** — confirm `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` are not blocked (current file allows all; no change needed, just verify).

## Phase 2 — Homepage rewrite (`src/routes/index.tsx`)

Replace marketing copy only; keep `LeadForm`, hero map, layout structure intact.

- **Meta**: title → `"Udyam Registration Assistance | MSME Certificate Help — Business Help Services"`; description → §3.1 copy; H1 (visible English) → `"Udyam Registration & MSME Certificate Services"`.
- **TLDR block** (§3.3): 3 paragraphs of crawlable HTML right below the form, keyword in first 40 words.
- **How It Works** (§3.4): 6 numbered steps.
- **Why Choose Us** (§3.5): paragraph + 5 bullets.
- **FAQ section** (§3.6): 8 Q&A pairs, **answers visible by default** (open Accordion or plain `<details open>` / static markup) so crawlers see them. Keep current accordion component but default open or render as static `<dl>`.
- **Served States** (§3.7).
- **JSON-LD**: replace current `@graph` with Organization (§6.1 with phone/address/sameAs) + FAQPage (§6.2, 4-question minimum from doc).

## Phase 3 — Existing service pages rewrite

Update content + meta + add Service & BreadcrumbList JSON-LD on:

- `src/routes/new-udyam-registration.tsx` — §4.1 (TLDR, eligibility, documents, process steps, mistakes, E-E-A-T, 4 FAQs).
- `src/routes/download-udyam-certificate.tsx` — §4.2.
- `src/routes/update-udyam-certificate.tsx` — §4.3.
- `src/routes/migrate-udyog-aadhaar-to-udyam.tsx` — §4.4.

Each: update title/meta/H1 from doc table; render FAQs as crawlable HTML; inject Service + BreadcrumbList JSON-LD via `head().scripts`.

## Phase 4 — New / replaced pages

1. `**/verify-udyam-certificate**` — new route file `src/routes/verify-udyam-certificate.tsx` with §5.1 content + Service + Breadcrumb + FAQPage JSON-LD.
2. `**/msme-registration-fee**` — route exists; replace body with §5.2 content + schema.
3. `**/udyam-registration-process**` — new route file with §5.3 content + HowTo schema (§6.4) + Breadcrumb. (Existing `msme-registration-process.tsx` is kept and internally links to the canonical new page.)

All three reuse `ServicePageLayout` / `ArticlePageLayout` so visual style matches existing pages.

## Phase 5 — Schema helper

Add `src/lib/seo/jsonld.ts` exporting small builders (`orgSchema`, `faqSchema(items)`, `serviceSchema({name,url,description})`, `howToSchema(steps)`, `breadcrumbSchema(items)`) so each route's `head().scripts` stays one-liner and consistent.

## Phase 6 — Sitemap

Update `src/routes/sitemap.xml.ts` (or static `public/sitemap.xml`) to include the three target URLs (`/verify-udyam-certificate`, `/msme-registration-fee`, `/udyam-registration-process`) if not already present. No other changes.

---

## Out of scope (explicit)

- No changes to admin/CRM, payments, emails, workflows, or DB schema.
- No deletion of the 100+ existing variant routes — they continue to absorb typo/variant traffic.
- No visual redesign; reuses existing layout components and tokens.
- No new dependencies.

## Verification

- `bun run typecheck` clean.
- Spot-check `/`, `/new-udyam-registration`, `/download-udyam-certificate`, `/update-udyam-certificate`, `/migrate-udyog-aadhaar-to-udyam`, `/verify-udyam-certificate`, `/msme-registration-fee`, `/udyam-registration-process` render with disclaimer banner, visible FAQs, JSON-LD in `<head>`.
- Validate one JSON-LD block with Rich Results Test post-publish.

## do it in phase 1 + phase 2 the phase 3 + phase 4 + phase 5