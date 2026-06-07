## Goal
On all 55 article pages, adjust the form header and content-box H1 so they match the previous SEO pages style, and confirm the FAQ section heading is shown.

## Changes (frontend only — `src/components/site/ArticlePageLayout.tsx`)

### 1. Form header (top blue box) — show short keyword only
Currently the `LeadForm` title is passed the full `h1` (e.g. *"Udyam Registration: The Official MSME Registration System in India"*).

Switch it to a short keyword derived from the article:
- Prefer a new `keyword` field on the article (e.g. `"Udyam Registration"`).
- Fallback: take the part of `h1` before the first `:` / `—` / `-`.
- Pass that short string as `<LeadForm title={keyword} />`.

### 2. Content box H1 — keyword on top, full extended line below as link
Replace the single `<h1>{h1}</h1>` with:

```
<p class="eyebrow">Udyam Registration</p>   ← short keyword, small uppercase
<h1>
  <a href="/{slug}">Udyam Registration: The Official MSME Registration System in India</a>
</h1>
```

- Eyebrow: small, uppercase, brand-navy, tracked — same treatment used on existing SEO service pages.
- H1: full extended title, wrapped in an `<a href={slugPath}>` (self-link, same pattern as previous SEO pages).
- Keep the "Updated <date>" line directly under H1.

### 3. FAQ heading — confirm "Frequently Asked Questions"
The layout already renders `<h2>Frequently Asked Questions</h2>` above the FAQ block. Verify it shows on every article that has FAQs and leave the wording exactly as-is. No code change needed unless the heading is missing on some pages (it isn't — it's unconditional inside the `faq && faq.length` block).

## Data note
No DB schema change required. The short keyword is derived client-side from `h1` (split on `:` / `—` / `-`). If you'd later prefer an explicit per-page keyword, we can add a `keyword` column to `seo_pages` and populate it — say the word and I'll do that in a follow-up.

## Files touched
- `src/components/site/ArticlePageLayout.tsx` (only file)

## Out of scope
- Service pages, footer, sitemap, llms.txt — unchanged.
- DB content — unchanged.