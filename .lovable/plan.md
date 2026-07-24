# Refund Module — Plan

Goal: end-to-end refund workflow with a payment-gateway-style UI (like the PayU screenshots) — employees raise requests, admins/finance review, approve, process, and track everything with full audit trail.

Existing state (reuse, don't rebuild):

- `refund_requests` table (status enum: pending/approved/rejected/info_needed/escalated).
- Server fns: `createRefundRequest`, `listRefundRequests`, `approveRefund`, `rejectRefund`, `markRefundProcessed`.
- Pages/dialogs: `RefundRequestDialog.tsx`, `admin.refunds.tsx` (basic list + modal).
- Email E011 (refund processed) already wired.

## Scope

### 1. Data model additions (one migration)

Add to `refund_requests`:

- `refund_mode` (`full` | `partial`), `deduction_amount`, `deduction_reason`
- `gateway_ref`, `gateway_name`, `processed_at`, `processed_by`
- `attachments jsonb` (customer proof uploads)
- `info_needed_note`, `escalation_note`
- New table `refund_request_events` (id, request_id, actor_id, actor_role, action, note, meta jsonb, created_at) for audit timeline
- GRANTs + RLS: staff read/insert/update on both; customer can insert into `refund_requests` only for own lead (via server fn).

### 2. Server functions (`src/lib/crm/refunds.functions.ts`)

- `createRefundRequestV2` — employee raise: validates lead ownership, computes max refundable = paid − deductions, records event.
- `updateRefundRequest` — edit amount/notes while pending.
- `requestMoreInfo` — status → info_needed, logs event, emails customer (new template E013).
- `escalateRefund` — status → escalated (visible only to super_admin/finance_lead).
- `approveRefund` (extend) — supports partial + deduction fields, writes event.
- `rejectRefund` (extend) — required reason, writes event + emails customer.
- `markRefundProcessed` (extend) — gateway/ref/mode, writes event, inserts negative payment row, sends E011.
- `getRefundRequest(id)` — full detail with lead, application, payment, events, attachments.
- `listRefundRequests` (extend) — filters: status, date range, gateway, assignee, search (order code / customer / UTR); pagination.
- `refundStats` — KPI counts (pending, approved-unprocessed, processed today, refunded amount MTD).

Role gating via `useRole`:

- Employee: create, edit-while-pending, view own-lead requests.
- Finance/Admin: approve/reject/info/escalate/process, view all.
- Super admin: full + delete.

### 3. Employee UI

- **Trigger**: replace `RefundRequestDialog` with new `RaiseRefundDrawer` on lead & order workspaces (Actions menu → "Request Refund").
- Fields: refund mode (full/partial), amount (auto-cap to paid), reason (dropdown + free text), customer notes, optional attachments.
- Live summary card: paid amount, previous refunds, max refundable, net payable to customer.
- After submit → toast + inline status chip on the lead/order.
- **My Refunds** section on `/admin/my-work`: small card + list of employee's own requests with status.

### 4. Admin UI — `/admin/refunds` rebuild

Two-pane, PayU-inspired layout:

**Top KPI strip** (chips like the screenshots):
Pending · Awaiting Processing · Processed Today · Refunded (MTD) · Avg TAT.

**Left: filter + list**

- Segmented status tabs, gateway filter, date range, search box.
- Rows: order code, customer, amount, mode badge (Full/Partial), gateway, requested-ago, status pill.
- Row click → opens detail drawer (right pane on desktop, full-screen on mobile).

**Right: detail drawer** — modeled on the attached PayU screens:

- Header: amount, status pill, download invoice, copy IDs.
- Tabs: **Activity** | **Details** | **Customer** | **Attachments**.
  - Activity: vertical timeline (requested → info-needed → approved → refund initiated → raised to bank → processed) sourced from `refund_request_events`. Right column shows payment breakup (paid, deduction, refundable).
  - Details: payment method, gateway, bank ref, txn id, UTR, error desc (if any), original payment card, actions taken table (capture / refund rows).
  - Customer: name, email, mobile, address, device info.
  - Attachments: proof uploads with preview.
- Action bar (role-aware):
  - Pending → Approve (opens amount + deduction form) · Reject (reason required) · Request More Info · Escalate.
  - Approved → Mark Processed (gateway + UTR + mode) · Revoke.
  - Processed/Rejected → read-only, download receipt.

### 5. Notifications & emails

- E011 (existing) — refund processed.
- New E013 — "Additional info needed for your refund" (variables: order_code, note).
- New E014 — "Refund request rejected" (reason).
- Realtime: `notifications` insert on status change; toast for finance role on new pending refund.

### 6. Order/Lead workspace integration

- Show a compact **Refund Status Card** on `WorkspaceShell` finance tab when a request exists (status pill + latest event + link to detail).
- Journey Map: highlight refund path when request is active (reuse existing refund_approved / refunded stages).

### 7. Tracking / reports

- `/admin/reports` add "Refunds" section: totals by gateway, by reason_code, by staff (requester & approver), avg TAT.
- CSV export from list view (respects filters).

## Deliverables checklist

1. Migration: schema + grants + RLS + events table.
2. `refunds.functions.ts` — new/extended server fns + Zod validators.
3. `RaiseRefundDrawer.tsx` (employee) — replaces old dialog.
4. `admin.refunds.tsx` — new two-pane layout with drawer + tabs.
5. `RefundStatusCard.tsx` on lead + order workspaces.
6. Email templates E013, E014 registered + wired.
7. Realtime + notification hooks (`useRefundNotifications`).
8. Reports section + CSV export.
9. Role gating verified via `useRole` (employee/finance/admin/super_admin).
10. Manual QA pass: happy path (raise → approve → process → E011), partial refund with deduction, reject flow, info-needed loop, escalation visibility.

## Open questions before build

1. **Deductions/adjustments**: should employees be allowed to propose a deduction, or only finance during approval? (I'll default to *finance-only* unless you say otherwise.)
2. **Attachments**: allow customer proof uploads on the request (e.g. screenshots)? Storage bucket `refund-attachments` :no
3. **Auto-refund via gateway API** (PayU, ccavenue refund API) or keep it manual UTR entry as today? automated
4. **Who can escalate/see escalated queue** — super_admin  also finance

Please confirm answers to Q1–Q4 (or say "your defaults") and I'll implement.