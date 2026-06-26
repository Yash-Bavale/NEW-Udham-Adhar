## Root cause (verified in DB + code)

The post-payment email isn't showing the transaction ID and isn't carrying the tax-invoice PDF, but for **two different reasons** depending on the gateway:

1. **PayU customers get nothing useful.** PayU's webhook (`src/routes/api/public/webhooks/payu.ts`) enqueues template code `order_confirmation`. That template row in `email_templates` has `is_enabled = false`, so `enqueueFromTemplateInternal` (`src/lib/emails/emails.server.ts:69`) silently returns and the PDF + variables are dropped on the floor. Same for `welcome_and_form_link` (also disabled).

2. **CCAvenue + admin "resend invoice" emails are missing fields.** The CCAvenue webhook already passes the full variable set, but `resendInvoiceEmail` in `src/lib/crm/invoices.functions.ts` (lines 320–345) builds a sparse variable map — no `transaction_id`, `invoice_url`, `invoice_date`, `payment_datetime`, `cgst/sgst/igst_amount`, `amount_in_words`, `customer_email`, `customer_mobile`, `place_of_supply`, `sac_code`. The `payment_success` template references `{{transaction_id}}` (position 2200) and `{{invoice_url}}` (position 8747), so they render as blanks.

DB evidence: every `email_queue` row for `payment_success` in the last 24 h has `has_txn=false, has_url=false`, and most have `has_att=false`. The only one with `has_att=true` (d5bdc41e) came from resend — its variables JSON has only 15 keys and excludes `transaction_id`/`invoice_url`.

## Changes

**1. `src/routes/api/public/webhooks/payu.ts`**
- Change the post-payment enqueue from `order_confirmation` → `payment_success` (the enabled, Zoho-style template the customer is supposed to receive). All the existing variables (`transaction_id`, `invoice_url`, `payment_datetime`, attachment) are already being passed, so nothing else changes — the email will now actually go out with the PDF attached and the transaction ID populated.
- Keep the rest of the handler (status flips, invoice generation, logging) untouched.

**2. `src/lib/crm/invoices.functions.ts` — `resendInvoiceEmail`**
- Load invoice + payment row alongside the lead so we can fill the full template:
  - `invoice_url` = `https://udyamadhar.in/api/public/invoice/{lead_code}`
  - `invoice_download_url` = same
  - `transaction_id` = `payments.transaction_id` (fallback `razorpay_order_id` → `payment.id`)
  - `payment_datetime` = `payments.payment_date` formatted IST, fallback `now()`
  - `invoice_date` = `invoices.issued_at` formatted IST
  - `customer_email`, `customer_mobile`, `amount_in_words` (via existing `amountInWordsINR`)
  - `sac_code`, `place_of_supply`, `cgst_amount`, `sgst_amount`, `igst_amount`, `form_link`
- Keep the attachment path (`__attachments` already set via `opts.attachments`).

**3. (Optional cleanup, no behavior change to customer)** Skip — leave `order_confirmation` and `welcome_and_form_link` template rows alone. Switching PayU to `payment_success` in step 1 removes the silent-skip without needing a DB migration.

## Verification

- Re-query a fresh `email_queue` row after a test payment (PayU + CCAvenue) and confirm `has_txn=true`, `has_url=true`, `has_att=true`, and `position('{{' in body_html) = 0` (no unrendered placeholders left).
- Trigger "Resend invoice" from the admin UI on a paid order and confirm the same three flags are true on the new row.
- No UI / no template HTML changes — purely fixing what variables and template code we hand to the queue.
