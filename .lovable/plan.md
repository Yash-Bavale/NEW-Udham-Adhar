## Homepage SEO Fixes

Targeted, minimal-scope changes to `src/routes/index.tsx` (and one Header tweak). No business logic, no styling overhaul beyond what's needed.

### 1. SEO title + meta (route `head()`)
Replace current title/og:title with keyword-led copy:
- **Title:** `Udyam Registration Online — Apply, Update & Download MSME Certificate`
- **Meta description:** `Udyam (MSME) registration consultancy: apply for new Udyam certificate, update details, download Udyam/Udyog Aadhaar certificate. Pan-India assistance.`
- Mirror into `og:title` / `og:description`.

### 2. Visible H1 with primary keyword (above the fold)
Currently the only H1 is `sr-only`; the visually prominent line is Hindi inside `Header.tsx`.
- Promote the homepage H1 to a real visible heading rendered at the very top of `HomePage()`, above the form section:
  - H1 text: **"Udyam Registration Online — Apply, Update & Download MSME Certificate"**
  - Short sub-line: "Consultancy & assistance for Udyam / MSME / Udyog Aadhaar across India."
- Demote the Hindi line in `Header.tsx` from `<h2>` / large `div` heading to a plain `<p>` (keeps visual, removes heading-rank confusion). No other header changes.

### 3. FAQ answers crawlable in HTML
Radix `Accordion` only mounts `AccordionContent` when open, so answers are absent from SSR HTML.
- Keep the interactive Accordion visually unchanged, but ALSO render a hidden, SSR-present `<div className="sr-only">` block right after the Accordion containing every Q&A pair as `<h3>` + `<p>`. This guarantees Google and AI crawlers see the full answers without changing UX.
- (FAQPage JSON-LD already includes answers — keep as is.)

### 4. Original body content + E-E-A-T signals
Add two compact text sections between the form and the FAQ (semantic `<section>` with `<h2>`s, ~150–200 words each, no new components, plain Tailwind):
- **"About Udyam Registration"** — what it is, who needs it, benefits (subsidies, collateral-free loans, tender preference), free of cost on the government portal, our role as a private consultancy.
- **"Why choose our consultancy"** — experience handling MSME filings pan-India, dedicated support, secure document handling, transparent pricing, post-issuance assistance. Include a small trust strip (years assisting, applications processed, languages supported) as plain text — no fabricated certifications.
- Add a clear disclaimer line: "We are a private consultancy and not affiliated with the Government of India or the Ministry of MSME. Udyam registration is available free of cost on the official portal udyamregistration.gov.in."

### 5. Extra schema
Already present: Organization, LocalBusiness, Service, FAQPage. Add:
- `BreadcrumbList` (Home).
- `WebSite` with `potentialAction` SearchAction pointed at `/faqs` (lightweight, helps AI crawlers).

### Out of scope
- No changes to the form, certificate image, India map, footer, or any other route.
- No design system, color, or component-library changes.
- No copy changes to FAQ questions/answers themselves — only making them SSR-visible.

### Files touched
- `src/routes/index.tsx` — title/meta, visible H1, SSR FAQ mirror, two new content sections, extra JSON-LD entries.
- `src/components/site/Header.tsx` — change the Hindi `<h2>`/heading element to `<p>` (both mobile + desktop blocks). Visual styling preserved.
