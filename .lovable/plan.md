## Improve dynamic sitemap.xml

The existing `/sitemap.xml` server route auto-discovers static routes from the route tree but misses two things:

1. **Enabled SEO pages** in the `seo_pages` table aren't included if their slug isn't a hardcoded file route.
2. **`public/robots.txt`** advertises the wrong sitemap host (`everythinghappensqindiaserver4cored.lovable.app` instead of the canonical `udyamadhar.everythinghappens.in`).

Also exclude admin/auth/onboarding/payment/processing/success/email/lovable paths and `/seo-admin` which should not be indexed.

### Changes

**1. `src/routes/sitemap[.]xml.ts`**
- Keep auto-discovery from `routeTree.gen.ts`.
- Add an exclusion list for non-indexable paths: `/admin`, `/admin-login`, `/seo-admin`, anything starting with `/onboarding`, `/payment`, `/payment-pending`, `/payment-failed`, `/processing`, `/success`, `/apply`, `/email`, `/lovable`, `/complaint` (form), and existing `/api`, `/sitemap.xml`, `$`-routes.
- Fetch `slug` from `seo_pages` where `enabled = true` via `supabaseAdmin` and merge into the URL set (dedupe).
- Use `udyamadhar.everythinghappens.in` as `BASE_URL` (already correct).

**2. `public/robots.txt`**
- Update the `Sitemap:` line to `https://udyamadhar.everythinghappens.in/sitemap.xml`.

No DB migrations, no UI changes.
