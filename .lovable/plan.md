## Problem

The leads table shows the service "Udyam Registration Certificate Download", which doesn't match the customer-facing service name shown in navigation and on the site ("Download Udyam Certificate"). This makes staff think it's a different/unknown service. 3,476 existing leads carry the long label.

## Canonical label

Use the same wording that already appears in the public nav and matches the slug `download-udyam-certificate`:

- **Slug:** `download-udyam-certificate`
- **Label (everywhere in CRM, forms, emails, dropdowns):** `Download Udyam Certificate`

All other service labels in `src/lib/constants.ts` already match the nav and stay unchanged.

## Changes

1. `src/lib/constants.ts` — change line 6 label from `"Udyam Registration Certificate Download"` to `"Download Udyam Certificate"`.
2. `src/routes/apply.$leadCode.summary.tsx:89` — rename the object key `"Udyam Registration Certificate Download"` → `"Download Udyam Certificate"` so the summary page keeps mapping the right copy.
3. `src/lib/onboarding/schemas.ts:193` — update the schema entry title from `"Udyam Registration Certificate Download — Incomplete Information"` to `"Download Udyam Certificate — Incomplete Information"` so the onboarding form keeps matching by service label.
4. Backfill database (data migration, not schema):
   ```sql
   UPDATE public.leads
      SET service = 'Download Udyam Certificate'
    WHERE service = 'Udyam Registration Certificate Download';
   ```
   (3,476 rows; only the `leads.service` text column stores this label — applications join via `lead_id`, and `services.service_name` is a separate catalogue that already uses short labels.)

## Out of scope (intentionally not touched)

- SEO landing routes / WordPress imports under `src/routes/udyam-registration-certificate-download.tsx`, `src/content/wp/*.html`, and `seo_pages` rows — these are public marketing pages where the long phrase is the targeted keyword. Renaming them would hurt SEO and is not what the user asked for.
- Other service labels (New Udyam Registration, Update Udyam Certificate, Migration, Forgot Mobile/Email, PAN/Aadhaar correction, Talk to Expert) — they already align with the nav and the user only flagged the Download one.

## Verification

- Open `/admin/leads` → the affected rows now display "Download Udyam Certificate" with no truncation.
- Submit a new "Download Udyam Certificate" lead from the public form → onboarding summary + incomplete-info schema still resolve (no "unknown service" fallback).
