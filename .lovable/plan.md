## Goal

Replace the current ticket toolbar (Reply / Note / Resolve / Close / Reopen / Resume Order) with the 4 canonical buttons from the Support Ticket flowchart, wired to the existing T001/T002/T003 email templates and the 8h auto-close for T002.

## The 4 buttons (per attached flowchart)

Each button lives on the ticket detail page toolbar and closes the ticket, sending the matching template email in the same customer thread.

1. **T001 — Normal Close / No Action Required**  
   Immediate close. Sends `T001_TICKET_COMPLETED` (Normal-close variant). Ticket → `closed`. No order side-effects.

2. **T001 — Restart Order**  
   Immediate close. Sends `T001_TICKET_COMPLETED` (Restart variant). Ticket → `closed` AND, if the ticket is linked to an order that is on hold, resumes the order (reuses `resolveTicketAndResumeOrder`).

3. **T001 — Consultation / Support Completed**  
   Immediate close. Sends `T001_TICKET_COMPLETED` (Consultation variant). Ticket → `closed`. If linked to a Talk-to-Expert order, marks the consultation done (E009-equivalent order event) so the order journey advances.

4. **T002 — Select Reason / Reply Manually (8h auto-close → T003)**  
   Opens a small dialog: pick a Category-A reason (reuses `ReasonPicker`) + optional manual reply body. On confirm: sends `T002_TICKET_REPLY`, arms the existing 8-hour ticket auto-close timer, ticket → `waiting_customer`. When the timer fires, `T003_TICKET_CLOSED` sends and the ticket → `closed`. Customer reply before the timer cancels it (already handled by inbox matcher).

Manual `Reopen` stays available for closed tickets (small secondary control), but Reply / Note / Resolve / Close / Resume-Order buttons are removed from the toolbar — everything routes through the 4 buttons above. The composer (reply/note text area) stays for free-form staff messages within an open ticket.

## Files to change

- `src/routes/admin.tickets.$ticketId.tsx`
  - Remove Resolve / Close / Resume-Order toolbar buttons (~lines 507–518).
  - Render the 4 new buttons as a `TicketActionBar` with T001 (3 variants) as outline pills and T002 as a red primary. Each shows its email code chip (T001/T002) to match the flowchart.
  - Wire click handlers to the new server functions below; keep a small confirm modal for each destructive action.
  - Keep `Reopen` for closed/resolved tickets.

- `src/lib/tickets/ticket-actions.functions.ts` — add 4 new atomic server fns (all `.middleware([requireSupabaseAuth])`):
  - `closeTicketNormalT001({ ticketId })` → send T001 (normal-close template), status=`closed`, audit row.
  - `closeTicketRestartT001({ ticketId })` → send T001 (restart template), status=`closed`, if `application_id` is on hold call the existing resume RPC (same code path as `resolveTicketAndResumeOrder`).
  - `closeTicketConsultationT001({ ticketId })` → send T001 (consultation template), status=`closed`, if linked order is Talk-to-Expert emit the consultation-completed order event.
  - `closeTicketReplyReasonT002({ ticketId, reasonId, replyBody })` → send T002 with the reason substituted + optional manual body, status=`waiting_customer`, arm 8h timer (kind `ticket_autoclose_t003`).
  - All four reuse the existing thread-header helpers so replies land in the customer's original conversation.
  - The existing `closeTicketWithReply` / `closeTicketFinal` / `resolveTicketAndResumeOrder` stay in place (used by cancellation flow) but are no longer wired to the ticket toolbar.

- `src/lib/emails/bhs-templates.ts` — add 3 template variant keys under `T001_TICKET_COMPLETED` (`normal_close`, `restart_order`, `consultation_done`) so each button can pick the right body. `T002_TICKET_REPLY` and `T003_TICKET_CLOSED` already exist.

- `src/lib/orders/actions/timers-tick.server.ts` (or the timer registry) — register the `ticket_autoclose_t003` kind: on fire, send `T003_TICKET_CLOSED` and set ticket status=`closed`.

- `src/lib/orders/journey-map.ts` — `TICKET_BUTTONS` labels updated to match the flowchart wording exactly ("Closed Ticket — Normal Mail / No Action Required", etc.) so any consumer of that config stays in sync.

## Technical notes

- All new server fns are pure `createServerFn` wrappers; helpers stay in `.server.ts` to comply with the sibling-import splitting rule.
- T002 uses the existing `ReasonPicker` (Category A) already imported by `CustomerJourneyMap`.
- Auto-close timer scheduling reuses `armTimer` / `cancelTimers` from `src/lib/orders/actions/timers.server.ts`; the inbox matcher already cancels ticket timers on customer reply.
- No DB schema change required — `support_tickets.status` already supports `waiting_customer` and `closed`.

## Out of scope

- No changes to inbox intake / ticket creation.
- Order-side journey map and its B01–B10 buttons are untouched.
- No visual redesign of the ticket page beyond the toolbar swap.
