## Tax Invoice — Spec Alignment & Hardening

The core invoice engine (single `pdf.server.ts` renderer, GST split, Maharashtra CGST/SGST vs out-of-state IGST, SAC 998311, SAC summary, amount-in-words, base64 attachment via Lovable Emails direct POST, regenerate, signed-URL admin download, webhook attach on PayU + CCAvenue) is already in place. This plan closes the remaining gaps against the spec — no parallel/legacy renderer is introduced.

### 1. Invoice number format → `BHS-YYYY-000NNN`

New migration: replace `public.set_invoice_number()` so it emits `BHS-{YYYY}-{6-digit seq}` (e.g. `BHS-2026-000145`). Existing invoice numbers are left untouched; only new rows pick up the new prefix. Sequence is reused.

### 2. PDF wording (exact spec text)

Edit `src/lib/invoices/pdf.server.ts`:
- Notes (2 lines, exactly):
  1. "Thank you for the payment. Your order has been successfully received."
  2. "Our experts shall process your application during business hours Monday to Saturday, 10:00 AM to 6:00 PM."
- Terms & Conditions (4 lines, exactly):
  1. Orders once received are Non-Cancellable & Non-Refundable.
  2. Refund Policy available on website.
  3. Jurisdiction: Pune, Maharashtra.
  4. Computer Generated Invoice - Signature Not Required.
- Signature block: keep "For Business Help Services" + "Authorised Signatory".

No layout/colour changes.

### 3. Invoice lifecycle audit trail

New migration creates `public.invoice_events`:

```text
id uuid pk
invoice_id uuid fk -> invoices
event_type text   -- generated | regenerated | replaced | emailed | delivery_update
actor_id uuid?    -- super_admin/finance who triggered (null for webhook/system)
actor_label text  -- 'system' | display name
detail jsonb      -- { recipient, message_id, error, prev_pdf_path, ... }
created_at timestamptz default now()
```

GRANTs + RLS (read: super_admin/admin/finance via `has_role`; write: service_role only). Triggers in `generateAndStore`, `resendInvoiceEmail`, `regenerateInvoice`, and the new `replaceInvoice` write rows.

Additionally add columns to `public.invoices`: `last_emailed_at timestamptz`, `email_attempts int default 0`, `last_email_status text`, `delivery_status text`. These are updated by the email send path and by Lovable bounce/complaint hooks where available.

### 4. Server functions (extend `src/lib/crm/invoices.functions.ts`)

- `previewInvoice({ invoiceId })` — regenerates the PDF in-memory (no storage write) and returns a short-lived signed URL of a `preview/{id}.pdf` object (10 min TTL). Used by Super Admin "Preview".
- `replaceInvoice({ invoiceId, fileBase64, filename })` — finance/super_admin only; archives current `pdf_path` to `archive/{invoice_number}-{ts}.pdf`, uploads supplied PDF, writes `invoice_events` row of type `replaced` with `prev_pdf_path`.
- `listInvoiceEvents({ invoiceId })` — returns ordered event log for the Admin panel.
- `getInvoiceDetail({ invoiceId })` — bundles invoice row, lifecycle events, and last 20 `email_logs` filtered by the linked queue rows (delivery + regen history in one fetch).

All gated through existing `assertRole` helper. `resendInvoiceEmail` and `regenerateInvoice` start writing to `invoice_events` and bumping the new `invoices.last_email_status`/`last_emailed_at`/`email_attempts` columns.

### 5. Admin UI: Order → Payments & Invoices panel

Rebuild `src/components/admin/OrderPaymentsPanel.tsx` so each paid row exposes:

- Invoice no, Invoice date, GST type badge, PDF status (`ready`/`pending`/`failed`), Email status (last attempt + delivery), Attachment name (`Invoice-{InvoiceNumber}.pdf`).
- Action menu (icons): Preview · Download · Print · Email again · Regenerate · Replace (upload).
- "History" drawer (new `InvoiceHistoryDrawer.tsx`) that calls `getInvoiceDetail` and shows two timelines: Lifecycle events (generate/regen/replace/emailed) and Email delivery log (recipient, status, error, message id, timestamp).

Print uses `window.open(signedUrl)` + `iframe.contentWindow.print()` so it stays a true PDF, never a screenshot.

### 6. Acceptance sweep — remove storage URLs from customer emails

Audit and patch:
- `src/lib/email-templates/*` and DB-stored `email_templates` rows for any `{{invoice_url}}` / public Supabase URL in `payment_success` and `order_confirmation`. Replace with attachment-only wording: "Your tax invoice is attached as `Invoice-{{invoice_number}}.pdf`."
- `enqueueFromTemplateInternal` callers in webhooks pass `invoice_number` into `templateData` so the body can reference the file name without a link.

Customer-facing `getCustomerInvoiceUrl` server fn stays — it only powers the success/onboarding page (not email), which is permitted by the spec (in-app, not email).

### 7. QA after build

- Generate a fresh invoice in dev, render with `pdftoppm`, visually verify Notes/T&C wording, GST split for both Maharashtra and an outside-state lead, amount in words, SAC summary.
- Trigger a PayU webhook with a stub paid payment and confirm: invoice row created with `BHS-…` number, PDF in storage, `invoice_events` has `generated` + `emailed` rows, `payment_success` email body contains no `supabase.co/storage` URL, queue payload includes `attachments` with `Invoice-BHS-….pdf`.
- Replace flow: upload a custom PDF, verify archive path saved and `replaced` event logged.

### Files touched

New
- `supabase/migrations/<ts>_invoice_number_bhs_prefix.sql`
- `supabase/migrations/<ts>_invoice_events_and_status.sql`
- `src/components/admin/InvoiceHistoryDrawer.tsx`

Modified
- `src/lib/invoices/pdf.server.ts` (Notes + T&C text only)
- `src/lib/crm/invoices.functions.ts` (preview/replace/list events/detail + lifecycle writes)
- `src/components/admin/OrderPaymentsPanel.tsx` (richer rows + actions)
- `src/routes/api/public/webhooks/payu.ts`, `…/ccavenue.ts` (pass `invoice_number` into template data, write `emailed` events)
- DB email templates for `payment_success` / `order_confirmation` if they currently embed a URL.
