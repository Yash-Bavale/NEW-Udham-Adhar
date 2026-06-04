## Goal

1. Build one shared "trust block" — **FAQ + Udyam Assistance Process + India Map** (matching the screenshots).
2. Render it below the existing content on:
   - All 130 SEO landing pages
   - `/processing/$leadCode` (30-sec post-form wait — already exists)
   - `/success/$leadCode` (15-sec post-payment wait — already exists)
3. Sweep all SEO pages against `Udyam website information.docx` sequence and fix mismatched page name / form header / linked heading / meta title / meta description (e.g. nav link "Udyam Adhar 2" → "Udyam Adhar", per the annotated screenshot).

The waiting countdowns (30s / 15s) already exist — only their layout needs the trust block appended.

## Build steps

### 1. New shared component
Create `src/components/site/TrustBlock.tsx` containing three sections, styled to match the screenshots:

- **FAQ section** — title "Frequently Asked Questions for MSME registration in India.", subtitle "MSME BUSINESS HELP SERVICES ONLINE, SSI – SMALL SCALE INDUSTRIES CERTIFICATE – UPDATE, EDIT, AND DOWNLOAD ACKNOWLEDGEMENT". 10 accordion items pulled from existing `src/lib/faqs-data.ts` (so we don't duplicate copy). Followed by a "Read More →" button linking to `/faqs`. Each accordion item is also emitted as `FAQPage` JSON-LD for SEO.
- **Process section** — heading "Udyam Assistance Process – Fast & Simple", 4 steps with lucide icons + arrows between them: Fill Form & Make Payment → Submit Required Information → Expert Assistance & Verification → Updates Shared via Email. Light slate background panel.
- **India Map section** — heading "We provide consultancy services across India." Render the political map of India as an inline static SVG (no external deps, no interactivity), with state labels matching the reference image. Bundled in `src/components/site/IndiaMap.tsx` and imported by `TrustBlock`.

Uses semantic tokens (`brand-navy`, `muted`, etc.) — no raw hex.

### 2. Wire into SEO pages
Edit `src/components/site/SeoLandingPage.tsx` once — append `<TrustBlock />` after the existing content/form area. Because all 130 SEO routes render through this component, no per-route edits are needed.

### 3. Wire into waiting pages
- `src/routes/processing.$leadCode.tsx` — append `<TrustBlock />` below the existing 30-sec animated card.
- `src/routes/success.$leadCode.tsx` — append `<TrustBlock />` below the existing 15-sec countdown card.

### 4. Title / sequence audit
Parse `Udyam website information.docx` keyword sequence (entries 1–130) and compare against every `src/routes/*.tsx` SEO route. For each mismatch, fix one or more of:
- **Form header / link title** passed to `<SeoLandingPage title=… linkTitle=… />` — fixes nav labels like "Udyam Adhar 2" → "Udyam Adhar".
- `meta.title` / `og:title` in `head()`.
- `meta.description` / `og:description` in `head()`.

The route slug itself stays (changing it would break sitemap + indexed URLs) — only the displayed names/headers and meta are corrected. Where the doc provides full Meta Title / Meta Description copy (entries 1–70 and selected later entries), we use it verbatim; otherwise we keep the existing generated copy and only correct the visible name.

A short audit report is written to `/mnt/documents/seo-name-audit.md` listing each route changed and what was changed.

### Out of scope
- No changes to the 30s/15s countdown timings themselves — they already match the spec.
- No URL/slug changes, no sitemap rebuild, no DB writes.
- No new routes, no design system changes.
- Map is static SVG only (no hover interactivity, no map library).

## Files

**New**
- `src/components/site/TrustBlock.tsx`
- `src/components/site/IndiaMap.tsx`

**Edited**
- `src/components/site/SeoLandingPage.tsx` (append `<TrustBlock />`)
- `src/routes/processing.$leadCode.tsx` (append `<TrustBlock />`)
- `src/routes/success.$leadCode.tsx` (append `<TrustBlock />`)
- A subset of `src/routes/*.tsx` SEO route files where name / header / meta mismatch the sequence doc (driven by audit script).

**Artifact**
- `/mnt/documents/seo-name-audit.md`
