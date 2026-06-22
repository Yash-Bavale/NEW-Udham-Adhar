## Phase 1 — Lead Management Module

Build the full Lead Management workspace per spec. No new schema migrations — Phase 0 already created `lead_status_v2`, `application_events`, `follow_ups`, refund columns, and triggers. This phase is server functions + UI + one edge function for storage deletion.

## Backend (server functions, all under `src/lib/crm/`)

### 1. `leads-admin.functions.ts` (extend existing)
- `listLeads({ filters, page, pageSize=25 })` — server-paginated. Filters: `status[]`, `service[]`, `source[]`, `assignedTo[]`, `dateFrom`, `dateTo`, `q` (name/mobile/email ILIKE). Returns `{ rows, total, page, pageSize }`. AND-combined. Selects via existing `applications!fk_applications_lead` hint.
- `createLead({ name, mobile, email, state, district, source, service, notes })` — Zod validated; calls `find_or_create_customer` RPC; inserts `leads` row with `customer_id` + `lead_status_v2='new_lead'`; if note present, inserts initial `application_events` row; returns `{ leadId, leadCode, isReturningCustomer }`.
- `getLeadDetail({ leadId })` — full lead + customer + latest application + documents + follow_ups + application_events timeline.
- `updateLeadAssignee({ leadId, assignedTo })`.

### 2. `lead-status.functions.ts` (NEW)
- `transitionLeadStatus({ leadId, toStatus, reason? })` — enforces the allowed-transitions map server-side (single source of truth in `src/lib/crm/lead-transitions.ts`). Updates `leads.lead_status_v2`, inserts `application_events`, and triggers the email side-effects per the Status→Email map (Phase 1 stub: enqueues into `email_queue`; actual template rendering reuses existing `emails-admin.functions.ts`).
- Special branch for `uninterested`: requires `reason`, queues `customer_uninterested_reason_request`, then auto-transitions to `refund_requested` in the same tx.
- Auto-chains: `payment_successful → welcome_mail_sent` (chained after order_confirmation email), `refunded → closed_refunded`.

### 3. `refunds.functions.ts` (NEW)
- `approveRefund({ leadId })` — requires `admin`/`super_admin`/`finance` role (via `has_role`); sets `applications.refund_approved_at/by`; transitions lead → `refund_approved`.
- `markRefundProcessed({ leadId, gatewayRef })` — inserts child `payments` row (negative amount, `parent_payment_id`, status `refunded`), flips original payment to `refunded`, sets `applications.refund_processed_at`, `refund_gateway_ref`, `documents_deleted_reason='refund'`, invokes `delete_order_documents` edge function, logs event, transitions → `refunded` (which auto-chains to `closed_refunded`), queues `refund_processed_confirmation`.
- `rejectRefund({ leadId, reason })` — transitions → `closed`, queues `refund_rejected_notice`.

### 4. `follow-ups.functions.ts` (NEW)
- `createFollowUp({ leadId, dueAt, reason, assignedTo })`, `listFollowUpsForLead({ leadId })`, `completeFollowUp({ id })`.

### 5. `lead-notes.functions.ts` (NEW thin wrapper)
- `addManualNote({ leadId, note })` → inserts `application_events` with `event_type='note_added'`, `staff_name`/`staff_role` from `profiles` + `user_roles`.

All functions use `.middleware([requireSupabaseAuth])` + role check via `has_role` where indicated. `supabaseAdmin` is dynamic-imported inside handlers.

## Edge function

### `supabase/functions/delete-order-documents/index.ts` (NEW)
Service-role function: given `application_id`, lists `documents` rows excluding `is_certificate=true`, removes objects from the `documents` storage bucket, deletes rows, and stamps `applications.documents_deleted_at`. Called from `markRefundProcessed`.

## Shared

### `src/lib/crm/lead-transitions.ts` (NEW)
Single TS map of allowed transitions + status→email mapping + status color tokens. Imported by both UI (to render the dropdown) and `transitionLeadStatus` (to validate). Prevents drift.

## UI

### `src/components/admin/AdminSidebar.tsx` (NEW)
Persistent left sidebar — shadcn `Sidebar` with `collapsible="icon"`. Items: Dashboard, Leads, Orders, Payments, Invoices, Customers, Documents, Employees, Tasks, Support Tickets, Complaints, Reports, Email Templates, Settings, Logout. Active item = `bg-navy text-white`. Footer = user display_name + role badge. Wired into existing `AdminShell` (keep current header/topbar; just inject sidebar). Navy `#1e3a5f`, amber `#f59e0b` registered as CSS tokens in `src/styles.css` (`--admin-navy`, `--admin-amber`) — used via Tailwind arbitrary classes or new utility, no hardcoded hex in components.

### `src/routes/admin.leads.tsx` (REWRITE)
- Filter bar (Status / Service / Source / Assigned / Date range / Search) with URL-synced search params (zod-validated, `fallback().default()`).
- Table with the 10 columns from spec; status badge component reads color from `lead-transitions.ts`.
- Server-side pagination (25/page).
- Row actions: View / Quick Status Change (popover) / Add Note (inline textarea).
- "Add Lead" button → `AddLeadSheet` slide-over (shadcn `Sheet`).

### `src/components/admin/AddLeadSheet.tsx` (NEW)
Form (react-hook-form + zod): name, mobile (10-digit IN), email, state (full IN list — reuse `src/lib/onboarding/india-districts.ts`), district, source, service (loaded from `services` table), notes. Submit → `createLead` → toast (returning-customer variant when flagged) → close → invalidate list query.

### `src/routes/admin.leads.$leadId.tsx` (REWRITE)
Two-column layout:
- **Top bar:** lead code chip · customer name (links `/admin/customers/$id`) · service · created · assignee dropdown (saves on change).
- **Left column (main):**
  - `StatusControlPanel` — large current status badge + "Change Status" dropdown filtered by allowed transitions. Special handling for `uninterested` (mandatory reason modal). Refund decision panel renders when status ∈ {`refund_requested`,`refund_approved`}.
  - `RefundDecisionPanel` — stated reason, eligibility checkbox + policy note, Approve / Mark Processed (with gateway ref input) / Reject buttons, role-gated.
  - `InternalNotesTimeline` (reuse existing component, extend to color-code by `event_type` per spec) + manual note composer at bottom.
- **Right column:**
  - `FollowUpScheduler` — date+time, reason dropdown, assignee, save; lists upcoming follow-ups for this lead.
  - `LinkedOrderPanel` — order #, fulfillment + payment status, total, link to order page.
  - `DocumentsPanel` — list documents; if `applications.documents_deleted_at` set, show banner with date + `documents_deleted_reason` instead of list.

All mutations use TanStack Query + `useServerFn`; invalidate `["admin.lead", leadId]` and `["admin.leads"]` after writes.

## Email side-effects (Phase 1 wiring)
`transitionLeadStatus` and refund actions enqueue rows in the existing `email_queue` table with the template name from the Status→Email map. Full template rendering/sending remains driven by the existing queue processor — no new SMTP work in this phase. (Adding the template bodies themselves is tracked separately; queue rows will reference templates that already exist or fall back to a generic notice until templates ship.)

## Out of scope for Phase 1
- New schema migrations (Phase 0 covered them).
- Building the other sidebar pages (Orders, Payments, etc.) — sidebar links them, pages remain as-is.
- New email template HTML (queueing only).
- Customer profile page rewrite.

## Order of work
1. `src/lib/crm/lead-transitions.ts` (shared map).
2. Server fns: `leads-admin` extensions → `lead-notes` → `follow-ups` → `lead-status` → `refunds`.
3. Edge function `delete-order-documents`.
4. `AdminSidebar` + CSS tokens + AdminShell wiring.
5. `/admin/leads` list rewrite + `AddLeadSheet`.
6. `/admin/leads/$leadId` detail page (StatusControlPanel, RefundDecisionPanel, FollowUpScheduler, LinkedOrderPanel, DocumentsPanel) + timeline color upgrade.
7. Verify with Playwright: create lead → transition through happy path → uninterested → refund approve/process → confirm `application_events`, `follow_ups`, `payments` (-amount child), and `applications.documents_deleted_at` are written correctly.
