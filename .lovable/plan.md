## Finding from the XML

I scanned the full WordPress XML (39k+ lines). The **only FAQ block** present is a Marathi-language Elementor accordion template about a completely unrelated scheme (Annasaheb Patil loan / Maharashtra OBC corporation). There are no Udyam / MSME FAQs in the export — the live `udyamadhar.in` SEO pages also don't have FAQ sections (I checked earlier).

So there's nothing to "copy". I'll **author a fresh, curated set of Udyam/MSME FAQs in English** based on standard MoMSME content, written for the SEO pages.

## What I'll build

### 1. FAQ data file — `src/lib/faqs.ts`
A single source of truth with ~14 high-intent, keyword-rich Q&As covering:
- What is Udyam Registration / Udyog Aadhaar?
- Who is eligible (Micro/Small/Medium classification)?
- What documents are required (Aadhaar, PAN, GSTIN)?
- Is Udyam Registration free on the government portal?
- How long does registration take?
- How do I download / print my Udyam certificate?
- How do I update or migrate from Udyog Aadhaar to Udyam?
- What if I forgot my registered mobile / email?
- Validity & renewal
- Benefits of MSME registration (loans, subsidies, tenders)
- Difference between Udyam and Udyog Aadhaar
- Can a trader register?
- What is "Business Help Services" (clarifies we are private consultancy — required disclaimer)
- How is the consultancy fee different from the government fee?

### 2. New component — `src/components/site/FaqSection.tsx`
**SEO-friendly markup:**
- Wrapped in `<section aria-labelledby="faq-heading">`
- `<h2 id="faq-heading">Frequently Asked Questions</h2>`
- Each Q&A rendered as a native `<details>` / `<summary>` so questions are crawlable even with JS disabled, with `<h3>` inside each `<summary>` for the question
- Adds a `<script type="application/ld+json">` block with **FAQPage schema** (Q&A pairs) — boosts Google rich results
- First **4 questions visible by default**; the rest are inside a hidden `<div hidden>` toggled by a "View More Questions" button (turns into "View Less" when expanded)
- Crawlers still see all Q&A in the JSON-LD script + the HTML (we use `hidden` attribute, not removed from DOM)
- Styled with existing design tokens (`bg-card`, `border-border`, `text-foreground`, `font-display`) — matches the Sample Certificate card styling

### 3. Wire-in — `src/components/site/SeoLandingPage.tsx`
Render `<FaqSection />` after the prose content section, before the page ends. Every existing SEO landing route already uses `SeoLandingPage`, so this single change ships the FAQ on **all ~170 SEO pages** at once.

### 4. SEO findings
After implementing, mark any related FAQ/structured-data findings as fixed via `update_findings`.

## Technical notes

- **No new dependencies** — uses native `<details>` + a tiny `useState` for the View More toggle.
- **No route changes** — purely a component addition.
- **Accessibility**: native `<details>` gives keyboard support + screen-reader semantics for free; the View More button uses `aria-expanded`.
- **Performance**: FAQ data is static, imported at module level (zero runtime cost).

## Out of scope (confirm if you want them)

- Per-page FAQ variants (e.g. different FAQs on the "Print Certificate" page vs the "New Registration" page). The current plan ships **one shared FAQ set** on every SEO page. If you want page-specific FAQs, I can add a per-page override later.
- Translating FAQs to Hindi/Marathi alongside English.