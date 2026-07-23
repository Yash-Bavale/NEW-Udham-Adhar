## What was actually done (no pages were deleted or redirected)

I re-audited the code and the live site. The earlier "205 → 87" summary was misleading in two ways: nothing was deleted, and the reduction is not yet visible on production.

### 1. Pages: still live, still rendering
- **127 variant slugs** are listed in `src/lib/seo/canonical-clusters.ts` (mapped to **11 cluster primaries**).
- Every one of those routes still exists under `src/routes/` and returns HTML. No route file was removed, no 301/302 was added, no `410 Gone` was set for these variants. `/home` is the only URL that was retired and set to 410 (that was a separate earlier change).

### 2. Canonicals: rewritten to consolidate SEO signal
- The build rewrites each variant's `<link rel="canonical">` and `<meta property="og:url">` to point at its cluster primary (e.g. `/msme-certificate` → canonical `/udyam-certificate`).
- This is a *soft* consolidation: users, ads, and existing backlinks still land on the variant page; Google is told to index the primary. No redirect, no content change.

### 3. Sitemap: intended reduction, not yet live
- `src/routes/sitemap[.]xml.ts` filters out `VARIANT_SLUGS`. In theory that yields ~87 URLs (≈104 indexable static routes + `seo_pages` rows − 127 variants + primaries).
- **Live check just now**: `https://udyamadhar.in/sitemap.xml` returns **205 `<loc>` entries** with `lastmod=2026-07-11`. It still lists all the variants (`aadhar-udyam-download`, `msme-certificate`, `udyog-aadhar-registration`, …), plus junk that shouldn't be there at all: `/home`, `/index.html`, `/unauthorized`.
- Conclusion: the sitemap change and the `/home` removal are in the codebase but the deployed sitemap is stale. The "87" number was the *expected* output of the current generator, not what Google is actually seeing.

### 4. Extra issues surfaced by the audit
- `/home` is still in the live sitemap even though it's marked 410 in code — stale deploy.
- `/index.html` and `/unauthorized` are in the live sitemap; the generator doesn't exclude them.
- Cache-Control on `/sitemap.xml` is `max-age=3600`, so even after republish Google can see the old file for up to an hour.

## Plan to reconcile

1. **Republish the site** so the new sitemap route is served. This alone drops the variants and `/home` from `/sitemap.xml`.
2. **Tighten the sitemap excluder** in `src/routes/sitemap[.]xml.ts`:
   - Add `/index.html`, `/unauthorized`, `/not-found`, `/404` to the excluded set.
   - Add a sanity assertion so any path listed in `VARIANT_SLUGS` that slips through logs a warning at build time.
3. **Verify on production after republish**:
   - `curl https://udyamadhar.in/sitemap.xml | grep -c '<loc>'` should be ~87.
   - Spot-check 3 variants (`/msme-certificate`, `/udyog-aadhar-registration`, `/download-msme-certificate`) and confirm `<link rel="canonical">` points at the cluster primary.
   - Confirm `/home` returns 410 with `x-robots-tag: noindex`.
4. **In Search Console**: resubmit the sitemap and mark the retired variants under "URL removals" only if we want faster de-indexing. Otherwise the canonical tags will do it over 2–6 weeks.

## Technical notes

- Files involved: `src/lib/seo/canonical-clusters.ts`, `src/routes/sitemap[.]xml.ts`, `src/routes/$.tsx` (410 handler).
- No DB migration.
- No content or route deletions in this plan — same soft-consolidation strategy.
