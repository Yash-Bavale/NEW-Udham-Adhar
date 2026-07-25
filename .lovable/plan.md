## Scope
Two parallel workstreams. Both keep hardcoded content as fallback so nothing breaks when a Contentful entry is unpublished or missing.

---

## 1. Full body wiring — SEO articles + service pages

Currently only `metaTitle` / `metaDescription` / `H1` / (intro) overlay from Contentful. Body, FAQs, quickFacts, EEAT, and internal links still render from local JSON. This step lets editors change any text on a page from Contentful.

### 1a. Extend Contentful `seoArticle` model (manual, one‑time in Contentful UI)
Add these JSON fields (all optional, all Object type):
- `aiOverview` — `{ short, medium, long? }`
- `quickFacts` — array of `{ label, value }`
- `bodySections` — array of `{ heading, level, paragraphs[], subsections?[] }`
- `eeat` — `{ experience, expertise, trust, transparency, disclaimer }`
- `faqs` — array of `{ question, answer }`
- `internalLinks` — array of `{ href, anchor, reason? }`
- `howto` — array of `{ name, text }`
- `ctas` — `{ hero, middle, bottom, trust, benefits, why }`

Keep existing `metaTitle`, `metaDescription`, `title`, `canonicalUrl`, `slug`, `body`.

### 1b. Extend `servicePage` model
Add JSON fields:
- `bodySections` — same shape as above
- `faqs`, `internalLinks`, `ctas` — same shapes
- `heroImage` — Media (optional; falls back to sample certificate)

### 1c. Update migration scripts (run once)
- `/tmp/migrate-seo.mjs` v2: for each of the 20 SEO JSON files, push `aiOverview`, `quickFacts`, `body` → `bodySections`, `eeat`, `faq` → `faqs`, `internalLinks`, `howto`, `cta` → `ctas` into the existing entries as **draft updates** (editors publish when ready).
- `/tmp/migrate-services.mjs` v2: push service page hero/features/FAQs to matching entries.

### 1d. Update read layer (`src/lib/contentful/client.functions.ts`)
Extend `ContentfulSeoArticle` and `ContentfulServicePage` types to include the new fields. Parse them from `fields.*` with defensive fallbacks.

### 1e. Update page components (merge Contentful over local)
- `SeoContentPage.tsx` → accept optional `overrides: Partial<SeoPageData>` and deep‑merge over the local JSON at render time.
- `RichServicePage.tsx` → accept `overrides` for `intro` and `blocks`.
- All 20 SEO routes + 3 service routes wire `overrides` from the loader.

Result: editing any field in Contentful and publishing → live within ~60s. Unpublished field → local JSON continues to render.

---

## 2. Homepage extraction into Contentful (option 2a)

### 2a. New Contentful entries (auto-created by migration script)
- `heroSection` entry `home-hero` — headline, subheadline, primary/secondary CTA text, badges.
- `featureSection` entry `home-how-it-works` — steps (icon key + label).
- `featureSection` entry `home-why-us` — bullets.
- `landingPage` entry `home` — references the three sections above + `metaTitle` / `metaDescription` / `faqs` (relation to existing FAQ entries) / `ctas`.

### 2b. Migration script `/tmp/migrate-home.mjs`
Reads current constants (`HOMEPAGE_TITLE`, `HOMEPAGE_DESC`, `FAQS`, `HOW_IT_WORKS`, `WHY_BULLETS`, `STEPS`) from `src/routes/index.tsx` and creates the four entries as drafts.

### 2c. Read layer
Add `getContentfulLandingPage({ slug })` that returns the landing page + resolved hero + feature sections + FAQs.

### 2d. Wire homepage route
`src/routes/index.tsx` loader fetches `getContentfulLandingPage({ slug: "home" })`. Component reads overrides for hero/how-it-works/why/faqs/meta with the current hardcoded arrays as fallback. Icons stay in code (mapped by `icon` string key from Contentful).

---

## Technical notes

- Contentful models: user already created `heroSection`, `featureSection`, `landingPage` earlier in this project. Migration script will verify fields; if a required field is missing on the model, script prints a clear list of fields to add before retry.
- All JSON fields use Contentful's built-in "Object" (JSON) type — no rich text — so migration is deterministic and the read layer is a simple type cast.
- Rate-limit safe: CMA writes throttled to 6/sec (Contentful default).
- Cache: existing ~60s edge cache from Phase 3 applies to new fetchers.
- No schema changes to the database. No route additions. No new dependencies.

## Deliverables checklist

- [ ] Contentful model field additions (I'll list exact fields; you add via Contentful UI)
- [ ] `client.functions.ts` extended types + new `getContentfulLandingPage`
- [ ] `SeoContentPage.tsx` + `RichServicePage.tsx` accept overrides
- [ ] All 20 SEO routes + 3 service routes pass overrides
- [ ] Homepage route wired to landing page entry
- [ ] Migration scripts run once, populating entries as drafts
