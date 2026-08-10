# Add all SEO pages to the SEO Pages list (udyamadhar.in)

## Current state (verified)

- The project ships **116** imported page files under `src/content/wp/`.
- The `seo_pages` table holds **187** rows, all on **udyamadhar.in**.
- Cross-checking the two lists:
  - **94** of the 116 already exist as SEO pages.
  - **22** are missing entirely.
  - **5** exist but are switched off (`aadhaar-udyam`, `aadhar-udyam`, `aadhar-udyam-certificate`, `aadhar-udyam-print`, `aadhar-udyog`).

## What will be done

1. **Add the 22 missing pages** to SEO Pages for udyamadhar.in, enabled:
   about, about-us, aml-anti-fraud-policy, complaint, complaint-grievance-policy,
   compliance-statement, consent-acknowledgment, contact, contact-us, cookie-policy,
   disclaimer, grievance-redressal-policy, important-notice, notice, payment-notice,
   payment-notice-service-acknowledgment, pricing-transparency, privacy-policy,
   refund-cancellation-policy, service-delivery-policy, terms-conditions
   (plus `home`, which is skipped — it is the homepage `/`, already covered, and is
   also in the retired-slug list).
2. **Re-enable the 5 switched-off pages** so all imported pages are live.
3. Labels are generated from each page's `<h1>`/`<h2>` heading in its HTML file, falling
   back to a title-cased slug. Policy/legal pages get `page_type = 'article'`, the rest
   keep `service`; `sort_order` continues after the current maximum.
4. **Verify** afterwards: every one of the 116 slugs is present and enabled, and the
   sitemap picks them up (they flow through the existing sitemap builder, honouring any
   per-page exclusions set in the Sitemap Manager).

## Technical notes

- Data-only change: `INSERT` of the missing rows and `UPDATE enabled = true` on the five,
  scoped to the udyamadhar.in `website_id`. No schema change, no code change.
- Legal/policy slugs already have their own routes, so adding them here only adds them to
  the SEO Pages list, footer link set, and sitemap — it does not alter their rendering.
- If you actually meant a different set of ~130 pages (e.g. the Contentful CMS entries),
  say so and I will retarget before running anything.
