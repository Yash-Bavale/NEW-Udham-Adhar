## 1. Add Sample Certificate to service pages

Modify `src/components/site/ServicePageLayout.tsx` so the right column shows the same Sample Certificate card used on the homepage / SEO landing pages, and the page's info text moves into a second section below.

Pages affected automatically (all use `ServicePageLayout`):
- `/new-udyam-registration` (New Udyam)
- `/update-udyam-certificate` (Update Udyam)
- `/download-udyam-certificate` (Download Udyam)
- `/migrate-udyog-aadhaar-to-udyam` (Migrate Udyog Aadhar)
- `/other-problem` (Other Problem)

## 2. Fix headlines on SEO pages where "Business Help Services" replaced the real term

Rewrite each visible `title` prop so it reads the slug words in plain English. No other text changes.

Examples:
- `/new-udyam-registration` → `New Udyam Registration`
- `/udyam-registration-certificate-download` → `Udyam Registration Certificate Download`
- `/udyam-registration-download` → `Udyam Registration Download`
- `/udyam-registration-portal` → `Udyam Registration Portal`
- …and the same fix on every other route where the `title=` string still contains "Business Help Services" (full list found via grep, ~19 routes including `msme-apply-online`, `ms-me-certificate`, `print-udyam-certificate`, `aadhar-udyam-registration`, `print-msme-certificate`, `msme-udyam-registration`, `register-for-msme`, `msme-online-registration`, `udyam-aadhaar-verify`, `udyam-registration-number`, `udyam-registration-online`, `udyam-registration-update`, `udyam-registration-check`, `udyam-registration-number-verify`, `msme-registration-free`).

`complaint-grievance-policy` already shows the correct visible title — no change needed there.

## 3. Homepage FAQ tweaks

In `src/routes/index.tsx`:
- Remove the paragraph "Browse 100+ detailed answers on Udyam, MSME & Udyog Aadhaar — registration, download, print, updates and more."
- Change the button text from `View All FAQs` to `Read More`.

## 4. Footer cleanup

In `src/components/site/Footer.tsx`:
- Remove the social icons row (WhatsApp / YouTube / Instagram / Facebook) under the brand column.
- Remove the `Complaint & Grievance Policy` entry from `FOOTER_LINKS` (it's already in the top nav via `NAV_LINKS`).

Nothing else in the footer, header, or other pages is touched.
