## Execute approved changes

1. **Remove duplicate heading in SEO content** — In `src/components/site/SeoLandingPage.tsx`, strip the first standalone `<h2>` that duplicates the H1 from rendered HTML, keeping only the H1 and the linked `<h2><a href="/">...</a></h2>`.

2. **Reorder `seo_pages.sort_order`** — Migration to set `sort_order` 1–130 to match the exact parent-child list provided earlier. Use existing duplicate `udyog-aadhar-registration-2` for item 21, `udyam-msme` for item 56. Push extra/unused slugs to sort_order > 1000.

3. **Rebuild Footer parent-child tree** — In `src/components/site/Footer.tsx`, replace the auto-grouping with an explicit parent→children map from the approved list.

4. **Add XML content to homepage service pages** using existing duplicate files (no merging):
   - `/update-udyam-certificate` → `udyam-update.html`
   - `/download-udyam-certificate` → `download-udyam-certificate.html`
   - `/migrate-udyog-aadhaar-to-udyam` → `udyog-aadhaar-to-udyam-migration.html`
   - `/other-problem` → `msme-registration-process.html`
   
   Convert each to use `<SeoLandingPage>` while keeping their existing `head()` meta untouched.

5. **Verify**: build passes, no duplicate H1/H2, footer groups match list, all 4 homepage service pages render XML content.
