
# Service Workflow Engine — Implementation Plan

A large, multi-phase build. I'll deliver it in 6 phases so each phase ships working UI + backend + verification before moving on. All UI reuses existing admin design tokens (`AdminShell`, `StatusBadge`, `ConfirmModal`, shadcn primitives) — no redesign.

Support email constant `help@businesshelpservices.in` will replace the current `support@udyamadhar.in` everywhere it is hardcoded (brand.ts + email template defaults). Existing flows (cancellation, doc reminders, invoices, completion gate) stay intact and are extended, not replaced.

---

## Phase 1 — Data Model & Status Foundation

**Migrations:**
- New enum `workflow_status` with all 16 statuses (New, Documents Pending, Processing, Government Portal Pending, Verification Pending, External Dependency, Waiting For Customer, Waiting For Documents, Customer Non Responsive, Processing Resumed, Completed, Pending Closure, Closed, Refund Review, Refund Closed, Cancelled).
- `applications.workflow_status` column (nullable, derived/synced from existing `fulfillment_status` + new states). Existing `fulfillment_status_enum` retained for backward compat; `workflow_status` is the new surface.
- `workflow_events` table — timeline rows: `application_id, event_type, title, description, actor_id, actor_name, is_system, metadata jsonb, customer_visible, created_at`.
- `workflow_reminders` table — `application_id, due_at, kind (followup_3d/5d/7d/closure_24h/custom), assigned_to, status (pending/sent/cancelled), payload jsonb`.
- `workflow_delay_reasons` + `workflow_closure_reasons` lookup tables (admin-editable Reason Library).
- `workflow_automation_rules` table (trigger/condition/action JSON) — backs Phase 5 rule builder.
- `refund_requests` table — `application_id, payment_id, reason, status (pending/approved/rejected/info_needed/escalated), reviewer_id, decided_at, notes, refund_amount`.
- `support_tickets` already exists — extend with `ticket_state` enum (Open/Pending/Waiting Customer/Closed/Escalated) and auto-create one per order via trigger.
- GRANTs + RLS policies via `has_any_staff_role` for all new tables (anon read denied; service_role full).
- Seed default reasons (Delay + Closure) per spec.

**Verify:** migration applied, types regenerated, lookup tables populated.

---

## Phase 2 — Workflow Timeline + External Delay Popup

**Server fns (`src/lib/crm/workflow.functions.ts`):**
- `listWorkflowEvents({applicationId})`
- `appendWorkflowEvent(...)` — manual note
- `setExternalDelay({applicationId, reason, internalNote, customerNote, expectedReviewAt, priority})` — writes event, updates `workflow_status='external_dependency'` or `government_portal_pending`, schedules 24h follow-up reminder, queues customer email from `external_delay_notice` template.
- `resumeOrder({applicationId})` — cancels open reminders, sets status `processing_resumed`, logs event.

**UI:**
- New `WorkflowTimelinePanel.tsx` under `src/components/admin/` — chronological vertical timeline; each row shows date/time (IST), actor (or "System"), action chip, notes, customer-visible flag.
- New `ExternalDelayDialog.tsx` — reason dropdown, internal + customer-visible notes, expected review date picker, priority select.
- Wire into `/admin/orders/$orderId` as new **Workflow Timeline** tab (reuses existing tab pattern).

**Verify:** Open order → click "External Delay" → fill dialog → see new event in timeline, status badge updated, reminder row created.

---

## Phase 3 — Reminder Engine + Follow-up Automation (3/5/7 day)

**Server route (cron):** `src/routes/api/public/hooks/process-workflow-reminders.ts` — runs every 5 min via `pg_cron` + `net.http_post`. For each due reminder: sends template email via existing `enqueueFromTemplateInternal`, logs `workflow_events` row, reschedules next step (3d → 5d → 7d → trigger no-response popup).

**Status flow handled by engine:**
- External delay → 3-day update → 5-day update → 7-day update → if no customer response → switch to `customer_non_responsive` + show 24h Close-Order popup in CRM.
- Customer reply (via existing inbound channel / staff toggle "Customer Replied") → cancels reminders, sets `processing_resumed`.

**UI:**
- `ReminderQueuePanel` inside order tab — shows upcoming reminders, "Cancel" / "Send Now" buttons.
- `CustomerReplyButton` — logs reply event + triggers Resume.

**Verify:** Create a delay with `expectedReviewAt` in past → cron tick → email queued + new timeline event + next reminder scheduled. Click Resume → reminders cancelled.

---

## Phase 4 — Closure & Refund Workflow

**Closure:**
- `CloseOrderDialog.tsx` — appears when reminder loop ends or staff clicks "Close Order"; loads Closure Reason Library from `workflow_closure_reasons`; selecting reason → queues closure email, sets `closed`, generates closure-note PDF (reuse `pdf.server.ts` pattern), uploads to `documents` bucket, attaches to timeline.

**Refund:**
- New top-level link **Refunds** in `AdminShell` sidebar (gated to finance/super_admin/admin).
- `/admin/refunds` list + `/admin/refunds/$id` review panel showing order timeline, payments, communication, reason, admin notes.
- Actions: Approve / Reject / Need Info / Escalate — each emits email + timeline event + audit row + status update (`refund_review` → `refund_closed`).
- Hook into existing `OrderPaymentsPanel`: "Refund Request Received" button creates the request.

**Verify:** Trigger close → PDF saved + email sent + status `closed`. Create refund → approve → status `refund_closed`, email logged.

---

## Phase 5 — Email Template Manager + Automation Rules + Reason Library Admin

- Extend existing `email_templates` table usage with a **Settings → Email Templates** screen at `/admin/settings/email-templates`: list, edit subject/body (React-Email source or HTML), preview with sample variables, restore-default. Variables `{{customer_name}} {{order_id}} {{service_name}} {{ticket_id}} {{reason}} {{date}} {{company_name}} {{support_email}}` documented in side panel. Seed templates: `external_delay_notice`, `processing_update_3d/5d/7d`, `no_response_warning`, `closure_notice`, `refund_received`, `refund_approved`, `refund_rejected`, `refund_info_needed`.
- **Settings → Reason Library** screen — CRUD for delay + closure reasons.
- **Settings → Automation Rules** screen — simple rule rows (trigger status + wait days + action: send template / create reminder / notify executive / repeat). Engine reads from `workflow_automation_rules`; replaces hardcoded 3/5/7 day schedule when a custom rule exists for that status.
- Replace every `support@udyamadhar.in` / hardcoded support email with `help@businesshelpservices.in` (brand.ts + cancellation.functions.ts + any template defaults). Single constant `SUPPORT_EMAIL` in `src/lib/brand.ts`.

**Verify:** Edit template → preview → save → next email uses new copy. Add automation rule → engine respects it.

---

## Phase 6 — Dashboard Widgets, Notifications, Audit, Tickets, Global Search

- **Dashboard widgets** on `/admin` and `/admin/super`: Orders Delayed, Government Pending, Waiting Customer, Pending Closure, Refund Reviews, Today's Follow-ups, Average Delay (hrs), Oldest Pending Order. Each links to filtered orders list.
- **Notification Center**: extend existing `notifications` table — emit on customer reply, reminder due, refund requested, ticket reopened. Bell icon in `AdminShell` already exists; ensure new event types render.
- **Audit Log**: every workflow action writes to existing `audit_logs` (old/new value + actor); add IP + user-agent capture in server-fn middleware.
- **Support Tickets**: auto-create one ticket per order on creation (trigger); `ticket_state` synced with workflow status; visible in order workspace.
- **Global Search**: extend existing `global-search.functions.ts` to include ticket #, reason, status.
- **RBAC enforcement**: server-side checks — only `super_admin`/`admin` can edit templates/automation rules/close orders/reject refunds/delete timeline notes. `finance` can act on refunds. Others read-only on these surfaces.

**Verify:** End-to-end smoke — create order → mark external delay → cron ticks 3 reminders → mark no-response → close → request refund → approve. Confirm dashboard counts, audit rows, notifications, ticket state, and timeline all reflect every step.

---

## Out of scope (will call out in final note)
- Inbound email parsing (customer reply detection is a manual "Customer Replied" button + future webhook hook; engine is ready for it).
- Open-tracking pixels and per-recipient delivery webhooks beyond what Lovable Emails already records in `email_send_log`.
- Visual rule-builder DAG (Phase 5 ships a simple rule table, not a flowchart UI).

---

## Execution
Phase 1 starts immediately on approval. After each phase I run targeted verification (DB rows, screenshot of the new UI, cron tick log) before moving on. Total: ~6 build turns.
