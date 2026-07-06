
# Plan: Threaded Emails, Full Status Engine, Scheduler 3, Notifications

Big scope — grouped into 5 shippable phases so each phase is testable in isolation.

---

## Phase 1 — Email threading (one conversation per order)

**Problem today:** every template (E001, E002, E003…) is enqueued as a fresh email → Gmail shows separate threads, customer replies land as new inbound messages, staff loses context.

**Fix:**

1. Add columns to `applications`:
   - `email_thread_message_id text` — the RFC-822 `Message-ID` of the FIRST outbound mail (E001).
   - `email_thread_subject text` — the normalised subject used on E001 ("Order AP-XXXX — <Service>").
2. On enqueue (in `enqueueFromTemplateInternal`):
   - If the order has no `email_thread_message_id`, generate one (`<order-{id}-{uuid}@udyamadhar.in>`), store it, use it as `Message-ID` on send.
   - Otherwise reuse `email_thread_subject` (prefix `Re: `) and set `In-Reply-To` + `References` headers to that stored id.
3. Extend `email_queue` / `email_logs` with `in_reply_to`, `references`, `message_id` (already partly present — verify and backfill).
4. Update `zoho-smtp.server.ts` send call to pass these headers to Zoho Mail API.
5. Inbound poll (`zoho-inbox.server.ts`) — when a reply arrives, match on `In-Reply-To`/`References` first (already partially done), fallback to order number in subject. Store as `email_logs` inbound row AND `ticket_replies` row (single source of truth for the workspace timeline).

**Rendering fix (screenshot #1 shows raw quoted text):**

- In `ticket-workspace.functions.ts` merge, add a `cleanedBody` field: strip the quoted history (`On <date>, <who> wrote:` and everything below, plus `>` prefixed lines) using a small parser in `src/lib/mail/thread-clean.ts`.
- Store both `body_full` (for "show original") and `body_visible` (default render).
- UI (`admin.tickets.$ticketId.tsx`): render `body_visible` as formatted HTML (sanitised via existing DOMPurify or add `isomorphic-dompurify`), with a "Show quoted history" disclosure.

---

## Phase 2 — Order workspace: show ALL tickets for that service/order

In `getOrderDetailV2` (or the workspace loader used by `admin.orders.$orderId.tsx`), add a parallel query:

```
support_tickets where application_id = :orderId OR customer_id = :customerId
order by created_at desc
```

Return `{ orderTickets, customerTickets }`. Add a "Support Tickets" panel to `WorkspaceShell` right column with:
- badge counts (open / closed)
- clickable rows → `/admin/tickets/$ticketId`
- inline "New ticket" button that pre-fills `application_id` + `customer_id`.

---

## Phase 3 — Canonical status engine (E001–E012 + all schedulers)

### 3a. Enum & migration

Ensure `order_status_enum` contains every code from the master table (add missing):
`ORDER_CREATED, WAITING_CUSTOMER_INFO, FORM_LINK_SENT, INFO_RECEIVED, UNDER_PROCESS, APPLICATION_SUBMITTED, CUSTOMER_SIDE_DELAY, OUR_SIDE_DELAY, HIGH_PRIORITY, REFUND_REQUESTED, REFUND_APPROVED, REFUNDED, COMPLETED, CLOSED, REOPENED`.

Add to `applications`:
- `reminder_mode text check in ('manual','auto_2h','stopped')`
- `reminder_next_at timestamptz`
- `reminder_stop_reason text`
- `reminder_consecutive_missed int default 0`

Rebuild RPC `allowed_order_transitions(_from)` + `transition_order_status(...)` to enforce the exact transition graph from the master table.

### 3b. Email template registry (single source of truth)

Create `src/lib/email-templates/order-lifecycle.ts`:

```
E001 order-welcome-invoice     auto  on ORDER_CREATED (PayU webhook)
E002 order-form-link           manual (Send/Resend Form Link)
E003 order-customer-hold       auto on transition → CUSTOMER_SIDE_DELAY
E004 order-closed              auto on transition → CLOSED (Scheduler 2)
E005 order-our-side-delay      auto on transition → OUR_SIDE_DELAY
E006 order-completed           auto on transition → COMPLETED
E007 consultation-completed    manual
E008 ticket-reply              manual (from ticket workspace)
E009 ticket-resolved           auto/manual on ticket resolve
E010 ticket-closed             auto/manual on ticket close
E011 refund-approved           auto on transition → REFUND_APPROVED
E012 app-submitted             auto on transition → APPLICATION_SUBMITTED
```

Wire the auto-sends inside `transition_order_status` RPC (or in a server-side after-hook in `src/lib/orders/order-actions.functions.ts`) so *the transition itself* enqueues the correct template. All sends go through the Phase-1 threaded enqueue.

### 3c. Order action panel

Rewrite `src/lib/orders/order-actions-map.ts` from the master button table. Each entry:
`{ label, allowedFromStatuses, requiredRole, confirm?: {reasonPicker|textbox|filePicker}, doAction }`.

Render in `admin.orders.$orderId.tsx` right column — buttons that don't apply are hidden, not disabled-placeholder.

### 3d. Schedulers

- **Scheduler 2** — closure timer: pg_cron every 5 min → `/api/public/cron/close-stale-customer-hold` closes orders in `CUSTOMER_SIDE_DELAY` for >24h, sends E004, notifies employee+admin.
- **Scheduler 3** — Our Side Delay reminders: pg_cron every 5 min → `/api/public/cron/our-side-reminders`:
  - Manual mode: when `reminder_next_at <= now()` → notify employee, flip to `HIGH_PRIORITY` if still `OUR_SIDE_DELAY`.
  - Auto 2h: fire notification every 2h; increment `reminder_consecutive_missed`; at 3 misses → `HIGH_PRIORITY` + notify Super Admin.
  - No option chosen: 30 min after entering `OUR_SIDE_DELAY`, auto-start `auto_2h`, flip to `HIGH_PRIORITY`, notify Super Admin.
- Stop conditions handled in `transition_order_status`: any move to `COMPLETED`, `REFUND_REQUESTED`, `CLOSED`, or explicit "Stop Reminders" clears reminder columns.

Reminder UI: after clicking "Our Side Delay" the action panel opens a modal matching screenshot #2 (Manual date+time / Auto 2h / Stop+reason).

---

## Phase 4 — Notifications (bell + sound)

Existing tables: `notifications` (already in schema).

- Add helper `src/lib/notifications/emit.server.ts` with `emitNotification({userId, type, title, body, link})`.
- Insert emits at every event row in the master notification table (new order assign, form submit, incoming email, scheduler-2 start, auto-close, ticket raised, reminder fires, escalation, HIGH_PRIORITY, refund requested).
- Frontend: `src/hooks/useNotifications.ts` already exists — extend to:
  - realtime channel `user:<auth.uid()>:notifications`
  - unread count badge on bell in admin layout header
  - dropdown panel listing latest 20, each linking to relevant order/ticket workspace
  - play `/notification.mp3` (add asset) on new arrival if tab focused; browser Notification API if permission granted.

---

## Phase 5 — Docs page

New route `/admin/help/email-matrix` — renders the E001–E012 matrix + status table + button matrix straight from the shared constants (`order-lifecycle.ts`, `order-actions-map.ts`) so it never drifts from code.

---

## Technical notes

- All new server logic goes through `createServerFn` with `requireSupabaseAuth`; cron endpoints under `src/routes/api/public/cron/*` verify `apikey` header.
- Every new `public.*` table gets `GRANT` + RLS + `has_role()` policies in the same migration.
- Threading headers (`Message-ID`, `In-Reply-To`, `References`) must be preserved end-to-end: enqueue → Zoho send → stored in `email_logs.message_id` for future replies.
- HTML sanitisation via `isomorphic-dompurify` (needs `bun add`).
- No client-side role checks — everything gated server-side via `has_role`.

---

## Suggested build order (each phase is a separate turn)

1. Phase 1 (threading + clean render) — biggest UX win, isolates SMTP changes.
2. Phase 3a + 3b (enum, transitions, auto-emails) — foundation for everything else.
3. Phase 3c + 3d (action panel + schedulers + reminder modal).
4. Phase 4 (notifications).
5. Phase 2 (tickets in order workspace) + Phase 5 (docs page) — smallest, ship last.

Confirm and I'll start with Phase 1.
