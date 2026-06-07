## Goal

Import all 55 pages from `New_Blog_Style_udyam_seo_content.js` and serve them at `/{slug}` using the existing SEO landing layout — so every new page has the same look as your current pages: lead form + Sample Certificate on top → SEO content in the middle → TrustBlock at the bottom (which already contains "Udyam Assistance Process – Fast & Simple" + "We provide consultancy services across India").

## Approach (no new route files — DB-driven)

We already have an article infrastructure (`seo_pages.page_type='article'` + splat route `/$.tsx` + `ArticlePageLayout`). Instead of generating 55 route files, we:

1. **Bulk-insert all 55 pages into `seo_pages`** as `page_type='article'`, with `h1`, `meta_title`, `meta_description`, and a `sections` JSONB built from `content[]`.
2. **Group consecutive `content[]` items into sections** so the renderer can stream them:
   - `h2` / `h3` → starts a new section with that heading
   - `body` / `bullet` → appended into that section's `body_html` (bullets wrapped in a single `<ul>`)
   - `faq_q` + `faq_a` pairs → collected into the row's `faq` JSONB array (powers FAQPage JSON-LD + accordion)
3. **Switch the article layout to match service pages** so the user-visible structure is identical:
   - Top: `<LeadForm>` + Sample Certificate card (same component fragment as `ServicePageLayout`)
   - Middle: H1 + intro + looped sections (`h2`/`h3`/`<p>`/`<ul><li>`) + styled FAQ block
   - Bottom: `<TrustBlock />` (already includes the two standard sections)
4. **Resolve 8 slug collisions** with existing routes by appending `-guide` to the imported article's slug. The 8 collisions are:
   `udyam-certificate-download`, `udyam-portal`, `udyam-registration-download`, `udyam-registration-form`, `udyam-registration-number`, `udyam-registration-online`, `udyam-registration-update`, `udyog-aadhaar`.
   These will be imported as e.g. `/udyam-portal-guide`. (Existing file-based routes keep their current URLs unchanged.)
5. **SEO admin**: the SEO admin list already reads from `seo_pages`. The 55 new rows will appear there automatically as a separate group ("Articles"). We'll add a small `page_type` badge + filter so you can manage them as a child group under your existing SEO pages list.
6. **Sitemap + llms.txt**: both already pull from `seo_pages.enabled = true`, so all 55 new URLs (with proper `<lastmod>`) get picked up automatically — no extra work.

## Files touched

- `src/components/site/ArticlePageLayout.tsx` — restructure to: LeadForm + Sample Cert (top) → article content → TrustBlock. Keep Article + Breadcrumb + FAQPage JSON-LD.
- `src/routes/$.tsx` — already routes article slugs; no change.
- `scripts/import-seo-articles.ts` (one-shot import script) — parses the upload, transforms `content[]` → `{sections, faq}`, upserts to `seo_pages` via admin client.
- `src/routes/seo-admin.tsx` (or current SEO admin component) — add `page_type` column + filter so articles show as a child group.

## Open question

The upload uses lots of em dashes, INR ₹, and quoted asides. Should I pass `body` text through as plain `<p>` (recommended, matches your blog feel) or do any light formatting like auto-linking the brand name "udyamadhar.in"? Default: plain `<p>`, no auto-linking.

## What you'll see after this runs

- 55 new URLs live at `/{slug}` (e.g. `/udyam-registration`, `/msme-login`, `/udyog-aadhaar-guide`).
- Each page: form + sample cert → H1 → structured H2/H3/paragraphs/bullets → FAQ accordion → TrustBlock with the two standard sections.
- Each page emits unique `<title>`, `<meta description>`, canonical, Article + BreadcrumbList + FAQPage JSON-LD.
- All 55 URLs appear in `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`.
- All 55 manageable from SEO admin (enable/disable, sort, edit).
