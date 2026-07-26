# Multi-site template — second domain on same codebase & CRM

You picked: **same project, second domain** + homepage/policies/lead-payment-onboarding + per-site brand/cert/services + **separate Contentful space per site**. No SEO pages seeded — you'll add those from Contentful later.

## What this gives you
- Add a new domain in Project Settings → Domains. It resolves to a `websites` row and instantly serves its own brand, logo, sample certificate, services, prices, policy pages, and homepage copy.
- All leads/orders from both domains land in the same CRM, tagged with `website_id`. Employee permissions already scope by website.
- Adding a third site later = one row in `websites` + one Contentful space + one DNS change. No new codebase.

---

## Phase 1 — Per-website config in DB
Extend `public.websites` with the fields that today are hardcoded in `src/lib/brand.ts`:

- `brand_name`, `legal_entity`, `company_name`
- `support_email`, `support_phone`, `whatsapp_number`, `business_hours`
- `primary_color` (hex), `logo_asset_url`, `favicon_asset_url`
- `sample_certificate_asset_url`
- `contentful_space_id`, `contentful_delivery_token` (nullable — token stored as secret ref, not raw)
- `legal_footer_line`, `google_site_verification`, `gtag_id` (nullable)

Backfill the udyamadhar.in row from current `brand.ts` constants so behaviour doesn't change.

## Phase 2 — Runtime brand resolver
- New `src/lib/websites/current-website.server.ts`: resolves the active `websites` row from the Host header (extends `resolveWebsiteIdFromRequest`) and caches per-request.
- New public server fn `getCurrentBrand()` returning safe brand fields to the client.
- New `<BrandProvider>` in `__root.tsx` loader → context; `useBrand()` hook.
- Replace direct imports of `SITE_NAME`, `BASE_URL`, `SUPPORT_EMAIL`, logo, etc. in `Header`, `Footer`, `LeadForm`, policy pages, email templates, JSON-LD, and `__root` head with `useBrand()` / server equivalents. `brand.ts` becomes a fallback only.
- Homepage `certImg` becomes `brand.sampleCertificateAssetUrl` (falls back to current asset if unset).

## Phase 3 — Per-website services
- `services` already exists; add join table `website_services (website_id, service_id, is_active, price_override, sort_order)` OR reuse existing multi-website wiring if present.
- Lead form + pricing on the public site query only services enabled for the current `website_id`.
- Admin: existing services UI gets a "Available on websites" multi-select per service; new site starts with the catalog empty until you tick services.

## Phase 4 — Contentful per site
- Add `contentful_space_id` + delivery-token secret name to the `websites` row.
- `src/lib/contentful/client.functions.ts` becomes website-aware: builds the client from the current website's space + token, caches by space id.
- Homepage/FAQs/policy pages fetch the current site's Contentful `landingPage` / `faq` / `page` entries with local defaults as fallback (existing pattern preserved).
- New site starts pointing at a **new empty Contentful space** you create; you can duplicate models via the CMA script pattern we already used.

## Phase 5 — Second-site scaffolding (no SEO pages)
Keep in scope for the new domain out-of-the-box:
- `/` — homepage layout (hero, LeadForm, sample cert, how-it-works, why-us, FAQs, India map). All content Contentful-driven with the current homepage as fallback template.
- Policy routes: `/privacy`, `/terms`, `/refund-policy`, `/disclaimer`, `/about`, `/contact`. Same pattern — Contentful `page` entry keyed by slug, fallback to current pages' text.
- Lead form → payment → onboarding form → CRM: unchanged, just tagged with `website_id`.
- Admin/CRM routes stay on the primary domain only (gate `/admin/*` in `__root` to primary host to avoid duplicate indexing).

Explicitly **not** included per your ask: no SEO landing pages, no service pages seeded. You'll create those in Contentful when ready.

## Phase 6 — Onboarding a new site (one-time flow)
1. In Contentful, create a new space; migrate the shared models (fresh script clone).
2. In Admin → Websites, click **Add site**: enter domain, brand, colors, upload logo + sample cert, paste Contentful space id, save.
3. Add the delivery token as a Lovable secret (name saved on the row).
4. Add the domain in Project Settings → Domains (both root + www), point DNS to 185.158.133.1.
5. In Admin → Services, tick which services this site sells and set price overrides.

## Technical notes
- `websites` today has no brand fields; migration is additive and idempotent.
- `resolveWebsiteIdFromRequest` already exists — brand resolver extends it, doesn't replace it.
- Publishable Contentful tokens are safe in code paths that ship to client; delivery token per site stays server-side and is fetched via server fn.
- Robots/sitemap becomes per-host: `sitemap.xml` returns entries for the current site's Contentful entries + service pages that site sells.
- Admin routes served only on primary host → avoids duplicate `/admin` indexing on the new domain.

## Out of scope for this change
- Actual domain purchase/DNS (you do that in Project Settings → Domains).
- Creating the new Contentful space + model migration script run (I'll create the script; you run it against the new space or I run it once you paste the new CMA token).
- Any SEO/service page authoring — you'll do that in Contentful post-launch.

## Deliverable checklist
- [ ] Migration: extend `websites`, seed udyamadhar.in row from `brand.ts`.
- [ ] `getCurrentBrand` server fn + `<BrandProvider>` + `useBrand()`.
- [ ] Replace hardcoded brand in Header/Footer/LeadForm/policies/homepage/email templates/JSON-LD.
- [ ] Per-site services (join table + admin UI + public query filter).
- [ ] Website-aware Contentful client.
- [ ] Admin → Websites CRUD screen with logo/cert uploader.
- [ ] Host-gated admin routing.
- [ ] Per-host sitemap + robots.
- [ ] Docs: "Add a new site in 5 steps" in `DEPLOYMENT.md`.

Approve to switch to build mode and I'll start with Phase 1 + 2 (schema + brand resolver) in one pass, then check in before touching services and Contentful.