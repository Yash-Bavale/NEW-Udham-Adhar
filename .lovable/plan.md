# Switch the CMS from Contentful to Sanity

Goal: both sites (udyamadhar.in and udyamregistrations.in) read their content from Sanity instead of Contentful, with zero change to page structure, SEO output, URLs, forms, or the admin panel. Contentful rate limits stop breaking pages.

## What stays exactly the same

- All route files, page components, SEO markup, canonical URLs, sitemap output.
- The content shapes the app consumes today: `faq`, `servicePage`, `seoArticle`, `landingPage`, `emailTemplate`, with the same field names (`slug`, `metaTitle`, `metaDescription`, `bodySections`, `quickFacts`, `eeat`, `faqs`, `internalLinks`, `howto`, `ctas`, …).
- The per-website content isolation: two Sanity projects, one per site, chosen by request host — mirroring today's two Contentful spaces.

## Approach

Content is read today through one module (`src/lib/contentful/client.functions.ts`) plus a sitemap helper. Everything else consumes typed results. So the switch is a swap of that data layer, not a rewrite.

1. **Connect Sanity** through the Sanity connector so I can read project IDs, datasets and schemas directly (no manual project IDs).
2. **Create the schema in both Sanity projects** to match the current models 1:1, using the same field names, so exported content lands unchanged.
3. **Import your exports.** Convert the Contentful exports to Sanity NDJSON (documents keyed by `_type` + slug), then import into each project's `production` dataset. I'll report per-type counts: FAQs, service pages, SEO articles, landing page, email templates — and confirm the totals match your CSVs (13 service pages, 115 FAQs, ~130 SEO articles, 1 landing page, 16 email templates).
4. **New data layer** `src/lib/sanity/client.functions.ts` exporting the same function names and return types as today (`getSanityFaqs`, `getSanitySeoArticle`, `getSanityServicePage`, `getSanityLandingPage`, `listSanitySeoPages`, `listSanitySeoSlugs`). Call sites keep working with a one-line import change each.
5. **Repoint the ~10 call sites**: homepage, `$.tsx` catch-all, the service routes, footer, sections component, sitemap builder, admin SEO/sitemap tools.
6. **Website config**: reuse the existing per-website CMS columns (add `sanity_project_id` / `sanity_dataset` alongside the Contentful ones) so the host → project mapping is data-driven and editable in Admin → Websites.
7. **Verify**, then remove the Contentful code path once both sites render from Sanity.

## Rate-limit safety (the actual outage fix)

- Sanity reads go through the CDN endpoint (`useCdn`), which is not rate-limited the way the Contentful delivery API was hitting.
- Keep the existing in-process cache, and make it degrade gracefully: on any CMS error, serve the last good cached value, then the database SEO page, then the bundled HTML — the tiered fallback already used elsewhere. A CMS hiccup will never blank a page again.

## Technical notes

- `@sanity/client` server-side only, inside `createServerFn` handlers; project ID/dataset resolved per request host, read token (if the dataset is private) stored as a secret per site.
- Rich text: current Contentful rich text is converted to HTML/sections by helpers in the existing client module. Those helpers are reused; if the import produces Portable Text instead, I add an equivalent Portable-Text→HTML serializer with the same output shape, so `SeoContentPage` and `RichServicePage` render identically.
- Sitemap: `src/lib/sitemap/sitemap.server.ts` currently calls the Contentful REST gateway directly per website; it gets an equivalent Sanity query, keeping the sitemap manager, overrides and diff tool untouched.
- No database schema change beyond the two new nullable website columns.

## What I need from you

- Your Contentful export files (NDJSON/JSON/ZIP) for both spaces, uploaded here.
- Approval to connect Sanity; if the two projects don't exist yet I'll tell you exactly what to create.
