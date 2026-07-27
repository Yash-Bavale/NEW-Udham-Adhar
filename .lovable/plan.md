## Part 1 — Audit: what's hardcoded vs dynamic today

### Already dynamic (per website, from the `websites` table via `useBrand()`)
Resolved server-side from the Host header (`current-website.server.ts` → `getCurrentBrand`), so a second domain already gets its own values:
- Brand name, legal entity, company name
- Support email, support phone, WhatsApp number, business hours
- Primary colour, logo, favicon, sample certificate image
- Legal footer disclaimer line, Google site verification, GA tag, base URL

### Already dynamic (from the database / Contentful)
- Services list shown in the lead form (`services` table, scoped per website)
- SEO landing pages list (`seo_pages` table) — powers the hidden footer link tree
- Article pages served by the catch-all `/$` route (DB-backed)
- Homepage meta title/description + FAQs, service pages and SEO articles can be overridden by Contentful, with local JSON as fallback

### Hardcoded in code (the actual problem list)
| Item | Where | Why it hurts a second site |
|---|---|---|
| Top nav links (10 items) | `src/lib/constants.ts` → `NAV_LINKS` | Same menu forced on every domain |
| Footer "Useful Links" (13 policy links) | `Footer.tsx` → `FOOTER_LINKS` | Can't reorder/hide per site |
| Footer "Get in touch" postal address | `Footer.tsx` (Pune address string) | Wrong for a different entity |
| Footer copyright line | `Footer.tsx` | Partly hardcoded ("Business Help Services") |
| Footer SEO-tree categories + unlock password `113355` | `Footer.tsx` (`CATEGORIES`) | Slug groups + password baked in code |
| Disclaimer bar text | `constants.ts` → `DISCLAIMER_TEXT` | Names one company |
| Homepage FAQs, "How it works", "Why us", steps, India facts | `routes/index.tsx` | Only meta+FAQ have a Contentful override; the rest is fixed |
| Homepage canonical / og:url | `routes/index.tsx` (`https://udyamadhar.in/`) | Second domain would emit the wrong canonical |
| Service prices `₹99` + slugs | `constants.ts` → `SERVICES` | Duplicate of the `services` table |
| 13 policy pages | one route file each + `content/wp/*.html` | Brand names baked into the HTML |
| ~180 legacy WP SEO route files | `src/routes/*.tsx` | New site can't get them without copying files |
| `src/lib/brand.ts` constants | still imported in places (e.g. `/$` route `BASE_URL`) | Bypasses per-site brand |

### Structural verdict
The **brand layer** is solid; the **content/navigation layer** is not. Everything in the table above needs to move to per-website records so a new domain is a data setup, not a code fork.

---

## Part 2 — Target structure (hybrid, as chosen)

- **CRM database** owns structure & config: navigation, footer link groups, contact block, homepage section content, disclaimer, per-site canonical.
- **Contentful** stays the source for long-form SEO/article/landing copy, with DB/local fallback (unchanged).
- **Policy pages keep their route files**, but the HTML is run through a brand-token renderer at request time so `{{company}}`, `{{site_name}}`, `{{support_email}}`, `{{address}}`, `{{legal_entity}}`, `{{base_url}}` resolve per website.

---

## Part 3 — Phase 1 build

### 1. Schema (one migration)
- `site_nav_items` — website_id, label, path, group (`header` | `footer`), parent_id, sort_order, is_active, open_in_new
- `site_content_blocks` — website_id, block_key (e.g. `home.hero`, `home.how_it_works`, `home.why_us`, `home.faqs`, `home.facts`, `disclaimer.bar`, `footer.address`, `footer.copyright`), content JSONB, is_active, sort_order
- Extend `websites` with: `postal_address`, `footer_unlock_code`, `canonical_base` (if not already covered by domain)
- Public read via `anon` SELECT on active rows only; writes limited to admin/super-admin; `service_role` full. GRANTs included per table.
- Seed both tables with the current live values for the existing website, so nothing on udyamadhar.in changes visually.

### 2. Server layer
- `src/lib/websites/site-content.functions.ts` — `getSiteContent()` server fn returning `{ nav, footerGroups, blocks }` for the resolved website, cached alongside the existing brand resolution.
- Load it once in `__root.tsx` next to `getCurrentBrand` and expose through a `SiteContentProvider` (mirrors `BrandProvider`).

### 3. Component rewiring (presentation only)
- `Nav.tsx` — read header nav from context, fall back to `NAV_LINKS` when empty.
- `Footer.tsx` — Useful Links, address, copyright, unlock code from context; SEO tree logic untouched.
- `DisclaimerBar.tsx` — text from `disclaimer.bar` block, fallback to constant.
- `routes/index.tsx` — FAQs / how-it-works / why-us / facts read from blocks (Contentful override still wins for meta+FAQ); canonical & og:url built from `brand.baseUrl`.
- Policy routes — `WpPage` gains brand-token substitution; no route files removed.

### 4. Admin editor
New `admin.websites.content.$websiteId` screen (linked from the existing websites admin):
- Website picker + brand fields (address, unlock code, contact)
- Navigation tab: drag-order, add/edit/remove header and footer links, active toggle
- Content blocks tab: edit hero copy, how-it-works steps, why-us bullets, FAQs, facts as repeatable rows
- Preview link opens the site on that domain

### 5. Launching site #2 afterwards
Insert one `websites` row, its services scope, then clone nav/footer/content blocks from the primary with one "Copy content from…" action in the admin — no code changes.

### Out of scope for phase 1 (flagged for later)
- Converting the ~180 legacy WP route files to database-driven pages
- Removing `src/lib/brand.ts` fallbacks entirely
- Per-website Contentful space/token wiring (columns exist, not yet used)

### Technical notes
- All reads are SSR-safe server functions on public routes (no auth middleware), so prerender won't 401.
- Fallback constants stay in code, so a DB miss or new domain never renders an empty nav/footer.
