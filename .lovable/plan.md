## Diagnosis

I read all 5 GSC export ZIPs and traced each issue to its source:

| GSC issue | Rows | Root cause |
|---|---|---|
| Duplicate field "FAQPage" | 170 | `TrustBlock.tsx` emits its own `FAQPage` JSON-LD AND is mounted inside pages that already emit `FAQPage` (`index.tsx`, `SeoLandingPage.tsx`, every article via `ArticlePageLayout.tsx`) → 2 `FAQPage` blocks per page. |
| Alternate page with proper canonical | 80 | Catch-all `/$.tsx` loader lowercases the slug for DB lookup, so `/Print-Udyam-Certificate`, `/Udyam-Card-Download/`, etc. all return **200** with same content as the canonical. Canonical tag is correct but Google still indexes the variant. |
| Page with redirect | 144 | Mostly the same case/trailing-slash variants that get redirected elsewhere (some WP-era 301s). Need to stop linking them and let Google drop them. |
| Not found (404) | 14 | Legacy WordPress paths: `/wp-admin/*`, `/wp-content/*`, `/wp-includes/*`, `/wp-*.php`, `/annasaheb-patil-*`, `/obc-mahamandal-loan-scheme/`, `/download-udyam-certificate-2`. We never offered those — Google is following stale external links. |
| Crawled - currently not indexed | 18 | Mix of: (a) thin/duplicate variants → fixed by canonicalisation, (b) `/wp-json/*`, `/wp-includes/*` noise → block in robots, (c) `/pmfme-scheme/`, `/Udyog-Aadhar-download/` → 410. |

DB check: no uppercase slugs exist in `seo_pages` — the variant URLs are external links Google discovered, not anything we publish.

## Fixes

### 1. Stop emitting duplicate `FAQPage` JSON-LD
`src/components/site/TrustBlock.tsx` — remove the `faqJsonLd` constant and the `<script type="application/ld+json">` block. Keep the accordion UI. Every page that hosts `TrustBlock` already emits its own `FAQPage` schema, so the visible FAQ stays but only one `FAQPage` block per page reaches Google.

### 2. Canonicalise case/trailing-slash variants (301)
`src/routes/$.tsx` loader — before DB lookup, if `_splat` contains an uppercase letter, has a trailing slash, or matches a known legacy/gone path, throw a `redirect({ to: '/...', statusCode: 301 })` to the lowercase canonical. This collapses ~220 duplicate/variant URLs into their canonical counterparts in a single deploy.

### 3. Permanent gone for retired WP schemes
Same `$.tsx` loader — for an explicit deny-list (`annasaheb-patil-*`, `obc-mahamandal-loan-scheme`, `pmfme-scheme`, `download-udyam-certificate-2`), throw a `Response('Gone', { status: 410 })` so Google removes them quickly instead of re-crawling forever.

### 4. Block WP noise via robots
`public/robots.txt` — add:
```
Disallow: /wp-admin/
Disallow: /wp-content/
Disallow: /wp-includes/
Disallow: /wp-json/
Disallow: /wp-login.php
Disallow: /xmlrpc.php
```

### 5. Sitemap hygiene
`src/routes/sitemap[.]xml.ts` — normalise all paths to lowercase + strip trailing slash + dedupe (the static walk already does most of this; add an explicit `toLowerCase()` and a `Set` dedupe to be safe). Bump `lastmod` for re-crawl signal.

### 6. `llms.txt` / `llms-full.txt`
Re-confirm everything is lowercase canonical; add a one-line note that `udyamadhar.in` is the canonical host and all paths are lowercase. No structural change needed.

### 7. Schema files — no enhancement needed
`Organization`, `WebSite`, `Service`, `Article`, `BreadcrumbList`, `FAQPage` are all present and valid. The only schema bug is the duplicate `FAQPage` (fix #1).

### 8. Resubmit to Search Console
After deploy, hit Search Console via the connector:
- Re-ping the sitemap (`PUT /webmasters/v3/sites/.../sitemaps/...`).
- Re-trigger each affected issue's **Validate fix** by re-inspecting one URL per category (`POST /v1/urlInspection/index:inspect` is read-only — actual "Validate fix" must be clicked by the user in GSC; I'll list the exact 5 buttons to click).

Then run an internal SEO scan (`seo_chat--trigger_scan`) to confirm no new regressions.

### Technical notes (for developer reference)
- Loader-thrown `redirect()` in TanStack Start returns the proper 301 on SSR and a client-side redirect on CSR.
- `TrustBlock`'s removal of its JSON-LD is safe because it's now only mounted inside containers that own the page's `FAQPage` graph node.
- 410 responses are returned via `throw new Response()` from the loader, which TanStack Start surfaces as the route's notFoundComponent with a 410 status — Google treats 410 stronger than 404 for de-indexing.

## Out of scope
- Editing individual article copy for "Crawled - not indexed" thin-content pages — most are duplicates that disappear once canonicalised. If any remain after the next crawl cycle, we can selectively rewrite then.
- New custom OG images.
- Touching the published `seo_pages` rows themselves (no schema/slug changes needed).

## What you'll do after I implement
1. Click **Publish → Update** so the redirects + robots changes go live.
2. In Search Console, open each of the 5 affected reports and click **Validate Fix** (I'll tell you exactly where).
3. Wait ~1–2 weeks for the recrawl; ranking lift follows naturally as duplicate signals collapse.
