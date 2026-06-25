## Problem

After payment, the customer email is rendered from the `email_templates` row with code `payment_success` (used by `resendInvoiceEmail` / webhook flows via `enqueueFromTemplateInternal`). That row has two defects:

1. The "Download invoice" link is hardcoded to `https://udyamadhar.everythinghappens.in/api/public/invoice/{{lead_code}}` (wrong domain — leaks the staging host).
2. The HTML layout pre-dates the current Zoho-style invoice / brand refresh and no longer matches the PDF + summary page design.

Separately, the PDF that downloads at `udyamadhar.in/api/public/invoice/UA-2026-007530` looks "old" because that invoice file was rendered and stored before the new `pdf.server.ts` Zoho layout shipped. The renderer itself is current; only the stored PDF is stale.

## Changes

### 1. Replace the `payment_success` email template (DB migration)

Add a new migration that `UPDATE`s `public.email_templates WHERE code = 'payment_success'` with:

- Correct download URL: `https://udyamadhar.in/api/public/invoice/{{lead_code}}` (matches the working public route).
- Refreshed Zoho-aligned brand layout matching current pages:
  - BHS navy gradient header + "Payment received" pill, `Ref: {{lead_code}}`.
  - Greeting `Thank you, {{name}}!` + service line.
  - Action-required card with rounded gradient CTA → `{{onboarding_url}}` ("Fill incomplete information").
  - Payment summary card (Service charges / GST 18% / Total) with `{{base_amount}} / {{gst_amount}} / {{total_amount}}`.
  - Invoice card: shows `{{invoice_number}}`, notes the PDF is attached, plus a secondary "Download invoice" link → `https://udyamadhar.in/api/public/invoice/{{lead_code}}`.
  - Dark "What happens next" timeline card.
  - Footer: `help@businesshelpservices.in`, `udyamadhar.in`, address line — matches the rest of the brand emails.
- Subject left as-is unless it also references the old domain (will refresh wording if needed: "Payment received — Invoice {{invoice_number}}").

No code touches `enqueueFromTemplateInternal` — all variables already passed in `resendInvoiceEmail` (`name`, `service`, `lead_code`, `invoice_number`, `base_amount`, `gst_amount`, `total_amount`, `support_email`) plus webhook flows are reused. `{{onboarding_url}}` will be added to the template-data payload at the two webhook call sites and in `resendInvoiceEmail` (derived as `https://udyamadhar.in/onboarding/{{lead_code}}`) so the CTA works.

### 2. Regenerate the stale PDF for UA-2026-007530

One-off: call existing `regenerateInvoice` for the invoice attached to that lead's payment so the stored PDF picks up the current Zoho layout. Done via a short SQL+server-fn invocation; no schema change.

Optional (ask before doing): bulk-regenerate all invoices issued before the redesign cutoff so historical downloads also reflect the new layout.

### 3. Verification

- `supabase--read_query` on `email_templates` to confirm the new body has no `everythinghappens` and uses `udyamadhar.in`.
- Trigger `resendInvoiceEmail` for the test payment and inspect `email_queue.body_html` (and rendered preview) — confirm the new layout, working CTA, correct download link, and PDF attached.
- Open the regenerated PDF via `/api/public/invoice/UA-2026-007530` and confirm it matches the current Zoho design.
- I want all invoice to be genrated as new format no old, automatically delete the old format & replace it with new 

## Out of scope

- No changes to `pdf.server.ts` (already current).
- No changes to the public invoice download route.
- No changes to webhook signature/processing logic.