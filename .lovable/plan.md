## Goal
Rewrite the post-payment email (sent right after PayU/CCAvenue webhook marks the lead paid) with the exact copy you provided, including a banner header image titled "Order Successfully Received", and ensure all merge fields render correctly.

## What I'll change

### 1. Generate the header banner image
- Create `src/assets/email-order-received-banner.png` (1200×280) with brand navy gradient + amber accent + the text **"Order Successfully Received"**.
- Upload via `lovable-assets` so the image is served from a public CDN URL (email clients can't load `/src/...`).
- Reference the CDN URL in the email `<img>` so it renders inline in Gmail/Outlook/Apple Mail.

### 2. Update DB template `order_confirmation` (code = `order_confirmation`)
This is the template the PayU and CCAvenue webhooks actually send after payment success (with the Tax Invoice PDF attached). I will replace:
- **Subject** → `Order Confirmation & Tax Invoice – Order No. {{order_number}}`
- **body_html** → new Zoho-style layout containing your exact copy, in this order:
  1. Banner image header (CDN URL above)
  2. Greeting: `Dear {{customer_name}},` + thank-you paragraph
  3. **ORDER SUMMARY** block (Order No, Service, Payment Status, Transaction No., Date & Time, Service Fee, GST, Total)
  4. **IMPORTANT SERVICE INFORMATION** bullet list (all 10 bullets verbatim)
  5. **NEXT STEP** with CTA button → `{{form_link}}`
  6. Follow-up paragraphs (support contact, failure-to-respond clause, policy list)
  7. **SUPPORT AVAILABILITY** block
  8. **TAX INVOICE** note (attached to this email)
  9. **SUPPORT INFORMATION** + signature + `https://udyamadhar.in`
- **body_text** → plain-text mirror for non-HTML clients
- **variables** → expand to include `transaction_id`, `payment_datetime`, `customer_name`, `order_number`, `service_name`, `base_amount`, `gst_amount`, `total_amount`, `form_link`

### 3. Inject the new merge fields from the webhooks
In both `src/routes/api/public/webhooks/payu.ts` and `src/routes/api/public/webhooks/ccavenue.ts`, extend `commonVars` to include:
- `transaction_id` → gateway txn id (PayU: `mihpayid`/`txnid`; CCAvenue: `tracking_id`/`order_id`) — already on the `payments` row, will fetch with the invoice query.
- `payment_datetime` → IST-formatted `dd MMM yyyy, hh:mm a` from `payments.captured_at` (fallback `invoices.issued_at`).

No change to PDF generation or attachment logic — the invoice PDF stays attached to this same email.

### 4. Verify
- `supabase--read_query` to confirm subject + body updated.
- Trigger a fresh test payment (or re-enqueue via existing webhook replay) and inspect `email_queue` row to confirm all `{{...}}` placeholders resolved and the banner URL is reachable.

## Files touched
- `src/assets/email-order-received-banner.png` + `.asset.json` (new)
- `email_templates` row `order_confirmation` (DB update via `supabase--insert` upsert)
- `src/routes/api/public/webhooks/payu.ts` — add `transaction_id`, `payment_datetime` to `commonVars`
- `src/routes/api/public/webhooks/ccavenue.ts` — same

## Out of scope
- `payment_success` template (legacy, not currently sent by webhooks) — left untouched unless you want it synced too.
- Tax Invoice PDF layout — unchanged.
