# Test Plan: Payment Success → Invoice → Email Delivery

Goal: prove that a successful payment (a) generates a valid PDF stored in the `invoices` bucket, (b) reaches Lovable Email as a real `application/pdf` MIME attachment (not a link), (c) updates `invoices.last_email_status` / `delivery_status`, and (d) appends correct rows to `invoice_events` and `email_logs`.

## 1. Pre-flight inspection (read-only)

- Confirm webhook entrypoints actually call invoice generation + email:
  - `src/routes/api/public/webhooks/payu.ts`
  - `src/routes/api/public/webhooks/ccavenue.ts`
- Confirm the Lovable Email POST in `src/lib/emails/emails.server.ts` sends `attachments[].content` as base64 with `contentType: "application/pdf"` and `disposition: "attachment"` (not a URL field).
- Confirm `generateAndStore` in `src/lib/crm/invoices.functions.ts` uploads to bucket `invoices`, sets `pdf_path`, `pdf_generated_at`, and triggers `logInvoiceEvent("generated")`.
- DB check via `supabase--read_query`:
  - `invoices` row count, latest `invoice_number` format `BHS-YYYY-000NNN`.
  - `invoice_events` has rows for the most recent invoice with types `generated` and `emailed`.

## 2. Seed a controlled test payment

Use a migration-free path (insert via service role inside a temporary test-only server route is not acceptable in prod). Instead:

- Pick an existing `paid` payment with no invoice yet (or the most recent paid one) via `supabase--read_query`.
- If none exists, ask the user to either (a) run a real sandbox PayU/CCAvenue payment, or (b) approve a one-shot admin "Generate invoice" trigger from `/admin/orders/$orderId` (uses existing `resendInvoiceEmail` path).

## 3. Trigger the flow three ways

a. **Webhook simulation** — POST a signed PayU success payload to `/api/public/webhooks/payu` via `stack_modern--invoke-server-function`. Requires the exact signature scheme; if signature can't be reproduced in test, skip this path and rely on b + c.

b. **Admin "Email again"** — call `resendInvoiceEmail` against the chosen payment (covers PDF render + attachment + email queue path).

c. **Admin "Regenerate"** — call `regenerateInvoice` to verify the archive-and-replace branch logs `regenerated`.

## 4. Verification matrix

For each trigger, verify:

| Check | How |
|---|---|
| PDF exists in storage | `supabase--read_query` on `invoices.pdf_path`; download via signed URL and assert `%PDF-` header + non-zero size |
| PDF renders valid GST layout | Open signed URL in Playwright headless, screenshot page 1, confirm invoice number, SAC 998311, CGST/SGST or IGST split, "Rs." prefix, Notes + T&C verbatim |
| Email sent as MIME attachment | Inspect outbound POST body — search server logs (`stack_modern--server-function-logs` for `resendInvoiceEmail`) for `"attachments"` array containing `content` (base64) + `contentType: application/pdf`, and absence of any download URL in `html`/`text` |
| `invoices` updated | `last_emailed_at` set, `email_attempts` incremented, `last_email_status='queued'`, eventually `delivery_status` flips to `sent`/`delivered` once Lovable Email callback lands |
| `invoice_events` | Rows for `generated` (first run), `emailed` (every send), `regenerated` (regen run) with non-null `actor_label` |
| `email_logs` | Row with `template_code='payment_success'`, `to_email` = lead email, `status` progressing `queued` → `sent` |
| Idempotency | Re-running `regenerateInvoice` archives previous PDF into `invoices.prev_pdf_paths` and sets `replaced_at` |
| UI reflection | Reload `/admin/orders/$orderId`; OrderPaymentsPanel shows green "Ready" PDF chip, latest "Email" status badge, and InvoiceHistoryDrawer lists events in reverse-chrono order |

## 5. Failure-mode probes

- Force email failure: temporarily set lead email to an invalid syntax; confirm `last_email_status='failed'`, `delivery_status='failed'`, `invoice_events` gets `email_failed` with error message — then restore the email.
- Confirm no PII (auth tokens, service-role key) appears in `email_logs.smtp_response` or server logs.

## 6. Reporting

Produce a single PASS/FAIL table covering every row in §4 plus a sample signed URL screenshot of the generated PDF. List any FAILs with the exact log line + suggested fix; do not fix in this pass — testing only.

## Technical notes

- All DB inspection uses `supabase--read_query` (read-only).
- Server function logs via `stack_modern--server-function-logs` filtered by function name (`resendInvoiceEmail`, `regenerateInvoice`, `generateAndStore`).
- Webhook test requires `PAYU_MERCHANT_SALT`; if signature reproduction is brittle, fall back to admin-triggered paths (b, c) which exercise the same `generateAndStore` + email POST code path.
- No schema changes. No code edits. Only read queries, server-function invocations against existing endpoints, and Playwright for PDF visual check.

## Open question before execution

Should I attempt the live PayU webhook simulation (needs a valid signed payload, may write a fake `payments` row), or restrict the test to the admin-triggered Resend/Regenerate paths against an existing paid payment? The admin path covers ~95% of the same code and is safer in a live DB.
