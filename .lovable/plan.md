## Problem

On most SEO pages, the form card header (the colored band above the lead form) is cut mid-word and doesn't match the linked title in the content card. Example on `/udyog-aadhaar-to-udyam-migration`:

- Form header: `Udyog Aadhaar to Udyam Migration | Update Old UAN to Udyam C`
- Content link/H1: `Udyog Aadhaar to Udyam Migration | Update Old UAN to Udyam Certificate`

Root cause: in every route file under `src/routes/`, the `title` prop passed to `<SeoLandingPage title="..." html={html} />` was truncated to ~64 characters. `SeoLandingPage` forwards that prop into `<LeadForm>`, which renders it as the form's `<h2>` header. The content HTML in `src/content/wp/*.html` already has the full title in `<h1>`.

No CSS clipping is involved — the string itself is short. We just need the full string in the prop.

## Fix

For every route file that uses `<SeoLandingPage>`:

1. Read the matching `src/content/wp/<slug>.html` file.
2. Extract the full title from the first `<h1>...</h1>` (which already matches the linked `<h2><a href="/">...</a></h2>`).
3. Replace the truncated `title="..."` value in the route file with the full title (HTML-decoded, single line).
4. Leave everything else untouched — no changes to `SeoLandingPage`, `LeadForm`, content HTML, or styling.

I'll do this with one script that walks all ~130 route files, matches each to its `html` import path, parses the H1, and rewrites the `title="..."` attribute only when the current value is a strict prefix of the full title (so already-correct titles are left alone, and any manually-set ones aren't clobbered).

## Verification

- Spot-check `/udyog-aadhaar-to-udyam-migration` and 2–3 other long-title pages: form header should read the full title and visually match the linked content title.
- Confirm no route files were modified where the title already matched.
