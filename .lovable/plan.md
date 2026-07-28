## 1. Remove three homepage sections

Delete entirely from `src/routes/index.tsx`:
- "About Udyam Registration"
- "How Business Help Services Works"
- "Why Business Owners Trust Us"

Also remove their data/plumbing so nothing hardcoded or dynamic remains:
- Constants `HOW_IT_WORKS`, `WHY_BULLETS` and the About paragraphs
- `useBlockItems("home.how_it_works")` and `useBlockItems("home.why_us")` hooks
- The matching `home.how_it_works` / `home.why_us` rows in `site_content_blocks` (migration DELETE) and their editors in the Admin → Websites → Content page
- `cms.howItWorks` / `cms.whyUs` usage on the homepage (the Contentful type keeps the fields, they're just unused)

Homepage order becomes: Hero/form + sample certificate → FAQ → Process steps → India coverage.

## 2. New homepage FAQ section

Layout follows the reference image: two columns on desktop — illustration on the left, FAQ list on the right; stacked on mobile, illustration first.

- Illustration: the uploaded question-mark artwork registered as a Lovable asset and imported (no binary in repo).
- Questions render as a collapsible accordion (all collapsed by default), 10 per page.
- Below the list: **Read more** loads the next 10, **Previous** goes back; a small "Showing 11–20 of 118" counter. Pagination is client-side over the full list so every question stays in the server-rendered HTML for crawlers (hidden pages rendered but visually paginated, so Google still sees all 100+ Q&As).
- Removes the "Read all Udyam registration FAQs" button that pointed at /faqs.

## 3. Contentful sync

FAQs come from the existing Contentful `faq` content type (already wired in `getContentfulFaqs`, paginates to 500 entries) rather than the landing-page `faqs` field — that scales to 100+ entries and lets you edit them directly in Contentful. The homepage loader fetches them; if Contentful returns nothing, it falls back to the local FAQ list already in `src/lib/faqs-data.ts` so the page never renders empty.

## 4. Proper FAQ schema

The homepage emits a single `FAQPage` JSON-LD containing **every** FAQ (not just the visible page), with each answer as plain text. Question text is de-duplicated and answers stripped of markup so it validates in Google's Rich Results test.

## 5. Delete the /faqs page

- Delete `src/routes/faqs.tsx`
- Remove the /faqs link in `src/components/site/TrustBlock.tsx`
- Remove /faqs from `src/routes/sitemap[.]xml.ts`
- Add a permanent 301 redirect `/faqs → /#faqs` in the legacy-redirects map so existing backlinks and indexed URLs pass authority to the homepage instead of 404ing
- Fix the `WebSite` JSON-LD `SearchAction` target, which currently points at `/faqs?q=`

## Technical notes
- `src/lib/faqs-data.ts` stays as the fallback dataset; nothing else imports it after this.
- The FAQ block becomes its own component (`src/components/site/HomeFaqSection.tsx`) to keep `index.tsx` readable.
- One migration removes the two obsolete content blocks; no schema changes.
