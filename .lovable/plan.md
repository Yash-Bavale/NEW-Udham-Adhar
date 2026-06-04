## Goal

Two fixes:

1. **Replace the new/duplicate blocks** I built in `TrustBlock.tsx` with the **exact same** three sections already designed on the homepage (`src/routes/index.tsx`): FAQ, "Udyam Assistance Process – Fast & Simple", and "We provide consultancy services across India." with the India map image + facts table.
2. **Sync every SEO page** to the uploaded `Udyam website information.docx` (entries 1–130): correct page name, descriptive linked title, meta title/description (incl. og:*), and visible body content.

---

## Part 1 — Make the trust block identical to the homepage

Rewrite `src/components/site/TrustBlock.tsx` to render the three sections verbatim from `src/routes/index.tsx`:

- **FAQ** — same heading "Frequently Asked Questions for MSME registration in India.", same subhead, same 10 questions from the `FAQS` array in `index.tsx`, same accordion styling, same "Read More" button linking to `/faqs`. Keep `FAQPage` JSON-LD.
- **Process** — extract the JSX from `index.tsx` lines 163–193 unchanged: `bg-brand-navy/10` band, `UserSquare2 / Fingerprint / Share2 / Download` icons in `w-20`/`w-24` white circles, navy/red/navy/green color sequence, `ArrowRight` connectors.
- **India coverage** — extract lines 195–227 unchanged: bordered card, "We provide consultancy services across India." header, `<img src="https://udyamadhar.in/wp-content/uploads/2025/11/India-map-en.svg.webp" ... />`, and the FACTS table (Country/Area/States/Population/Literacy).

Move the shared FAQ + STEPS + FACTS constants into `TrustBlock.tsx` (or a tiny `home-blocks.ts`) and have `index.tsx` import them so the homepage and SEO/waiting pages render byte-identical sections. Delete `src/components/site/IndiaMap.tsx` (no longer used).

`SeoLandingPage.tsx`, `processing.$leadCode.tsx`, and `success.$leadCode.tsx` already import `<TrustBlock />` — no changes needed there.

## Part 2 — Sync all SEO pages to the docx

### 2a. Extract the source of truth

Run a one-off Node/Python script over `/mnt/user-uploads/Udyam_website_information_1.docx` (already parsed) that produces `seo-source.json` mapping each entry 1–130 → `{ number, name, slug, title, description }`.

- `name` = the heading text (e.g. "Udyam Apply", "MSME Certificate Download", "Udyog Aadhar").
- `slug` = name lowercased, non-alphanum → `-`, collapsed; with a small alias table for known mismatches (e.g. `udyam-adhar-2` ↔ entry "Udyam Adhar (2nd listing)", `https-udyamregistration-gov-in` ↔ entry "https udyamregistration gov in").
- `title` = the `**Title:**` line from the doc.
- `description` = the `**Meta Description:**` body (full long paragraph; we'll use the **first 155 chars** for meta and the **full text** for visible content).

### 2b. Update each route file

For every file in `src/routes/` that uses `<SeoLandingPage ... />` (≈130 files), the script rewrites:

- `meta.title` → `title` (full doc title, e.g. `"Udyam Apply – Apply for Udyam Registration Online"`)
- `meta.description` and `og:description` → first 155 chars of the doc description, ellipsised
- `og:title` → same as title
- `<SeoLandingPage title="..."` → short page name (e.g. `"Udyam Apply"`)
- `linkTitle="..."` → full doc title (so the underlined H2 on the page reads the descriptive title, fixing the screenshot bug)

### 2c. Render the docx description as page content

Extend `SeoLandingPage` to accept an optional `content?: string` prop. When provided, render it as the **first** paragraph block(s) inside the prose card, before the imported WP HTML. The script passes `content={"<full doc description>"}` on every route. WP HTML stays as supplementary content below.

This guarantees every page shows the long, unique descriptive paragraph from the doc (not the generic 3-line blurb in the screenshot).

### 2d. Sync the database labels

Run one Supabase migration to update `public.seo_pages.title` (or equivalent label column used by Nav/Footer) to the new short page names from the doc so internal navigation matches.

### 2e. Audit artifact

Write `/mnt/documents/seo-sync-report.md` listing every route, its old vs new title/linkTitle, and any docx entry that could not be matched to a route file so the user can review.

---

## Technical notes

- Doc parsing: reuse the already-parsed `tool-results://document--parse_document/...` output; split on `^\d+\.\s` headings, then pull the `**Title:**` and `**Meta Description:**` lines (some entries use plain `Title:` — handle both).
- Slug matcher must be deterministic; unmatched entries are logged, not silently skipped.
- All route-file edits are scripted with a single regex pass per file (title meta block + the `component: () => <SeoLandingPage ... />` line) — no per-file hand edits.
- No business-logic / backend changes beyond the one label-sync migration.

## Files

- Rewrite: `src/components/site/TrustBlock.tsx`
- Edit: `src/routes/index.tsx` (extract FAQS/STEPS/FACTS into shared module, import them)
- Edit: `src/components/site/SeoLandingPage.tsx` (add `content` prop)
- Edit: ~130 files under `src/routes/*.tsx` (scripted)
- Delete: `src/components/site/IndiaMap.tsx`
- New: `supabase/migrations/<ts>_sync_seo_page_labels.sql`
- New artifact: `/mnt/documents/seo-sync-report.md`