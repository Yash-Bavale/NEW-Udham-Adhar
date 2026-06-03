# Sync SEO page content from Udyam_website_information.docx

## Scope

Treat the uploaded doc as the source of new copy. For each entry in the doc, fuzzy-match the entry name to a slug under `src/content/wp/*.html`. For matched pages, append the doc's **Title** and **Meta Description** as extra lines — only if they are not already present. Existing copy is never overwritten.

No `.tsx` route files, no `head()` metadata, no React components change. Only the WordPress-style HTML snippets under `src/content/wp/` are edited.

## How a page renders today

`SeoLandingPage.tsx` strips inline styles/scripts/svg, the Sample Certificate block, and a few other duplicates, then renders the remaining HTML through Tailwind prose. The 3 visible spots that this task touches:

1. **Form header** — first `<h2>...</h2>` at the top (e.g. `<h2>Udyog Aadhaar to Udyam Migration</h2>`).
2. **Linked heading** — `<h2><a href="/">...</a></h2>` (or `<h1>` inside `<a href="/">`); long descriptive title.
3. **Content box** — the body `<p>...</p>` paragraph(s).

## Append rules (per matched page)

For each of the 3 spots, do a case-insensitive, whitespace-collapsed `includes()` check against the full visible text of that spot:

- **Form header**: if the spot's text does NOT already contain the doc **Title**, insert a new `<h2>{Title}</h2>` immediately after the existing first `<h2>` (or at the top if no header found).
- **Linked heading**: if the existing `<a href="/"><h1|h2>...</h1|h2></a>` does NOT contain the doc **Title**, insert a new `<h2><a href="/">{Title}</a></h2>` immediately after it. If the page has no linked heading at all, append one before the first body `<p>`.
- **Content box**: if no existing `<p>` already contains the doc **Meta Description** (compared on the first ~80 chars to handle long paragraphs), append a new `<p>{MetaDescription}</p>` at the end of the file.

If all 3 spots already include the doc text, the file is left untouched.

## Matching doc → slug

1. Parse `Udyam_website_information.docx` into entries `{ name, title, metaDescription }` (numbered list — entries 1..~125).
2. Normalize each `name` to a slug candidate: lowercase, strip punctuation, collapse whitespace to `-`.
3. Look up `src/content/wp/{slug}.html`. If miss, try common variants: drop trailing `s`, swap `aadhar`↔`aadhaar`, swap `udyam-`↔`udhayam-`/`udham-`/`udhar-`, etc.
4. Skip entries with no confident match. Print a summary at the end listing matched / unmatched.

Pages with no doc match are left fully untouched.

## Implementation

A single Node script run from `/tmp`:

```text
/tmp/sync-seo-from-doc.mjs
  ├── parseDoc()      // read /mnt/user-uploads/Udyam_website_information.docx via mammoth
  ├── slugify(name)
  ├── findHtmlFile(slug)
  ├── patchHtml(html, title, metaDesc)  // 3 append rules, idempotent
  └── main: walk entries → patch matched files → log report
```

The script is run once, prints a report (`matched: N, modified: M, untouched: K, unmatched: U` plus the unmatched list), then is discarded. Nothing in the repo references it.

## Out of scope

- Route `.tsx` files, `head()` titles/descriptions, canonical/og tags.
- Creating new pages for unmatched doc entries.
- Editing the React `SeoLandingPage.tsx` layout, the Sample Certificate card, or the `LeadForm` component.
- Any backend, RLS, or admin changes.

## Verification

After the script runs, spot-check 3 representative files (`udyog-aadhaar-to-udyam-migration.html`, `udyam-certificate.html`, `msme-certificate-download.html`) to confirm:
- Pre-existing copy is intact.
- Added lines appear in the right spot.
- Re-running the script is a no-op (idempotency).
