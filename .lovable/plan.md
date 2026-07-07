
## Problem

1. **E001 Order Confirmation** template (`order_confirmation`) has `{{payment_reference}}`, `{{payment_date}}`, `{{service_fee}}` placeholders, but the three call sites enqueue different variable names (`transaction_id`, `payment_datetime`, `base_amount`) — so those three rows render empty in the sent email.

2. **Hold emails** (`bhs_e003_customer_delay`, `bhs_e004_our_side_delay`):
   - "Current Order Status" row is a hardcoded string (`On Hold – External Processing Delay` / `On Hold – Awaiting Customer Response`) instead of the actual selected reason label.
   - `{{followup_date}}` (Hold Date & Time), `{{employee_remarks}}` (Additional Remarks), and `{{expected_update_date}}` (Expected Update By) placeholders exist in the DB template but nothing populates them, so the rows render empty. Same for `{{customer_email}}`, `{{customer_mobile}}`, `{{invoice_number}}`, `{{order_created_at}}`.

## Fix

### 1. E001 — pass the missing variables

Add `payment_reference`, `payment_date`, `service_fee` (aliases of the existing values, formatted for display) to the template data in all three enqueue sites, without removing the existing keys:

- `src/routes/api/public/webhooks/ccavenue.ts` (~line 189)
- `src/routes/api/public/webhooks/payu.ts` (~line 296)
- `src/lib/crm/invoices.functions.ts` `resendOrderConfirmation` (~line 338)

```ts
payment_reference: trackingId || orderId || payment.id,
payment_date: <same IST datetime already computed>,
service_fee: Number(invoiceRow?.base_amount ?? leadRow.base_amount ?? 0).toFixed(2),
```

### 2. Hold emails — dynamic status + populate all rows

**DB migration** — replace the hardcoded status cell in both templates with a placeholder:

- `bhs_e004_our_side_delay`: `On Hold – External Processing Delay` → `{{hold_status_label}}`
- `bhs_e003_customer_delay`: `On Hold – Awaiting Customer Response` → `{{hold_status_label}}`

Use a single targeted `UPDATE ... SET body_html = replace(...)` per template — no schema changes.

**Code — `src/lib/crm/workflow.functions.ts`** (`setDelayReason`, both `side === "customer"` and `else` branches around lines 261 and 338): expand the template-data object to fully populate the "Order Summary" and "Reason for Temporary Hold" sections. Also fetch `mobile`, `created_at`, and the latest invoice number for the lead so those rows render.

Additions to templateData:
```ts
hold_status_label: reasonRow?.label ?? data.reasonLabel,   // dynamic status
followup_date:  new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", ... }),
employee_remarks:   data.internalNote ?? data.customerNote ?? "—",
expected_update_date: new Date(data.expectedReviewAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", ... }),
customer_email:  lead.email,
customer_mobile: leadFull.mobile ?? "",
order_created_at: leadFull.created_at ? formatIST(leadFull.created_at) : "",
invoice_number:  latestInvoice?.invoice_number ?? "—",
```

Extend the `.select()` on `leads` (line 156) to also pull `mobile, created_at`, and add one small lookup against `invoices` (by `lead_id`, latest by `issued_at`).

### 3. Out of scope
- No design/layout changes to the templates.
- No changes to the customer-hold action in `order-actions.functions.ts` (that path uses camelCase legacy vars for a different workflow and wasn't cited by the user).
- No changes to any other template.

## Files touched
- `supabase/migrations/<new>.sql` — 2× targeted `UPDATE email_templates`.
- `src/lib/crm/workflow.functions.ts` — extend leads select + templateData in both branches.
- `src/routes/api/public/webhooks/ccavenue.ts` — add 3 keys.
- `src/routes/api/public/webhooks/payu.ts` — add 3 keys.
- `src/lib/crm/invoices.functions.ts` — add 3 keys in `resendOrderConfirmation`.
