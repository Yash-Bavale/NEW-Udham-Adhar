## Current state (verified)

- SSR is already enabled for every public page. TanStack Start server-renders HTML on each request; I confirmed `https://udyamadhar.in/` returns fully rendered HTML with content (title, meta, body text) — Google crawls it as content, not as a blank shell.
- Only `/admin` and `/unauthorized` opt out of SSR (`ssr: false`) — intentional; admin pages must stay client-only.
- `src/routes/sitemap[.]xml.ts` already auto-generates from the current route tree + enabled `seo_pages` rows on every request.

Nothing about SSR itself needs code changes — the pages already return real content HTML that ranks on Google. What I'll do is a verification + sitemap freshness pass so you're certain.

## Plan

1. **Audit public routes for CSR leaks** — grep every `src/routes/*.tsx` (excluding `admin.*`, `api/`, `email/`, `apply.*`, `app.$token`, `onboarding`, `payment*`, `processing`, `success`) for patterns that would hide content from crawlers:
   - `useEffect`-only data fetch with no loader
   - `<ClientOnly>` wrapping primary content
   - `typeof window` gates around main copy
   - `dangerouslySetInnerHTML` fed by a client-only fetch
   Fix any leak by moving the fetch into the route `loader` (SSR) or unwrapping content out of `ClientOnly`.

2. **Verify SSR output** — curl 4–5 representative pages (`/`, `/about-us`, `/udyam-registration`, `/download-udyam-certificate`, one `/services/...` and one `/apply.$leadCode.summary` if public) and confirm the response body already contains the visible headings/paragraphs before JS runs.

3. **Refresh sitemap** — the sitemap route auto-picks up new routes, but I'll:
   - Re-check `EXCLUDED_PREFIXES` matches current admin/internal routes (add any new ones).
   - Confirm the SEO pages query returns all enabled rows.
   - Hit `/sitemap.xml` after deploy and count URLs vs. actual public routes.

4. **Sanity-check `robots.txt`** — confirm it allows `/` and points to `/sitemap.xml`.

## Files touched

- `src/routes/sitemap[.]xml.ts` — only if excluded prefixes need updating
- Any public route file with a CSR leak found in step 1 (expected: zero or a few)
- `public/robots.txt` — only if the `Sitemap:` line is missing

No framework/vite config changes; no new dependencies.

## Note

"Instant" Google ranking isn't something SSR alone controls — Google still has to crawl, index, and evaluate signals (backlinks, content quality, page experience). SSR guarantees the content is *visible* to the crawler on first fetch, which is already the case here.
