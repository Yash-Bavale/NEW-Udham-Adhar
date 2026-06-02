# Phase 4C — Turn 3: Finance

Single turn. Builds on existing `payments`, `invoices`, and `audit_logs` tables and on the lead-timeline shipped in Turn 2.

## 1. Invoice PDFs (GST-compliant)

- Server fn `generateInvoicePdf({ paymentId })` in `src/lib/invoices/invoices.functions.ts`, using `src/lib/invoices/pdf.server.ts` (already present) with `pdf-lib`.
- Layout: company header + GSTIN, invoice no (`INV-YYYY-####`, sequential per FY), invoice date, lead/buyer block (name, mobile, email, address, state), service line item, base + CGST 9% + SGST 9% (or IGST 18% for inter-state), total in words, signature block, "Computer-generated" footer.
- Storage: bucket `invoices` (private), path `invoices/{fy}/{invoice_no}.pdf`. Signed URL on download.
- DB: extend `invoices` with `pdf_path`, `pdf_generated_at`, `place_of_supply`, `cgst_amount`, `sgst_amount`, `igst_amount` (migration with explicit GRANTs + RLS preserved).
- Triggers: auto-generate on `payment.status = 'success'` via server fn called from PayU webhook handler; also a "Regenerate" admin button.
- Customer access: download link on `/success/$leadCode` (collapsed receipt card) and emailed via existing template registry — new template `invoice_ready`.
- Admin: download button on lead detail + leads table row menu.

## 2. GST Report

- Route `/admin/finance/gst` (admin/finance role only).
- Filters: month picker (default current FY month), state, gateway.
- Server fn `getGstReport({ month, state?, gateway? })` aggregates from `invoices` joined to `payments` + `leads`: taxable value, CGST, SGST, IGST, total, count — grouped by HSN/SAC (single SAC `998311` for consultancy) and by place-of-supply state for GSTR-1 B2C/B2B split.
- Export buttons: CSV (per-invoice rows) and GSTR-1 JSON stub (B2CS section) for accountant import.
- Summary KPIs at top: total taxable, total tax, total invoiced, invoice count.

## 3. Settlement reconciliation

- New table `gateway_settlements` (id, gateway, settlement_id, settled_at, gross, fees, tax_on_fees, net, currency, raw jsonb, created_at). RLS: admin/finance read; service_role write. Explicit GRANTs.
- New table `payment_settlements` (payment_id, settlement_id, settled_amount, fee, net) — links payments to settlements.
- Server fn `importSettlementCsv({ gateway, csvText })` — admin-only, parses PayU/Razorpay settlement CSVs, upserts settlements + links by `transaction_id`/`payment_id`. Logs to `audit_logs`.
- Route `/admin/finance/settlements`: list settlements (date, gateway, gross, fees, net, # payments), drill-down shows linked payments + unmatched rows.
- "Unreconciled payments" widget: payments older than 7 days with `status=success` but no settlement link → action item.

## 4. Finance views on lead detail

- New "Finance" tab on `/admin/leads/$leadId` (alongside Timeline): payment summary, invoice download/regenerate, settlement status (Settled on DD MMM / Pending), refund button (stub — opens dialog, records `refund_requested` audit log, no actual gateway call this turn).

## 5. Cross-cutting

- All new server fns: `requireSupabaseAuth` + role check (`admin` or new `finance` role; add via migration to the existing `app_role` enum).
- All exports + regenerations write `audit_logs`.
- Reuse shadcn `Card`, `Table`, `Tabs`, `DatePicker`, `Dialog`. `motion/react` only for tab transitions.
- Mobile: GST report + settlements collapse to card list; finance tab single column.

## Files

New:
- `supabase/migrations/<ts>_invoices_gst_finance.sql` (invoice columns, settlement tables, `finance` role, storage bucket policies)
- `src/lib/invoices/invoices.functions.ts`
- `src/lib/finance/gst-report.functions.ts`
- `src/lib/finance/settlements.functions.ts`
- `src/routes/admin.finance.gst.tsx`
- `src/routes/admin.finance.settlements.tsx`
- `src/components/admin/LeadFinanceTab.tsx`
- `src/components/admin/SettlementImportDialog.tsx`
- `src/lib/email-templates/invoice-ready.ts` (registered in `registry.ts`)

Modified:
- `src/lib/invoices/pdf.server.ts` — finalize GST layout
- `src/lib/payments/payu.server.ts` — call `generateInvoicePdf` on success
- `src/routes/success.$leadCode.tsx` — add "Download tax invoice" link in receipt
- `src/routes/admin.leads.$leadId.tsx` — add Finance tab
- `src/components/admin/AdminShell.tsx` — Finance section in nav
- `src/integrations/supabase/types.ts` — auto-regenerated

## Out of scope (4D)

- Real refund/chargeback API calls
- Multi-currency
- Customer-facing invoice history page
- TDS / 26AS reconciliation

## After this turn

Phase 4C is complete. Next discussion: Phase 4D scope (likely: customer portal, refunds, multi-user team roles, reporting dashboards).
