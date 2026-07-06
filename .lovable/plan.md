## Ticket management upgrade — dedup by order, richer detail UI, close-and-resume

Tickets already exist (list at `/admin/tickets`, detail at `/admin/tickets/$ticketId`, `AddTicketDialog`, `createTicket`/`updateTicket`/`replyToTicket`, `application_id` FK, inbound email → ticket via `inbox-matcher.server.ts`). Gaps: no dedup per order, detail page lacks quick actions, no "close ticket + resume order" flow.

### 1. Dedup: one open ticket per order

Enforce in code, not schema (partial unique index would race with inbound email).

- **`createTicket`** (`src/lib/crm/tickets.functions.ts`): when `applicationId` is present, first query `support_tickets` for an existing row with the same `application_id` and `status IN ('open','in_progress','waiting_customer')`. If found, return that existing ticket id (with a `reused: true` flag) instead of inserting.
- **`inbox-matcher.server.ts`** (inbound-email → new ticket branch): same lookup before insert — if the sender's most recent open ticket for the linked order exists, append an inbound `ticket_replies` row to it instead of creating a duplicate.
- **`AddTicketDialog`**: when the user picks an order that already has an open ticket, show an inline banner "Open ticket TKT-… already exists for this order — Open it" (link) with the create button disabled unless the user ticks "Create additional ticket anyway" (audit-friendly override).
- Toast on reuse: "Reusing existing open ticket TKT-…".

### 2. Detail page (`admin.tickets.$ticketId.tsx`) — action rail + linked order card

Add a right-hand action rail and, when `application_id` is set, an order summary card.

- **Order card** (only if linked): order code, current `order_status`, customer name, service, "Open order" link. Fetched via a new small server fn `getTicketOrderContext({ orderId })` returning `{ application_code, order_status, service_name, customer_name }`.
- **Action rail** (buttons, each a mutation):
  - Change status (existing dropdown, kept).
  - Reassign (existing).
  - Change priority (new — reuses `updateTicket` which already accepts `priority`).
  - **Resolve & Resume Order** — visible only when `ticket.status !== 'closed'` AND `application_id` present AND linked order is in `CUSTOMER_HOLD` / `OUR_SIDE_DELAY`. Calls a new server fn `resolveTicketAndResumeOrder({ ticketId, resumeTo: 'IN_PROCESSING' })` that (a) sets ticket → `resolved`, (b) calls `transition_order_status` RPC to the chosen resume status, (c) inserts `application_events` row `event_type='order_resumed_from_ticket'`. Confirmation dialog with the resume-to selector (`IN_PROCESSING` default, `SUBMITTED_TO_GOVT` optional based on `allowed_order_transitions`).
  - **Close ticket** — sets `closed`, cancels auto-close scheduler (already handled).
  - **Reopen** — visible when status is `resolved` or `closed`.
- **Reply composer improvements**: keep existing; add attachment count indicator if `email_logs` shows attachments (read-only, no upload change).
- **Header pills**: SLA age (`created_at` → now), first-response age, last-customer-message age — small muted chips.

### 3. New server function

`resolveTicketAndResumeOrder` in `src/lib/tickets/ticket-actions.functions.ts`:
- Auth: `requireSupabaseAuth`.
- Input: `{ ticketId: uuid, resumeTo: enum('IN_PROCESSING','SUBMITTED_TO_GOVT') }`.
- Load ticket, verify `application_id`, verify current order status is a hold state.
- Update ticket → `resolved` (mirrors `updateTicket`).
- `context.supabase.rpc('transition_order_status', { _order_id, _new_status: resumeTo, _remarks: 'Resumed from ticket <TKT-…>' })`.
- Cancel autoclose scheduler (existing helper).
- Insert `application_events` row.

### 4. List page tweaks

- New column "Order" showing `applications.application_code` as a link when present (already fetched by `listTickets`).
- New filter chip "Linked to order" (client-side or add `hasOrder` param to `listTickets`).

### 5. Files touched

Edits: `src/lib/crm/tickets.functions.ts`, `src/lib/tickets/ticket-actions.functions.ts`, `src/lib/mail/inbox-matcher.server.ts`, `src/components/admin/AddTicketDialog.tsx`, `src/routes/admin.tickets.tsx`, `src/routes/admin.tickets.$ticketId.tsx`. No DB migration needed.

### Out of scope

- Bulk ticket actions, ticket merging UI, SLA rule engine, per-user notifications, file uploads on replies.

Approve to build.