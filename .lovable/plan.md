## Decisions locked in
1. **One sitemap only** — keep `/sitemap.xml` as the single sitemap (no index split). Just upgrade the existing route with `<lastmod>` and better priorities.
2. **Flat URLs** — new 56 SEO pages use `/{slug}` like the existing pages (no `/learn/` prefix).
3. **Contact** — replace `helpudyamadhar@gmail.com` with `help@businesshelpservices.com` everywhere.
4. **Legal entity wording** — add "operated by Business Help Services" only on legal/policy pages (Disclaimer, Privacy, T&C, Refund, Grievance, AML, Compliance, Cookie). Brand name "Udyam Aadhar" stays everywhere else.

---

## Answers recap

- **Nothing is fetched from the live WP site** — all content is local in `src/content/wp/*.html`. Rendered by TanStack routes.
- **Sitemap is functional** — pulls static routes + enabled `seo_pages` rows from DB. We'll add `<lastmod>` + better priorities.
- **No `llms.txt` / `llms-full.txt` yet** — we'll add both so ChatGPT / Perplexity / Claude can index the site.
- **Indexing vs ranking** — we can guarantee indexing (sitemap + GSC + internal links); #1 ranking depends on Google but we'll maximize the signals.

---

## Plan

### A. Brand & contact unification
1. Create `src/lib/brand.ts` with constants:
   - `SITE_NAME = "Udyam Aadhar"`
   - `LEGAL_ENTITY = "Business Help Services"`
   - `CONTACT_EMAIL = "help@businesshelpservices.com"`
   - `BASE_URL = "https://udyamadhar.in"`
2. Global find/replace `helpudyamadhar@gmail.com` → `help@businesshelpservices.com` across components, email templates, policy HTML, JSON-LD.
3. Add "Operated by Business Help Services" line **only** on legal/policy pages: Disclaimer, Cookie, AML, Compliance, Grievance, Complaint policy, Consent, Payment notice.
4. Update Footer contact email + email-template footers (`care@udyamadhar.in` line in `client-info-request.tsx`).
5. Update Organization/LocalBusiness JSON-LD in `src/routes/index.tsx` and `__root.tsx`: switch contact email, add `legalName: "Business Help Services"`, keep `name: "Udyam Aadhar"`.

### B. Sitemap upgrade (single file)
Modify `src/routes/sitemap[.]xml.ts`:
- Select `slug, updated_at` from `seo_pages` and emit `<lastmod>` from it.
- Static routes get build-time date.
- Bump priority for top routes (`/`, top 5 service slugs) to `0.9`.
- Keep everything in one `/sitemap.xml`.

`public/robots.txt` already references it — leave as-is, add `Sitemap:` line for `llms.txt`.

### C. AI-search files
1. **`src/routes/llms[.]txt.ts`** → `/llms.txt`: curated markdown index (brand intro + service list + link list of every public + enabled SEO page).
2. **`src/routes/llms-full[.]txt.ts`** → `/llms-full.txt`: concatenated plain-text content of every page (strip HTML from `src/content/wp/*.html` + DB-stored content).

### D. Per-page SEO hardening
1. Extend `ServicePageLayout` / `SeoLandingPage` to accept and emit per-page JSON-LD: `WebPage` + `BreadcrumbList`, plus `Service` schema where applicable.
2. Audit every existing route's `head()` — guarantee unique `title`, `description`, `og:title`, `og:description`, and `canonical` (canonical only on leaves, never `__root.tsx`).
3. Add "Related services" internal-link block at the bottom of every SEO page (3–5 links each), driven by a `related[]` field.

### E. 56 new SEO pages — schema for blog-style content at flat `/{slug}`

Since both existing service pages and new article pages will share the `/{slug}` namespace, we add a `type` discriminator on `seo_pages` and a router that picks the right layout.

**DB migration:**
```sql
ALTER TABLE public.seo_pages
  ADD COLUMN IF NOT EXISTS page_type text NOT NULL DEFAULT 'service'
    CHECK (page_type IN ('service','article')),
  ADD COLUMN IF NOT EXISTS h1 text,
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS intro text,
  ADD COLUMN IF NOT EXISTS sections jsonb,        -- [{h2, h3?, body_html}]
  ADD COLUMN IF NOT EXISTS faq jsonb,             -- [{q, a}]
  ADD COLUMN IF NOT EXISTS cover_image_url text,
  ADD COLUMN IF NOT EXISTS related_slugs text[],
  ADD COLUMN IF NOT EXISTS published_at timestamptz DEFAULT now();
```
(Re-grant + RLS preserved.)

**Routing:**
- The existing `src/routes/$.tsx` splat already catches unknown slugs — extend its loader to:
  1. Look up the slug in `seo_pages`.
  2. If `page_type='service'` → render existing `SeoLandingPage`.
  3. If `page_type='article'` → render new `ArticlePageLayout` (H1 → intro → sections → FAQ → related links).
- Article pages emit JSON-LD: **Article + BreadcrumbList + FAQPage** (distinct `@id`s, no collision with homepage Organization graph).
- `head()` populates `title`/`description` from `meta_title`/`meta_description`, canonical from slug.

**Ingestion:**
- When you send the PDF / DOC / JS file, parse it into rows and bulk-insert via a one-off script or admin bulk-import.
- Existing slugs upgraded to articles by setting `page_type='article'` and filling the article fields (or kept as services if both intents apply).

**Collision rule:** If a flat `/{slug}` exists as both a static route file AND a DB row, the static route wins (TanStack matches files before the splat). We'll list current static slugs so your 56 new ones don't collide.

### F. Verify in Search Console
After deploy: resubmit `/sitemap.xml`, request indexing for top 10 pages, monitor weekly.

---

## What I need from you to start Phase E
The PDF/DOC/JS file with the 56 pages — each page should include: `slug`, `h1`, `meta_title`, `meta_description`, `intro`, list of `sections` (h2/h3/body), optional `faq`, and `related_slugs`.

Ready to switch to build mode and execute A → D now; I'll do E (article layout + bulk import) the moment you drop the file.