
# Tax Invoice Redesign + PDF-Attachment Email

Scope is invoice template + delivery only. Payment flow, invoice numbering, GST calc inputs, and the trigger point inside the PayU/CCAvenue webhooks (`generateInvoiceInternal`) stay untouched.

## 1. New PDF template (`src/lib/invoices/pdf.server.ts` — full rewrite of `renderInvoicePdf`)

Built with `pdf-lib` (already used). A4 portrait, print-ready, selectable text, embedded fonts (Helvetica + Helvetica-Bold), 36 pt margins. Layout mirrors the uploaded FMCPL-26-001807 reference.

Sections, top to bottom:

1. **Header band** — left: BHS logo (embedded PNG, ~70 pt). Right: large "TAX INVOICE" wordmark + invoice number, invoice date, place of supply.
2. **Seller block** (left column) — Business Help Services / Koregaon Bk, Taluka-Khed, Pune, Maharashtra – 410505, India / GSTIN: 27COFPD1743E2ZB / Email + Phone.
3. **Bill To block** (right column) — customer name, email, mobile, state, "Place of Supply: <state code> – <state name>".
4. **Order strip** — Order No, Invoice No, Invoice Date, Payment Date, Payment Status, Transaction ID, Payment Gateway (two-row grid).
5. **Line-item table** — columns: # | Description | SAC | Qty | Rate | Taxable Value.
   - Description = `<Service Name>\nConsultation Service Fee`
   - SAC = `998311`
   - Qty = 1, Rate = base amount, Taxable Value = base amount.
6. **Totals block** (right) — Taxable Value, then CGST 9% + SGST 9% **or** IGST 18% (chosen from `invoices.gst_type` already computed), Round Off, **Grand Total**, Amount in Words (Indian system, existing helper).
7. **HSN/SAC summary** — single row table: SAC 998311 | Taxable Value | Rate (18%) | CGST | SGST | IGST | Total Tax.
8. **Footer** — Notes paragraph, numbered T&C (1–4 verbatim from brief), support contact line, "This is a computer generated invoice — no signature required." centered, faint BHS branding bar.

Logo asset: copy uploaded `Business_Help_Services_logo-removebg-preview.png` to `src/assets/bhs-logo.png` (committed binary, ~30 KB acceptable; pdf-lib needs raw bytes at SSR runtime so `import` of a `?url` won't work in Worker — read via `import logoBytes from '...?arraybuffer'` Vite primitive used elsewhere, or inline as base64 constant generated once).

Company constants updated:
```
COMPANY_NAME   = "Business Help Services"
COMPANY_GSTIN  = "27COFPD1743E2ZB"
COMPANY_EMAIL  = "help@businesshelpservices.com"
COMPANY_PHONE  = "+91-9767870331"
COMPANY_ADDR   = ["Koregaon Bk, Taluka-Khed", "Pune, Maharashtra – 410505", "India"]
```

`InvoiceData` interface extended with: `customerMobile`, `placeOfSupply`, `paymentDate`, `paymentStatus`, `transactionId`, `paymentGateway`, `serviceName`. `generateInvoiceInternal` (in `invoices.functions.ts`) is updated to populate these from the `payments` + `leads` + `services` rows it already fetches — no new DB columns.

## 2. Email delivery with PDF attachment

`sendLovableEmail` (the published SDK type) does not declare `attachments`, but the upstream Lovable email API accepts them as base-64 entries. We send via direct `fetch` to the same endpoint with attachments included, scoped only to invoice emails — all other emails keep using the SDK unchanged.

New helper in `src/lib/emails/emails.server.ts`:
```
sendInvoiceEmailInternal({ leadId, paymentId, invoiceId })
```
Steps inside:
1. Load lead, payment, invoice, signed bytes from `invoices` bucket (private; we fetch object directly, not a signed URL).
2. Render welcome HTML (new React Email template `payment-success.tsx`, branded, includes order details + "Invoice attached as PDF" + next steps).
3. POST to Lovable Email API (`https://api.lovable.dev/email/send` — same endpoint the SDK uses) with body containing the existing fields **plus** `attachments: [{ filename: 'Invoice-<orderCode>.pdf', content_base64, content_type: 'application/pdf' }]`.
4. If the API rejects attachments (4xx with "attachments not supported"), fall back to enqueueing the email through the existing queue with a signed download link, and log a clear warning so the user sees it once.
5. Insert a row into `email_logs` so it shows up in admin email history.

Trigger: `generateInvoiceInternal` already returns the invoice id; we extend it to fire-and-await `sendInvoiceEmailInternal` after a successful PDF upload. Idempotency key = `invoice-email-<invoiceId>` (Lovable API dedupes).

New React Email template `src/lib/email-templates/payment-success.tsx` (registered in `registry.ts`):
- Subject: `Payment received – Invoice <invoiceNumber> for order <orderCode>`
- Body: greeting, order summary table (service, amount, payment date, txn id), "Your GST tax invoice is attached as a PDF.", next-steps bullets that mirror current onboarding flow, support contact, brand footer.

## 3. CRM / Admin actions

`src/lib/crm/invoices.functions.ts` gains:
- `emailInvoice({ invoiceId })` — re-runs `sendInvoiceEmailInternal` for that invoice. Permission: `super_admin`, `admin`, `finance`.
- `replaceInvoicePdf({ invoiceId, fileBase64 })` — uploads a manually-provided PDF in place of the generated one (super_admin only). Stores in `invoices` bucket, updates `pdf_path`, logs to `audit_log`.

UI wiring (only the order/invoice command bars, no other business logic):
- `src/routes/admin.orders.$orderId.tsx` invoice card → add buttons: **View Invoice**, **Download PDF**, **Email Invoice Again**, **Regenerate PDF**, **Print**, plus **Replace PDF** (super_admin only). Each button calls the corresponding server fn.
- `src/routes/admin.invoices.tsx` row actions → add **Email Again** alongside the existing **Regenerate**.

Email delivery status: read latest matching row from `email_logs` (template_code = `payment-success`, lead_id match) and surface `sent / failed / queued` as a small badge next to the invoice row.

## 4. Validation pass (post-build, no business-logic change)

- Run an admin "Regenerate" on a known paid order → verify PDF matches reference layout, GST split correct (intra-state vs inter-state), amount in words renders, logo crisp.
- Fire "Email Invoice Again" → confirm `email_logs` row with `sent` status and that the recipient inbox shows `Invoice-<orderCode>.pdf` as a real attachment (not a link).
- Confirm CCAvenue + PayU webhooks still complete in the same time budget (attachment send is awaited but capped at ~3 s; failure does not roll back invoice generation).

## Files touched

- `src/lib/invoices/pdf.server.ts` — rewrite renderer (constants, layout, HSN summary).
- `src/lib/crm/invoices.functions.ts` — extend `InvoiceData` build; add `emailInvoice`, `replaceInvoicePdf`.
- `src/lib/emails/emails.server.ts` — add `sendInvoiceEmailInternal` (direct API POST with attachment + queue fallback).
- `src/lib/email-templates/payment-success.tsx` (new) + `registry.ts` entry.
- `src/assets/bhs-logo.png` (new committed binary, from upload).
- `src/routes/admin.orders.$orderId.tsx` — invoice action buttons.
- `src/routes/admin.invoices.tsx` — "Email Again" action + delivery-status badge.

## Out of scope (explicit)

- Payment capture, webhook signature verification, invoice numbering sequence, GST type detection, customer/lead schema — untouched.
- No new tables, no migrations.
- No change to non-invoice email templates or the queue processor.
