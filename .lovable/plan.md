## SEO/Content Regression Check — Batch 1 (20 routes)

Goal: verify each of the 20 new SEO pages renders the expected visible content and correct head metadata against the source JSON in `src/content/seo-batch1/`.

### Scope (20 routes)
udyam-registration, udyam-registration-online, udyam-certificate, msme-registration, udyam-registration-process, udyam-registration-number, udyam-registration-status, udyam-registration-fee, udyam-registration-free, udyam-registration-benefits, udyam-registration-eligibility, udyam-registration-documents-required, udyam-registration-certificate, udyam-registration-update, udyam-login, forgot-udyam-registration-number, download-udyam-certificate, print-udyam-certificate, verify-udyam-certificate, msme-certificate-benefits, udyam-certificate (+ download alt).

### Approach

1. **Static audit (source of truth check)**
   - Read `SeoContentPage.tsx` to confirm it renders each required block: H1, AI Overview, Quick Facts, body sections, internal links, EEAT disclaimer, FAQ accordion, CTA.
   - Read each of the 20 route files to confirm they wire `head()` with title, description, og:title/description/url/type, canonical link, and JSON-LD schemas from the JSON data.
   - Diff route `head()` output vs source JSON meta fields.

2. **Rendered audit (Playwright)**
   - Script iterates all 20 URLs on `http://localhost:8080`.
   - For each: capture rendered `<h1>`, count Quick Facts items, presence of EEAT block, count FAQ accordion items, count CTAs and internal links, and read `document.title`, meta description, canonical href, og:url, first JSON-LD block.
   - Compare against expected values parsed from the matching JSON.
   - Emit a table: route | H1 match | QuickFacts count vs expected | EEAT present | FAQ count vs expected | Canonical correct | Meta title/desc match | JSON-LD types present.

3. **Report**
   - List routes that pass fully.
   - List each failing route with the specific mismatch (missing block, wrong canonical, truncated meta, missing FAQ items, etc.).
   - No code changes in this task — findings only. Fixes come in a follow-up once you approve the diff list.

### Out of scope
Redirect chain checks, image/OG image validation (per original build), Section 15 image SEO, non-batch-1 routes.
