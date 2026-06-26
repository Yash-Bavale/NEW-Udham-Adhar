## Goal
Replace the old payment-confirmation email body with a new Zoho-style HTML tax invoice that visually matches the attached PDF, then verify it sends correctly after a payment webhook.

## What's wrong today
- The email actually sent after a successful payment is the DB template `order_confirmation`, whose body is a 3-line plaintext message ("Your payment is confirmed... GST invoice attached"). The PDF attached to it is already the new Zoho-style invoice (from `src/lib/invoices/pdf.server.ts`), but the **email body itself doesn't reflect that design**.
- An older fancier template `payment_success` still exists in the DB but is unused — it's the "old format" the user is seeing in legacy emails / previews.
- Both templates need to be replaced with the same new Zoho-style HTML invoice so the email body and the PDF look identical.

## Changes

### 1. New Zoho-style invoice HTML (DB migration)
Replace `body_html` for both `order_confirmation` and `payment_success` in `email_templates` with a single, email-safe Zoho-style tax invoice layout. The HTML mirrors the PDF:
- Header: BHS logo / company name, address, GSTIN, email/phone/website, and a navy "TAX INVOICE" badge on the right with `{{invoice_number}}` and `{{invoice_date}}`.
- Bill-To block: `{{customer_name}}`, `{{customer_email}}`, `{{customer_mobile}}`, place of supply `{{place_of_supply}}`.
- Line-item table: Description (`{{service_name}}`), HSN/SAC `{{sac_code}}`, Qty 1, Rate `Rs. {{base_amount}}`, Amount `Rs. {{base_amount}}`.
- Tax block: conditional `CGST + SGST` (`{{cgst_amount}} / {{sgst_amount}}`) when intra-state, else `IGST` (`{{igst_amount}}`). Defaults to GST 18%.
- Totals: subtotal, tax, **Total Rs. {{total_amount}}**, amount-in-words `{{amount_in_words}}`.
- Footer: "Download invoice PDF" button → `https://udyamadhar.in/api/public/invoice/{{lead_code}}`, plus "Fill incomplete information" CTA → `{{onboarding_url}}`, and a thin Terms/Support strip (`{{support_email}}`).
- All inline styles, table layout (no flex/grid), 600px wrapper, `#ffffff` body background — safe for Gmail/Outlook.
Update subject for both templates to: `Tax Invoice {{invoice_number}} — Business Help Services`.

Issued via `supabase--migration` (UPDATE only — no schema changes).

### 2. Pass invoice fields into the email render
Update both webhooks to fetch the invoice row right after `loadInvoiceAttachmentByPayment` and merge into `commonVars`:
- Files: `src/routes/api/public/webhooks/payu.ts`, `src/routes/api/public/webhooks/ccavenue.ts`.
- New vars added: `invoice_number`, `invoice_date` (formatted IST), `sac_code`, `place_of_supply`, `cgst_amount`, `sgst_amount`, `igst_amount`, `customer_email`, `customer_mobile`, `amount_in_words`.
- `amount_in_words` computed inline (reuse the same helper logic shape as the PDF; small local function in a shared helper at `src/lib/invoices/amount-in-words.ts`).

### 3. Keep the PDF attachment unchanged
The PDF generator (`src/lib/invoices/pdf.server.ts`) already produces the Zoho-style PDF — no changes.

### 4. Delete dead "old design"
Remove the legacy `payment_success` template only if nothing in code still calls it. `rg "payment_success"` in `src/lib/emails/` will confirm. If unused, drop the row in the same migration; if still referenced, just overwrite its body (Step 1 already does).

## Verification
1. Build passes.
2. Render preview: call the existing admin email preview route for `order_confirmation` with sample vars and visually inspect the HTML in the preview tab.
3. End-to-end: trigger a sandbox PayU webhook (or use the existing admin "Resend invoice email" action on a paid order) against a test lead, then check the inbox — body should match the PDF layout, with the PDF still attached.
4. Confirm the legacy `payment_success` preview no longer shows the old gradient hero design.

## Technical notes
- Email HTML must use inline styles + nested `<table>`s only (no `<style>` blocks, no flexbox). Body background stays `#ffffff` per project email rules.
- Logo: use a hosted PNG URL (e.g. `https://udyamadhar.in/logo.png`) — do NOT inline the base64 logo from `bhs-logo.ts` (would bloat the email and trip spam filters).
- All money values are pre-formatted strings (`toFixed(2)`) in webhooks; the template just prints them with `Rs.` prefix to stay ASCII-safe.
- Variable substitution uses the existing `{{var}}` mustache that `enqueueFromTemplateInternal` already handles — no template-engine changes needed.