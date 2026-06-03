# Plan: SEO order + form header subtitle + 5 header pages content

## 1. Reorder SEO pages to match client's exact footer sequence

Use the 13 category groups from the screenshots as the source of truth (not WP XML). Within each category, keep the child order exactly as shown.

**Master order (category → children):**

1. **Udyamregistration** (parent)
2. **Udyam Regn Certificate** (parent)
3. **Udyamregistration Gov In** (parent)
4. **Aadhar Udyog Registration** (parent)
5. **Udyog Aadhar Certificate Download** (parent)
6. **Official MSME Registration Website** (parent)
7. **Aadhaar Udyam** (parent)
8. **MSME Registration Process** (parent)
9. **Udyam Aadhaar Download PDF** (parent)
10. **Udyog Aadhar Registration** (parent)
11. **Udhayam Aadhar Download** → Udhayam Aadhar Download, Udyam Print, Print Udyam, Udyam Register Print, Udyam Print Download, Udyam Reprint, Udyam Print Certificate, MSME Print Udyam Certificate, Aadhar Udyam Print, MSME Print Certificate
12. **Print MSME Udyam Certificate** → Print MSME Udyam Certificate, Print Udyam Certificate Download, Udyam Print With Annexure, Udyam Adhar Download, Udyog Aadhaar Download, Udyam Aadhaar Verify, Udyam Aadhaar Status, Udyam Registration Number Verify, Udyam PAN Registration, Udyam Aadhaar Login
13. **Udyam Registration Online** → Udyog Aadhar Registration Online, Udyam Apply, Udyam Certificate Apply Online, MSME Registration Login, Udyam Registration Check, Udyam Download Online, Udyam Certificate Status, Udyam Registration Update, Udyam Certificate Reprint, Udyam MSME Certificate Download

**Implementation:** one SQL migration that rewrites `seo_pages.sort_order` for every row, using `slug` to match. Global ascending `sort_order` so Footer, admin list, and sitemap all read the same order. No row content edited, only `sort_order`.

**Slug match safety:** before writing the migration I'll `read_query` `slug, title, sort_order` for all rows, build the mapping from the lists above, and flag any title in the screenshots that has no matching slug in DB so you can confirm before I run it. Nothing else (admin filters, payment, leads/customers) is touched.

## 2. Re-add the subtitle line in form headers

In `LeadForm.tsx`, auto-split the SEO page title on ` - `:
- Left side → bold main heading
- Right side → lighter subtitle below

Works automatically for every page already titled like `Udyam Reg Certificate - Download MSME Registration Certificate`. No DB change. No new column.

## 3. Add WordPress content under the 5 header pages

For these 5 header nav routes, switch the page body from the hand-written `ServicePageLayout` placeholder to render the original WP page content under the form:

| Header link | Source WP slug |
|---|---|
| New Udyam | `udyam-registration-online` |
| Update Udyam | `udyam-update` |
| Download Udyam | `udyam-registration-certificate-download` |
| Migrate Udyog Aadhar | `udyog-aadhaar-to-udyam-migration` |
| Other Problem | `msme-registration-process` |

I'll extract each page's HTML from the WP XML you uploaded earlier, store it as static strings, and render via the same `SeoLandingPage` content block already used for SEO pages. **Body copy is copied verbatim — no rewording.**

## Out of scope (kept on hold)
- Phases C–L (admin CRM rebuild, lead/customer split, etc.)
- Pricing, services list, payment flow, auth, admin UI
- Any other SEO page text edits

## Files touched
- `supabase/migrations/<new>.sql` — sort_order rewrite only
- `src/components/LeadForm.tsx` — title split
- `src/routes/new-udyam.tsx`, `update-udyam.tsx`, `download-udyam.tsx`, `migrate-udyog-aadhar.tsx`, `other-problem.tsx` — swap to SeoLandingPage with WP HTML
