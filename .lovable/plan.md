## Goal
1. Make the Orders table **Stage**, WorkspaceShell **Current Stage**, and Journey card **Current** always show the same value by deriving all three from one function.
2. Find every order whose customer-delay timer expired (or whose ticket auto-close fired) but which is still not marked closed / never got the E010 email, then close them and send the mail using the correct reason.

## Part 1 — Single source of truth for stage

**The one function.** `computeOrderStage(lead, application)` in `src/lib/crm/computeOrderStage.ts` already reads every field the three surfaces care about (`fulfillment_status`, `application_status`, `form_submitted_at`, `certificate_uploaded_at`, `lead_status_v2`, `payment_successful_at`, closure/refund states). It returns an `OrderStage` and `STAGE_META[stage].label` gives the display string. This becomes the only allowed source.

**Wire all three surfaces to it.**

- **Orders table "Stage"** (`src/routes/admin.orders.index.tsx`): already uses `order.stage` from `computeOrderStage` via `orders-v2.functions.ts`. Keep as-is — this is the reference behavior.
- **WorkspaceShell "Current Stage"** (`src/components/admin/workspace/WorkspaceShell.tsx` + `TabStatusHeader.tsx`): currently reads `applications.fulfillment_status` and maps via `FULFILLMENT_LABEL` / S-code. Replace with `STAGE_META[computeOrderStage(lead, application)].label`. Drop the S-code prefix here so it matches the table verbatim.
- **Customer Journey card "Current"** (`src/components/admin/workspace/CustomerJourneyMap.tsx` and/or the journey header): currently layers `workflow_status` + closure fields on top of `fulfillment_status`. Replace the "current stage" readout with the same `STAGE_META[computeOrderStage(...)].label`. Highlighting logic inside the SVG can still consume the same `OrderStage` value — no separate derivation.

**Guardrail.** Add a short comment at the top of `computeOrderStage.ts` naming it the single source of truth, and remove/inline any other place that maps `fulfillment_status → label` for a "current stage" display (search: `FULFILLMENT_LABEL[`, `labelForFulfillment(`, `S12`, `Order Closed` string literals used as a current-stage display). Filter dropdowns and history rows that legitimately need raw fulfillment strings are left alone; only "what stage is this order in right now" displays are unified.

## Part 2 — Recover stuck closures + missing E010 emails

**Investigate first (read-only queries, no code changes yet):**

1. Orders where a customer-delay timer or ticket auto-close should have closed them but didn't:
   - `applications` with `fulfillment_status = 'customer_delay'` AND `customer_hold_started_at` older than the configured delay window.
   - `order_schedulers` rows with `status = 'fired'` / `stopped_at IS NOT NULL` for `customer_closure_24h` where the parent application is not in `order_closed` / `CLOSED`.
2. Orders that ARE closed but have no E010 send:
   - `applications.order_status = 'CLOSED'` (or `fulfillment_status = 'order_closed'`) with a `closure_reason_id` set, joined against `email_logs` / `email_queue` filtered to the E010 template — flag those with zero matching sends.

Return the list to the user for confirmation before mass-fixing (count + sample of application_codes).

**Then, after confirmation, in one recovery pass:**

- For each stuck delay order past its window: call the same code path `closeOrderSystem` uses (transition to `CLOSED` with `_force`, set `fulfillment_status = 'order_closed'`, cancel timers/schedulers, enqueue E010 with the customer-delay reason already stored on the order or the delay row).
- For each already-closed order missing E010: enqueue E010 only, using the existing `closure_reason_id` / `closure_remarks` so variables (`customer_name`, `order_number`, `closure_reason`, `closure_date`, `employee_remarks`, invoice/service fields) render correctly — same `backfillCommonVariables` path that was fixed for AP-2026-007409.

**Prevent recurrence.** In `closeOrderSystem` (and the ticket auto-close path in `schedulers.server.ts` / `workflow-reminders.ts`), wrap the "flip fulfillment_status to `order_closed` + enqueue E010" steps so a failure in one is logged and retried rather than silently swallowed — today an email failure can leave the order flipped but un-mailed (or vice-versa). Add a lightweight `application_events` row on both success and failure so the next audit is a single query.

## Technical notes

- No schema changes.
- No new server functions; reuse `closeOrderSystem` from `src/lib/orders/actions/close-actions.functions.ts` and `enqueueFromTemplateInternal` with `BHS_EMAILS.E010_TICKET_CLOSED_FINAL`.
- Files touched for Part 1: `computeOrderStage.ts` (comment only), `WorkspaceShell.tsx`, `TabStatusHeader.tsx`, `CustomerJourneyMap.tsx`. Files touched for Part 2 hardening: `close-actions.functions.ts`, `schedulers.server.ts`, `workflow-reminders.ts`.
- Recovery data changes go through the insert tool (updates + queue inserts), not a migration.
