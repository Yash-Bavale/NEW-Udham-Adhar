## Goal

When T002 is sent, surface an 8h close-path countdown on the ticket; when a new ticket arrives during an order's active delay countdown, pause the delay timer and auto-resume it the moment the ticket closes (showing the paused remaining time in the delayed-trigger line). Also lock the action toolbar once a terminal action has been taken.

## Changes

### 1. Ticket page — show 8h close-path countdown (T002 armed)

`src/routes/admin.tickets.$ticketId.tsx`
- Fetch the ticket's active `ticket_autoclose_24h` scheduler row via `getOrderExceptionState` is order-scoped — instead add a small server fn `getTicketAutoclose({ ticketId })` in `src/lib/tickets/ticket-actions.functions.ts` returning `{ firesAt, businessSecondsRemaining, status, startedAt }` for the latest scheduler of type `SCHEDULER_TICKET_AUTOCLOSE` for that ticket.
- In `TicketHeader`, when the row exists and ticket status is `waiting_customer`, render a `CountdownChip` labelled **"Auto-close in"** next to the status pill (Row 1). Invalidate on mutation success.

### 2. Ticket page — lock buttons after terminal action

`src/routes/admin.tickets.$ticketId.tsx`
- Add local `actionLocked` flag: `true` if any of the four mutations `isPending` OR `isSuccess` OR ticket status is `closed`/`resolved` OR T002 autoclose scheduler is active.
- Disable all four `TicketFlowBtn`s (Normal, Restart, T001-Consultation, T002) when `actionLocked` is true. Keep Reopen button unchanged.

### 3. Delay-path pause when a ticket arrives on an order with active delay countdown

Currently `pauseActiveCustomerScheduler` (invoked by inbox matcher) only pauses `SCHEDULER_CUSTOMER_CLOSURE`. Extend the pause/resume to cover the other delay-path scheduler types too so any active delay-trigger timer pauses.

`src/lib/mail/inbox-matcher.server.ts`
- Rename/extend `pauseActiveCustomerScheduler` → `pauseActiveDelaySchedulers(applicationId, ticketId)` that pauses ALL active schedulers for the order (customer-closure, our-side-reminder, feedback-followup — anything except the ticket_autoclose itself) via `pauseScheduler`, storing `paused_by_ticket_id = ticket.id`.

`src/lib/tickets/ticket-actions.functions.ts`
- In every close-path (T001 Normal, T001 Restart, T001 Consultation, T002 auto-close firing → T003 close, manual close): after the ticket transitions to `closed`, resume every scheduler where `paused_by_ticket_id = ticket.id` via `resumeScheduler`. The existing resume block (line ~570, ~617) already does this for one type — widen the query so it picks up all paused schedulers for the ticket (drop the `scheduler_type` filter, keep only `paused_by_ticket_id` + `status = 'paused'`).
- `resumeScheduler` already recomputes `fires_at` from `business_seconds_remaining`, so the countdown resumes with exactly the time that was left.

`src/lib/crm/tickets.functions.ts` (line 394 resume block) — same widening.

### 4. Delayed-trigger UI — show paused remaining time

`src/components/admin/workspace/CustomerJourneyMap.tsx` (and any place rendering delay-path countdown chips):
- Read `order_schedulers` with `status IN ('active','paused')` for the order and pass `paused` + `pausedLabel="Paused — ticket #TKT-..."` + `firesAt` (which is null while paused) plus `businessSecondsRemaining` into `CountdownChip`.
- Extend `CountdownChip` to accept `remainingSeconds` and, when `paused` and `firesAt` is null, format the pretty label from `remainingSeconds` instead of returning null. (Current chip returns null if `firesAt` is null — that's why paused rows disappear.)
- The line will read: **"Delayed trigger paused — 6h 12m remaining · resumes when ticket TKT-… closes"**.

### 5. No DB migration required

`order_schedulers.paused_by_ticket_id`, `business_seconds_remaining`, and the pause/resume helpers already exist. Behaviour is purely a wiring/widening change plus one small read fn and two UI additions.

## Verification

- Open a `waiting_customer` order with an active customer-delay scheduler; email a new inbound reply → confirm a ticket opens, delay chip flips to violet "Paused — X remaining", and `order_schedulers.status='paused'`, `paused_by_ticket_id=<ticket>`.
- Send T002 on that ticket → toolbar disables, header shows "Auto-close in 8h" chip counting down.
- Close ticket (any path) → header buttons stay disabled (ticket resolved), delay chip resumes counting from the exact remaining seconds; scheduler `status='active'`, `fires_at` recomputed.
