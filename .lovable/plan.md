# Contentful CMS Integration — Full Content Migration

Since you're the only editor and want everything editable with fresh SSR, we'll roll this out in phases so nothing breaks in production. Each phase is shippable on its own.

---

## Phase 0 — Connect Contentful (5 min)

1. You create a free Contentful account + space at contentful.com.
2. I open Lovable's Contentful connector (managed auth, no API keys to paste). You approve the link.
3. Verify gateway call works: `GET /spaces/{id}/content_types`.

**Deliverable:** Connected. Env vars `CONTENTFUL_SPACE_ID`, `CONTENTFUL_API_KEY` live in server runtime.

---

## Phase 1 — Content Modeling in Contentful

I'll give you a step-by-step doc + a script that programmatically creates these content models via Contentful Management API:

| Model | Purpose | Key fields |
|---|---|---|
| `seoArticle` | `/seo-batch1/*` articles + `seo_pages` article type | slug, h1, metaTitle, metaDescription, intro, sections (rich text), faq (JSON), coverImage, relatedSlugs |
| `servicePage` | Udyam service pages (registration, certificate, etc.) | slug, h1, hero copy, intro, blocks (rich text), sampleCertImage, price, faq |
| `landingPage` | Homepage + generic marketing | slug, sections (modular: Hero, TrustBlock, FAQ, CTA references) |
| `siteSetting` | Header nav, footer, disclaimer, contact info | key, value (JSON/text) |
| `emailTemplate` | E001–E012 transactional bodies | code (E001), subject, htmlBody (rich text), variables |
| `faq` | Reusable Q&A entries | question, answer |
| `author` / `category` | Optional taxonomy for articles | name, slug, bio |

**Deliverable:** Space is set up, models exist, ready to receive content.

---

## Phase 2 — Migration Scripts (one-time)

Server functions that read existing content and push to Contentful via Management API:
1. `migrate-seo-json.ts` — 20 JSON files in `src/content/seo-batch1/` → `seoArticle` entries.
2. `migrate-seo-pages-db.ts` — all `seo_pages` rows (article + landing) → `seoArticle` / `landingPage` entries.
3. `migrate-services.ts` — hardcoded service copy in `RichServicePage` usage → `servicePage` entries.
4. `migrate-emails.ts` — `email_templates` table → `emailTemplate` entries.
5. `migrate-site-settings.ts` — footer, header, contact copy → `siteSetting` entries.

Run once, verify in Contentful UI, then move on.

**Deliverable:** All content lives in Contentful. Nothing removed from code yet — old sources still fallback.

---

## Phase 3 — Read Layer

`src/lib/contentful/` module:
- `client.server.ts` — gateway fetch wrapper (LOVABLE_API_KEY + CONTENTFUL_API_KEY headers).
- `queries.ts` — typed helpers: `getArticle(slug)`, `getServicePage(slug)`, `getLandingPage(slug)`, `getSiteSetting(key)`, `getEmailTemplate(code)`, `listArticles()`.
- `resolvers.ts` — resolve linked entries and assets (Contentful returns `sys.Link` refs, not embedded data).
- `rich-text.tsx` — `@contentful/rich-text-react-renderer` component mapping Contentful nodes to your existing Tailwind classes (mirrors `RichServicePage`'s `Block` renderer).

All server-side. Fresh on every request (SSR mode = no cache) per your choice.

**Deliverable:** Can fetch and render any Contentful entry.

---

## Phase 4 — Swap Routes to Contentful

Route by route, replace data source in loader:

1. **SEO articles** (`/[slug]` catch-all) — `getArticleBySlug` → `getArticle(slug)` from Contentful. Head meta pulled from CMS fields.
2. **Service pages** — `RichServicePage` fed by Contentful `servicePage` entry.
3. **Homepage** — modular sections rendered from `landingPage.sections`.
4. **Footer / Header / Disclaimer** — pull from `siteSetting`.
5. **Emails** — `emails.functions.ts` loads body from `emailTemplate` instead of DB/hardcoded.

Each swap: verify SSR renders correctly, `head()` metadata matches, canonical/og:image populated from CMS fields.

**Deliverable:** Every page reads from Contentful.

---

## Phase 5 — Retire Old Sources

After 1 week of stability:
- Delete `src/content/seo-batch1/*.json`.
- Drop `seo_pages` table (keep migration for history).
- Remove `RichServicePage` hardcoded content usage.
- `email_templates` table becomes fallback only (or dropped).

**Deliverable:** Contentful is the single source of truth.

---

## Phase 6 — Editor Workflow Polish

- Configure Contentful preview URLs so "Open Preview" from an entry opens the live page.
- Add webhook `POST /api/public/contentful-revalidate` — Contentful pings this on publish to bust any future edge cache (not needed now since you chose fresh SSR, but future-proof).
- Document field guidelines (title length, meta description limits) in Contentful's "help text" per field.

---

## Trade-offs You Should Know

- **Fresh SSR (your choice)** adds ~100–300ms per page for the Contentful fetch. Fine at your traffic; if you scale, we add a 5-min cache header.
- **Contentful free tier:** 25,000 records, 5 users, 2M API calls/month. Your ~50 pages + emails fit easily.
- **Rich text learning curve:** editing structured content in Contentful is different from Markdown — I'll set up the editor so it feels natural (headings, lists, callouts, tables).

---

## What I need from you to start

1. Create Contentful account → I'll trigger the connector link.
2. Confirm phase order or adjust priorities (e.g. do emails last, or homepage first).

Reply "go" and I'll start Phase 0 (connector) + Phase 1 (models). Or tell me which phase to prioritize.
