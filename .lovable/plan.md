# Plan: Ops fixes + service-change workflow

## 1. Leads table — stop row-click when copying

Copy buttons (mobile, email, lead code) inside the leads table currently bubble up to the row and open lead detail.

- In the leads list row + `CopyButton` primitive, wrap the copy action with `onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}` and `onMouseDown` stop-prop so the row navigation doesn't fire.
- Apply the same fix anywhere a `CopyButton` sits inside a clickable row (orders list, ticket list) for consistency.

## 2. Orders — show selected service + invoice number for manual leads

Root cause: manual leads created via Add Lead don't always persist `selected_service` on the application, and invoice isn't generated at manual-payment finalize time.

- `finalizePaidPayment` (`src/lib/payments/finalize-paid.server.ts`): when creating/updating the application from a manually-created lead, copy `lead.selected_service` → `application.service_type` and `application.service_label`. If missing, fall back to the lead's `service_name` field.
- Ensure invoice generation runs for every paid payment, not just gateway webhooks. Add invoice creation call (`createInvoiceForPayment`) inside `finalizePaidPayment` regardless of source (`webhook | reconcile | manual`). Guard against duplicates with `unique(payment_id)`.
- Orders list column: if `service_label` empty, display `lead.service_name` / `service_selected` as fallback (already exists) — verify the column reads the same shape as manual leads.
- Order detail header: surface `invoice_number` from latest paid payment; show "Invoice #—" if truly missing with a "Generate invoice" button for admins.

## 3. Change-service mid-flow (until form submitted)

New capability on active orders where `fulfillment_status ∈ {S01, S02, S03}` (i.e., not yet form submitted / not in later stages).

**UI**

- New button in `WorkspaceShell` header actions: **"Change Service"** (admin/super_admin/operations only), visible only when stage allows.
- Opens `ChangeServiceDialog`: pick new service, enter new total amount (auto-derive base + GST, see §5), show diff vs already-paid, and choose:
  - **Top-up**: new amount > paid → generate new payment link for the delta.
  - **Refund**: new amount < paid → single "Process refund" button that triggers `refundPayment` for the delta.
  - **Even**: no financial action, just swap service.

**Backend** — new `changeOrderService` server fn in `src/lib/crm/orders-v2.functions.ts`:

1. Validate stage guard (must be pre-form-submitted).
2. Update `applications.service_type/label/pricing_*` and `leads.selected_service`.
3. Insert a new `invoices` row with:
  - Same `application_id` (order ID unchanged).
  - New `invoice_number` (next in sequence).
  - Line items: new service full price + credit line "Adjustment: previous payment received (-₹X)".
  - Net payable = delta.
4. If delta > 0: create payment link via existing `createPaymentLink` helper; return URL.
5. If delta < 0: call `refundPayment` internally for the absolute delta, mark parent link with `service_changed` audit action.
6. Write audit row (`service_changed`, old/new service, delta, invoice ids).

Timeline entry auto-appears via audit hook.

## 4. Govt Portal button uses service dynamic_link

Currently the "Govt Portal" button in `WorkspaceShell` is static/disabled.

- Add `dynamic_link` (already stored on `services`) lookup at load time in `getOrderDetailV2` — join `services` by `service_type` and return `service.dynamic_link`.
- In `WorkspaceShell`, when `data.service?.dynamic_link` is present, render Govt Portal as `<a href={link} target="_blank" rel="noopener">`; else keep it disabled with tooltip "No portal link configured for this service".
- Remove/hide the per-service inline link display in the services admin page (keep the field only as configuration for the button).

## 5. Inclusive GST auto-compute in pricing form

Wherever service pricing is entered (Add/Edit service dialog, Add Lead manual pricing, Change Service dialog):

- Add three fields: **Base**, **GST (18%)**, **Total (inclusive)**.
- Wire computed relationship — editing any one recalculates the others:
  - Total → Base = round(Total / 1.18, 2); GST = Total − Base.
  - Base → GST = Base × 0.18; Total = Base + GST.
  - GST field read-only in most places; editable only for edge cases (admins).
- Extract into a shared helper `computeGstBreakdown(total)` / `fromBase(base)` used by all three forms.

## Technical notes

- No schema changes required for §1, §2, §4, §5.
- §3 adds no new tables; reuses `invoices`, `payments`, `payment_links`, `audit_logs`.
- `refundPayment` already supports partial refunds — reuse it.
- Guard `changeOrderService` behind `assertRole(['super_admin','admin','operations'])`.
- All new UI respects existing role gating (executives don't see the button).

## Files touched (approx)

- `src/components/admin/LeadsTable.tsx` (or wherever rows/copy buttons live), `src/components/admin/primitives/CopyButton.tsx`
- `src/lib/payments/finalize-paid.server.ts`, `src/lib/invoices/*`
- `src/lib/crm/orders-v2.functions.ts` (new `changeOrderService`), `getOrderDetailV2` (join service)
- `src/components/admin/workspace/WorkspaceShell.tsx` (Change Service button, Govt Portal link)
- `src/components/admin/ChangeServiceDialog.tsx` (new)
- `src/components/admin/AddLeadDialog.tsx`, services admin dialog — inclusive-GST inputs
- `src/lib/pricing/gst.ts` (new helper)

Shall I implement all five in one pass?