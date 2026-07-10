## Goal
Bind existing CRM modules (orders, tickets, emails, timers, forms, government portal, dashboard) into ONE centralized **Workflow Engine** so any single action fans out to timeline, automation, timers, ticketing, dashboard, and notifications — without breaking current functionality.

This is a large, multi-week rebuild. To keep it shippable and reviewable, I'll deliver it in **6 sequenced phases**. Each phase leaves the app fully working, with the new engine progressively taking over.

---

## Phase 1 — Workflow Engine Core (foundation)

**DB (single migration):**
- `workflow_states` — per-order: `stage`, `status`, `sub_status`, `paused`, `pause_reason`, `active_ticket_id`, `assigned_to`, `updated_at`. One row per `application_id`.
- `workflow_timers` — `order_id`, `kind` (`incomplete_form`, `closure`, `reminder`, `custom`), `fires_at`, `status` (`running|paused|fired|stopped`), `paused_at`, `payload jsonb`.
- `workflow_events` (already exists — extend) — normalized enterprise timeline entries with `actor_kind` (employee/customer/system/gov), `icon`, `category`, `payload`.
- `workflow_automations` — `order_id`, `code` (`incomplete_form_flow`, `closure_flow`, `gov_reminder_flow`), `status` (`running|paused|completed|stopped`), `context jsonb`.
- Enum extensions on `order_status_enum` if any values missing (`WAITING_CUSTOMER`, `CLOSURE_PENDING`, `GOV_UPLOAD_PENDING`, etc.).
- Grants + RLS for all new tables (staff read/write, service_role all).

**Server (createServerFn + a tiny dispatcher):**
- `src/lib/workflow/engine.server.ts` — pure `applyEvent(orderId, event)` that:
  1. Loads current `workflow_state`
  2. Runs the state machine (`src/lib/workflow/state-machine.ts`)
  3. Writes state, timeline event, timer changes, automation status changes in a single transaction (RPC)
  4. Emits notifications
- `src/lib/workflow/events.ts` — typed event union (`PaymentReceived`, `FormSubmitted`, `FormTimeout5m`, `FormTimeout8h`, `CustomerEmailReceived`, `TicketOpened`, `TicketClosed`, `EmployeeResumed`, `GovUploaded`, `GovApproved`, `GovRejected`, `ReminderTick`, `DelayReasonSet`, …).
- All existing serverFns (payments webhook, form submit, ticket create, gov upload, etc.) call `dispatchEvent(...)` instead of touching status columns directly. Existing behavior preserved; engine layered on top.

**Cron (existing `/api/public/cron/*`):**
- `workflow-tick` route runs every minute → fires due timers → dispatches events.

---

## Phase 2 — Ticket unification (max 1 active per order)

- `find_or_append_ticket(order_id)` RPC — canonical "one active ticket" enforcement.
- Inbound email matcher (`src/lib/mail/inbox-matcher.server.ts`) rewired: match → dispatch `CustomerEmailReceived` → engine finds/creates single ticket → **pauses** all running automations/timers for that order.
- Ticket close → dispatch `TicketClosed` with `outcome: cooperating | not_cooperating` → engine resumes or continues closure.
- UI: hide old "create ticket" button in order view; ticket lives inside the order panel.

---

## Phase 3 — Automations (the 3 flows)

Implemented as pure state-machine reactions inside the engine:

1. **Incomplete Form Flow** — start on `OrderCreated` → 5 min timer → send `incomplete_info` email + resume link → 8 hr closure timer → closure email → close order. Cancelled on `FormSubmitted`. Paused on `CustomerEmailReceived`.
2. **Closure Flow (verification / customer-side delay)** — start on `DelayReasonSet(kind=customer_side)` → delay email → 8 hr closure timer → closure email → close. Same pause/resume semantics.
3. **Government Reminder Flow** — start on `DelayReasonSet(kind=our_side)` → **no closure**, only recurring reminders (default every 2h, employee-configurable: 30m / 1h / 2h / custom / stop). Reminders target the assigned employee, not the customer.

All flows write to `workflow_automations` + `workflow_timers` so the UI can render "Running / Paused / Completed / Stopped" everywhere.

---

## Phase 4 — Dashboard & widgets

New live widgets on admin dashboard, each backed by a small serverFn + realtime subscription to `workflow_states`:
- Orders Waiting Customer, Orders Waiting Employee, Government Pending, Delayed Orders, Tickets Open, Paused Workflows, Closure Today, Reminder Queue, High Priority, Employee SLA, Today's Automation.

Realtime channel: `user:<uid>:workflow` (per existing memory rule).

---

## Phase 5 — Order workspace UI (redesign, functionality unchanged)

Rebuild `admin/orders/$id` layout with:
- **Sticky stage progress bar** (Payment → Form → Verification → Government → Completed) with color-coded states.
- **Workflow status card**: Active Automation, Current Timer (live countdown), Next Scheduled Action, Current Owner.
- **Sticky action panel** — buttons rendered from `getAvailableActions(state)`; no irrelevant buttons ever.
- **Rich timeline** — grouped by day, icons per event kind, actor avatars, expandable payload.
- **Badge row** — Customer Waiting / Employee Action / Gov Pending / Ticket Open / Paused / High Priority.
- **Confirmation dialogs** for Close Order, Force Resume Closure, Reject Application.
- **Inline single-ticket panel** with Reply / Resume Order / Close Ticket / Close Order.

Existing forms, invoice, email, upload components are **reused as-is** — only the shell changes.

---

## Phase 6 — Cleanup & guardrails

- Deprecate direct writes to `applications.order_status` outside the engine (grep + refactor call sites; add a DB trigger that logs any non-engine writes).
- Migrate historical orders: backfill `workflow_states` from current `order_status`.
- Add integration tests for the 3 automation flows (Playwright + engine unit tests).

---

## Technical notes (for reference)

- **State machine** lives in one pure TS file so it's unit-testable and shared between server dispatcher and UI action-availability logic.
- **Timers** stored in DB, not in memory — cron ticks them. Survives redeploys.
- **Idempotency**: every event has a `dedup_key`; engine ignores duplicates (safe for webhook retries + email replay).
- **Backwards compatible**: existing `order_status_enum` values kept; engine derives new richer `stage`/`status` from them + new columns.
- No breaking API changes; all existing routes/serverFns keep working while engine takes over gradually.

---

## What I need from you to start

1. **Green-light Phase 1** (engine + DB + dispatcher rewiring) — this is ~1 migration + ~15 new files, no UI change yet. Everything keeps working.
2. Confirm the **default reminder cadence** for Government delay (I'll use **every 2h** unless you say otherwise).
3. Confirm the **closure window** everywhere is **8 hours** (matches your spec).

Say "go phase 1" and I'll ship it.
