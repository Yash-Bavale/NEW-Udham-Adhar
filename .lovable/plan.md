## Goal

Apply the clean three-part structure to **every SEO landing page** in the project (every route that uses `SeoLandingPage`), not only the 11 originally listed:

1. **Form header** (left card, blue bar) = short page name (e.g. `Udyam Certificate Reprint`)
2. **Content header** (right side, big H1 in the content card) = same short page name
3. **Descriptive link** inside the content body (e.g. `Udyam Certificate Reprint | Download MSME Certificate Again`) — clicking stays on the same page (not `/`) and shows the same form, not the main form.

Nothing in form header or content body repeats. All "Business Help Services" leftovers inside SEO content are removed.

## Root causes

- `src/components/site/LeadForm.tsx` hard-codes the header text as `Udyog Aadhar Registration` instead of using the `title` prop already passed in.
- `src/components/site/SeoLandingPage.tsx`'s `sanitize()` keeps a leading `<h2>{title}</h2>` and inline `<h1>` tags from the WordPress HTML, producing the duplicate "small one" near the top.
- The descriptive `<h2><a href="/">…</a></h2>` link inside content always points to `/`, so clicking it opens the home page (with the main form) instead of staying on the SEO page.
- A few HTML files (e.g. `aadhar-udyam-registration.html`) never had the descriptive linked heading at all.
- `download-udyam-certificate.html` still uses old "Download Udyam" copy and needs the new paragraph.

## Changes

### 1. `src/components/site/LeadForm.tsx`
- Render `{title}` (the prop already passed in) inside the blue header `<h2>` instead of the hard-coded "Udyog Aadhar Registration". One fix that corrects every page at once.

### 2. `src/components/site/SeoLandingPage.tsx`
- Accept an optional `linkTitle` prop (the descriptive heading used as the in-content link).
- Render `<h1>{title}</h1>` as the first child of the content card (this is the new content header).
- Render the descriptive link directly: `<h2><a href={currentPath}>{linkTitle ?? title}</a></h2>` — `currentPath` comes from the router so it always points to the same page.
- Strengthen `sanitize()`:
  - Strip every `<h1>` from the imported HTML (we render our own).
  - Strip the leading bare `<h2>` whose text equals the page title.
  - Strip every existing `<h2><a href="/">…</a></h2>` from the HTML (we render the link ourselves now with the correct href).
  - Replace the phrase `Business Help Services` (any casing) with `Udyam Adhar` inside the body content. Form consent JSX and the Sample Certificate caption are not affected — they live in JSX, not in the WP HTML.

### 3. Route files — every SEO route, not just the 11

For **every route under `src/routes/` that calls `SeoLandingPage`** (every file in `src/content/wp/` that has a matching route — roughly 140 routes), update the `component:` line to pass:

```tsx
component: () => <SeoLandingPage
  title="<short page name>"
  linkTitle="<descriptive heading>"
  html={html}
/>,
```

Rules used to derive the two strings for every page:

- **`title`** (short, used for form header AND content header): the human-readable page name derived from the slug (e.g. `/udyam-certificate-reprint` → `Udyam Certificate Reprint`, `/udyog-aadhar-registration-2` → `Udyog Aadhar Registration`, `/ms-me-certificate` → `MSME Certificate`). For acronyms (MSME, UAN, PDF, OTP), use uppercase. Remove numeric suffixes like `-2`.
- **`linkTitle`** (descriptive line shown only as the in-content link): the first `<h1>` text found in the corresponding `src/content/wp/<slug>.html` file. If that H1 already equals the short name, fall back to the route's current meta title. Never include "Business Help Services" in either string.

The 13 routes explicitly listed in the request use the exact mappings from the previous plan revision (Udyog Aadhar Registration, Aadhar Udyam Registration, MSME Registration Free, Download Udyam Certificate, Print Udyam Certificate, Print MSME Certificate, Udyam Aadhar Registration, Udyam Adhar, MSME Apply Online, MSME Certificate, Udyam Aadhaar Verify, Udyam Registration Number Verify, Udyam Registration Check, Udyam Certificate Reprint). All other SEO routes follow the same derivation rules.

Also, where any route's head meta currently embeds "Business Help Services" (e.g. `/aadhar-udyam-registration` has `Aadhar Business Help Services - Access MSME Certificate`), replace that phrase in `title`, `description`, `og:title`, `og:description` with the proper descriptive title.

### 4. `src/content/wp/aadhar-udyam-registration.html`
- No HTML edit needed: the descriptive link is now rendered from `linkTitle`, so the previously missing link appears automatically.

### 5. `src/content/wp/download-udyam-certificate.html` + route
- Replace the body paragraph with:
  > Download Udyam Certificate enables businesses to obtain their official MSME registration document instantly from the Udyam portal. By entering your Udyam Registration Number and verifying through OTP, you can download a digitally signed PDF certificate. This certificate acts as proof of your enterprise's MSME status and is required for accessing government loans, subsidies, and tender applications. The download process is free, secure, and available online at any time. Storing and printing your Udyam Certificate ensures compliance, recognition, and uninterrupted eligibility for government programs designed to support small and medium enterprises.
- Remove all leading `<h1>/<h2>` lines from the HTML (rendered by the layout now).
- `src/routes/download-udyam-certificate.tsx` head meta:
  - `title` / `og:title` → `Download Udyam Certificate – Official MSME PDF Download Online`
  - `description` / `og:description` → first ~155 chars of the new paragraph.

## Implementation approach

A small Node script (run once, not committed) reads every file in `src/content/wp/`, derives `title` from the slug and `linkTitle` from the first `<h1>` in the HTML, and rewrites the matching `src/routes/<slug>.tsx` `component:` line and head meta. This avoids hand-editing ~140 route files and guarantees consistent rules.

## Verification

- Visit `/udyam-certificate-reprint`: form header "Udyam Certificate Reprint", content H1 "Udyam Certificate Reprint", body shows the single link "Udyam Certificate Reprint | Download MSME Certificate Again" that stays on `/udyam-certificate-reprint` when clicked.
- Spot-check ~10 other SEO pages (including the 13 listed): no duplicate small heading at top, no "Business Help Services" in SEO body, form header matches content header, descriptive link present and points to same page.
- `/aadhar-udyam-registration` now shows the descriptive link in content.
- `/download-udyam-certificate` shows the new copy and new meta title.

## Out of scope

- Sample Certificate caption ("Sample Business Help Services Certificate shown for reference purposes only.") and the form consent paragraph keep their wording — brand-required JSX outside the SEO content body.
- Non-SEO routes (admin, onboarding, payment, policy pages, etc.) are untouched.
