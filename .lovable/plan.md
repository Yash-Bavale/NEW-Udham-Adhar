## Locked decisions (from your answers)

1. **Hold states:** Split into `TECHNICAL_HOLD_EXTERNAL` (Cat B — govt/portal) and `TECHNICAL_HOLD_INTERNAL` (Cat C — our team).
2. **Closure emails:** E004 fires on manual employee close; E010 fires on system/timer/ticket-driven close.
3. **Ticket reopen:** Same customer emailing about same order after close → reopen the existing ticket (append to thread, re-pause workflow). One ticket per order lifetime.
4. **Govt rejection (E008):** Always ends in forced manual close. No "resubmit" loop — customer reorders if needed.
5. **Form Pending:** 4h nudge + 8h auto-close (fixed).
6. **Reminder cadences → employee-configurable per order.** Employee picks hours/days (1h, 2h, 4h, 1d, 2d, 4d, custom) when placing/renewing the hold.
7. **Awaiting Govt Approval:** Internal-only reminders (dashboard + assignee notification). No customer email on this cadence.
8. **Consultation stage:** **Kept in the happy path** (optional pre-form step). Talk-to-expert remains available as a standalone ticket-style flow too.

## Phase status
- Phase 1 — Schema: **DONE** (enum + `order_close_reasons` + applications/workflow_timers/support_tickets columns + `allowed_order_transitions` rewrite).
- Phase 2 — Backend: in progress.
- Phase 3 — Frontend: pending.
- Phase 4 — Timer consolidation: pending.

---

## Phase 1 — Schema (single migration, awaits your approval)

**Enum additions** to `order_status_enum`:
`PAYMENT_RECEIVED`, `ORDER_RECEIVED`, `FORM_PENDING`, `FORM_RECEIVED`, `TECHNICAL_HOLD_EXTERNAL`, `TECHNICAL_HOLD_INTERNAL`, `AWAITING_GOVT_APPROVAL`, `CHECKING_STATUS`.

**New table `order_close_reasons`** — 14 reasons from your docx: `id`, `category` (A/B/C), `number` (1–14), `label`, `standard_reply`, `is_active`.

**`applications` new columns:**
- `active_reason_id` (FK → order_close_reasons)
- `active_reason_text`
- `technical_hold_started_at`, `technical_hold_kind` (external/internal)
- `customer_hold_started_at`
- `awaiting_govt_started_at`

**`workflow_timers` new `kind` values:**
`form_pending_nudge_4h`, `form_pending_autoclose_8h`, `customer_hold_reminder`, `technical_hold_reminder`, `awaiting_govt_internal_reminder`.

Timer rows carry a `custom_interval_minutes` column (new) so employee-set cadences persist across ticks.

**`support_tickets`:** add `reopened_count`, `last_closed_at` (for reopen-existing logic).

**`allowed_order_transitions`** function rewritten around the new stages + hold splits + forced-close rules.

GRANTs + RLS follow the existing pattern.

---

## Phase 2 — Backend server functions

New module `src/lib/orders/actions/` — one `createServerFn` per spec button:

- `markPaymentReceived` → sets `PAYMENT_RECEIVED`, sends E001
- `sendFormLink` / `resendFormLink` → sets `FORM_PENDING`, starts 4h+8h timers, sends E003
- `markFormReceived` → sets `FORM_RECEIVED`, cancels form timers
- `startTechnicalHold({ kind: 'external'|'internal', reasonId, reminderMinutes })` → sets `TECHNICAL_HOLD_EXTERNAL|INTERNAL`, arms recurring reminder timer, sends E005 (external only)
- `startCustomerHold({ reasonId, reminderMinutes })` → sets `CUSTOMER_HOLD`, sends E004-customer-delay, arms reminder
- `resumeFromHold` → back to prior stage, cancels reminder
- `submitToGovt` → sets `SUBMITTED_TO_GOVT`, sends E012
- `markAwaitingGovt({ reminderMinutes })` → `AWAITING_GOVT_APPROVAL`, arms **internal-only** reminder (writes `notifications` rows, no email)
- `markCompleted` → `COMPLETED`, sends E002
- `closeOrderManual({ reasonId, remarks })` → sends **E004** (manual)
- System/ticket/timer close paths → send **E010**
- `handleGovtRejected({ reasonId })` → forced close via E010 path, no resume

**Ticket layer** (`src/lib/tickets/`):
- Inbound merge: match `(lower(customer_email), order_number)` → existing open ticket, else reopen last closed ticket for that order (increment `reopened_count`), else create new. Every reopen re-dispatches `TicketOpened` to pause workflow.
- `closeTicketWithReply` / `closeTicketFinal` — fix the `cooperating` branch (currently only dispatches `not_cooperating`); UI passes outcome.
- Delete `resolveTicketAndResumeOrder` bypass; route through engine `TicketClosed` event.

**Reason picker RPC** returns `standard_reply` so the UI auto-fills the reply textarea when a reason is chosen.

**Timer changes:** `workflow-tick` handles all new kinds; recurring reminders re-arm themselves using `custom_interval_minutes`.

---

## Phase 3 — Frontend

- `OrderActionRail.tsx` rewritten stage-aware — button set depends on current `order_status`.
- New `ReasonPicker.tsx` — dropdown of 14 reasons grouped by category, shows `standard_reply` preview, editable before send.
- New `ReminderCadencePicker.tsx` — presets (1h/2h/4h/1d/2d/4d) + "Custom…" input; used by all three hold types.
- `CountdownChip.tsx` — shows next timer fires_at.
- `CustomerJourneyMap.tsx` + `ProcessTracker.tsx` — remap nodes to new stages, drop consultation node.
- New `TicketPanel.tsx` — threaded view per order, reopen indicator.
- Admin orders list — filters + column badges for new statuses (hold split visible).

---

## Phase 4 — Timers/cron consolidation

- All new timer kinds live in `workflow_timers`; `workflow-tick` (1min pg_cron) is the only executor.
- `workflow_reminders` and `order_schedulers` stay readable for legacy rows but nothing new writes to them.
- `closure-workflow` (dead code) deleted.
- Awaiting-Govt internal reminder writes to `notifications` table (assignee + ops role) — no email queued.

---

## Open question before Phase 1

**Consultation stage** — should I drop it from the happy-path entirely, or keep it as an optional pre-form step for services that need one? Everything else is locked; I'll start the migration as soon as this is confirmed.
