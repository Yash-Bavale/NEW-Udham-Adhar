# Unified Order Workspace Redesign — Implementation Plan

A complete CRM restructure around ONE primary object: the **Order Workspace**. Everything an employee needs lives on `/admin/orders/[id]`. Sidebar is reduced to navigation entry-points only.

---

## Phase 1 — Foundations (no UI yet)

### 1A. Unified stage model
Create `src/lib/crm/computeOrderStage.ts`:
- `OrderStage` type: `lead_received | payment_pending | payment_done | form_submitted | under_review | in_progress | submitted_to_govt | under_processing | certificate_ready | completed | uninterested | refund_requested | refunded`
- `computeOrderStage(lead, application)` — single source of truth, derived from real columns (no new status field)
- `STAGE_META`: label, color token, order index, "is current customer-side / employee-side"

### 1B. Schema additions (one migration)
- `applications.form_submitted_at timestamptz`
- `applications.certificate_uploaded_at timestamptz`
- `applications.govt_portals_selected jsonb` (GeM/TReDS/NCS/NSIC interest flags from form)
- Backfill from existing data; triggers to auto-set `form_submitted_at` on first onboarding_submission insert and `certificate_uploaded_at` on certificate document insert
- Index on `(assigned_to, fulfillment_status)` for "My Orders"

### 1C. Service form display config
`src/lib/crm/formDisplayConfig.ts` — declarative section→fields map per service slug (new-udyam-registration, correct-pan-aadhaar, forgot-mobile-email, update-udyam-certificate, talk-to-expert). Renderer drives section C of workspace from this config — no per-service JSX.

---

## Phase 2 — Order Workspace page (the centrepiece)

Rebuild `src/routes/admin.orders.$orderId.tsx` as a 65/35 two-column layout.

### Components to build (under `src/components/admin/workspace/`)
- `JourneyStrip.tsx` — horizontal stepper from `computeOrderStage`, completed/current/future states, dates below
- `StageActionsPanel.tsx` — switch on current stage, renders the contextual "next action" block (payment link, mark reviewed, mark submitted, upload cert, send & complete, refund decision)
- `ServiceFormPanel.tsx` — driven by formDisplayConfig; section headers, label/value pairs, masked Aadhaar/bank with reveal button, "Copy All as Text" button
- `ActivityTimeline.tsx` — chronological feed from `application_events`, colour-coded dots by event_type, inline "Add Note" textarea at bottom
- `CustomerCard.tsx` — name, mobile, tel/WA buttons, total orders + lifetime, link to profile
- `PaymentCard.tsx` — amount, status, GST split, invoice download, payment-link generator when unpaid
- `QuickActionsCard.tsx` — contextual action buttons
- `FollowUpCard.tsx` — inline scheduler + current follow-up
- `TasksCard.tsx` — inline task list + add task

### Server functions (extend `orders-v2.functions.ts` and add new ones)
- `markReviewedStartProcessing(orderId)`
- `markSubmittedToGovt(orderId, portals?)`
- `markUnderProcessing(orderId)`
- `uploadCertificate(orderId, file, certificateNumber)` (already partial)
- `sendCertificateAndComplete(orderId)` — wraps existing completion gate
- `markUninterested(orderId, reason)` — queues uninterested email
- `approveRefund(orderId)` / `rejectRefund(orderId, reason)` / `processRefund(orderId)` — manager+ only
- `logSensitiveReveal(orderId, field)`

Each fires the exact email + `application_events` row per the wiring table.

---

## Phase 3 — All Orders unified list

Rebuild `src/routes/admin.orders.index.tsx`:
- Single list of all orders AND leads-without-orders (UNION view server-side)
- Columns: Order / Customer / Service / **Stage pill (from computeOrderStage)** / Form / Amount / Assigned / Follow-up / Updated
- Horizontal pill filter row: All / New / Form Pending / In Progress / Submitted to Govt / Completed / Needs Attention
- "Needs Attention" filter = uninterested ∨ overdue follow-up ∨ docs missing >2d ∨ payment failed
- Single search input across order code, name, mobile, email, udyam no
- "My Orders" toggle (default ON for executive/support roles)

Delete/redirect `/admin/leads/*` routes → `/admin/orders` with appropriate filter.

---

## Phase 4 — Sidebar simplification

Edit `AdminShell.tsx`:
- Main: All Orders, Customers, My Follow-ups
- Admin: Employees, Reports, Email Templates, Settings
- Move Invoices/Payments under Reports submenu (admin/accounts only)
- Hide Documents, Leads, Complaints from main nav
- Keep routes alive but de-emphasized

---

## Phase 5 — Customer Profile simplification

`src/routes/admin.customers.$customerId.tsx`:
- Header: identity + lifetime stats
- Orders list (each row links to Order Workspace)
- Inline-editable basic info (PAN/Aadhaar/GST/business name)
- Remove order-level action buttons — those belong in workspace

---

## Phase 6 — Admin Dashboard as command centre

Rebuild `src/routes/admin.dashboard.tsx`:
- TODAY metrics strip
- NEEDS ATTENTION list (links to workspace)
- PIPELINE counts by stage
- MY FOLLOW-UPS TODAY + REVENUE side-by-side
- Every row links straight to `/admin/orders/[id]`

---

## Phase 7 — Wiring sweep & verification

Walk the wiring table row by row:
- Verify every action inserts the documented `application_events` row
- Verify every documented email actually queues
- Add missing event types where triggers don't already cover them
- Sensitive-reveal logging
- Document-deletion timeline entry on completion/refund

End-to-end Playwright test: create lead → pay → submit form → review → submit govt → upload cert → complete; verify journey strip advances and timeline records each step.

---

## Out of scope for this plan
- New email template content (the 27 existing templates are reused)
- Mobile-specific layouts (desktop-first; existing responsive shell kept)
- Complaints/support-tickets redesign (kept as-is, demoted in nav)

---

## Technical notes
- `computeOrderStage` is pure and client-safe; reused by list page, workspace, dashboard
- All new workspace components use existing admin theme tokens (`var(--admin-*)`)
- Form display uses existing `maskAadhaar` util; reveal logged via new server fn
- No breaking schema changes — only additive columns + backfill triggers
- Existing `FulfillmentStatusUpdater`, `OrderJourneyStepper`, `FormSubmissionPanel`, `OrderDocumentsPanel`, `OrderPaymentsPanel` are **replaced** by the new workspace components (old files deleted in the same edit batch)

---

## Suggested execution batching (you can say "go" between phases)
1. Phase 1 (foundations + migration)
2. Phase 2 (workspace page — biggest chunk)
3. Phase 3 (unified list) + Phase 4 (sidebar)
4. Phase 5 (customer profile) + Phase 6 (dashboard)
5. Phase 7 (wiring sweep + e2e verification)
