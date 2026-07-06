
## Enterprise Ticket Workspace — `/admin/tickets/$ticketId`

Rebuild the ticket detail page as a full-page, 3-column enterprise workspace (Zendesk/Linear/Intercom feel). Reuse existing CRM design tokens (bright, white cards, soft shadows, rounded, blue/emerald/orange accents — no dark theme). Ship in phases so we deliver a real, production-quality UI now and layer advanced features next.

### Scope split

**Phase 1 (this build) — full UI + all wiring on existing data**
Everything below renders against data we already have (`support_tickets`, `ticket_replies`, `email_logs`, `applications`, `customers`, `documents`, `application_events`, `payments`, `invoices`, `notifications`, `tasks`, `follow_ups`, `order_schedulers`). No schema changes.

**Phase 2 (follow-up, requires migrations)** — flagged clearly in UI as "coming soon" placeholders so we don't fake data:
- Ticket followers / collaborators table
- Ticket merging / splitting
- Draft autosave table (server-side)
- Presence ("another agent is replying") via Realtime Presence
- CC/BCC storage columns on `ticket_replies`
- Scheduled send queue
- Pinned notes + color labels + mentions parsing table
- SLA policy engine (right now we compute age from `created_at`/`first_response_at`)

I'll call these out in the UI with subtle "Preview" badges — no fake buttons that do nothing.

---

### Layout (`src/routes/admin.tickets.$ticketId.tsx` — full rewrite)

Full-page 3-column grid inside `AdminShell`:

```
┌─ Left 25% ──┬─ Center 50% ──────────────┬─ Right 25% ─┐
│ Ticket list │ Header (sticky)           │ Details      │
│ + filters   │ ─────────────────────────  │ Customer     │
│ + search    │ Thread (scroll)           │ Order        │
│ + sort      │ ─────────────────────────  │ Documents    │
│             │ Reply composer (sticky)   │ Timeline     │
│             │                           │ History      │
└─────────────┴───────────────────────────┴──────────────┘
```

Collapsible left & right rails (chevron toggles, persisted in `localStorage`). Below `lg` breakpoint → tabs (Conversation / Details / History).

---

### Left rail — `TicketListRail`

- Search input (debounced), filter chips (Status, Priority, Assignee, Customer, Order), sort dropdown (Newest/Oldest/Updated/Unassigned).
- Uses existing `listTickets` server fn; add `sort` param + `unassigned` flag.
- Each row: ticket number, subject, customer name, relative time, status + priority badges, unread dot when `last_customer_message_at > last_staff_message_at`.
- Active row highlighted; clicking navigates via `<Link>` (instant, no reload — TanStack Router keeps left rail mounted).
- Virtualized only if >200 rows (skip for now, use pageSize=50).

### Center — Conversation workspace

**Sticky header card:**
- Row 1: `TKT-…` · Subject (editable inline — reuses `updateTicket`).
- Row 2: chips — Status (dropdown), Priority (dropdown), Assignee (popover w/ staff search), Customer link, Order link, SLA age, first-response age, source badge, ticket email.
- Row 3: quick actions — Reply, Internal Note, Assign, Close, Reopen, Resolve & Resume Order (existing), Escalate (sets priority=urgent + event), Copy link, Print (window.print with print styles), Download (JSON export of thread), Merge (Phase 2 disabled w/ tooltip).

**Thread:**
- Fetch `ticket_replies` + `email_logs` for the ticket, merge into a unified timeline sorted by `created_at`.
- Message card variants by `direction`/`is_internal`/system:
  - `customer_inbound` — left-aligned, blue avatar ring
  - `staff_outbound` — right-aligned, emerald ring
  - `internal_note` — amber background, "Internal" chip, not emailed
  - `system` — muted pill row (status change, assignment, automation) rendered inline from `application_events` (`ticket_status_change`, `assignment_change`, `ticket_created`, `order_resumed_from_ticket`, `automation_triggered`).
- Header per card: avatar (initials), name, role badge (Customer/Agent/System), email, timestamp (relative + absolute tooltip), delivery status pill from `email_logs.status` (queued/sent/delivered/bounced).
- Body: sanitized HTML render (use `DOMPurify` — add dep) for `email_logs.body_html`, else plain text with `whitespace-pre-wrap`.
- Quoted replies (`> ` blocks / `<blockquote>`) auto-collapsed with "Show trimmed content" toggle.
- Attachments row from `email_logs.attachments` jsonb — icon per type (image/pdf/zip/other), filename, size, download link.
- Long threads: collapse middle messages when >8, keep first + last 3 expanded.

**Sticky reply composer:**
- Tabs: **Reply** / **Internal Note**.
- Toolbar: Bold / Italic / Underline / Bullet / Numbered / Link (using `contentEditable` + `document.execCommand` — lightweight, no heavy editor dep).
- Templates dropdown — pulls from `canned_responses` (existing table). Insertion replaces `{{customer_name}}`, `{{order_number}}`, `{{ticket_id}}`, `{{service_name}}` from loaded context.
- Attachments: drag/drop + file picker → uploads to `documents` bucket under `tickets/{ticketId}/`, attaches URLs to reply metadata (stored in `email_logs.attachments`).
- Emoji: native `<input type="text">` fallback via a small picker (12 common emojis inline — skip full picker dep).
- Client-side draft autosave to `localStorage` every 5s keyed by `draft:ticket:<id>` (server-side draft table = Phase 2).
- Send buttons: **Send**, **Send & Resolve**, **Send & Close**. Schedule Send = Phase 2 (disabled + tooltip).
- CC/BCC inputs render, values passed to `replyToTicket` — currently ignored server-side (Phase 2 to persist); we surface a "CC preview only" hint until then. **Or** we can wire straight into the SMTP call now — I'll wire it into the outgoing email headers but not persist per-recipient rows.

---

### Right rail — `TicketContextRail` (tabbed: Details / Customer / Order / History)

**Details tab:** all ticket fields, SLA remaining (business-hours aware via existing `business-hours.ts`), created/updated, assignee with reassign popover, category (service_name), source.

**Customer tab:** avatar (initials), name, email, phone, language, state, `customers.created_at` → "Customer since", counts computed via new server fn `getCustomerTicketStats({ customerId })`:
- total orders (`applications` count)
- open tickets, closed tickets
- lifetime value (`SUM(payments.amount WHERE status='captured')`)

**Order tab** (when `application_id`): order code, service, order_status, payment status (latest payment), invoice link (`invoices`), assigned executive (`applications.assigned_to`), certificate status (`certificates` presence), document status (count of documents by status), Open Order button. Reuses existing `getTicketOrderContext` — extended.

Documents section: list `documents` for the linked application. Preview (image inline / PDF via `<iframe>`), Download, Approve/Reject (reuse existing `document-review.functions.ts`). Replace + history = Phase 2.

**History tab:**
- Activity timeline from `application_events` filtered by `application_id` OR ticket-related events → icon + actor + timestamp + description.
- Previous tickets for this customer (link list), previous orders, complaints (`complaints`), refund history (`refund_requests`), notes (`customer_notes`), sent emails (`email_logs` by customer), automations (`workflow_events` filtered).

### New server functions (`src/lib/crm/tickets.functions.ts` + one new file)

- `getTicketWorkspace({ ticketId })` — single call returning: ticket, replies+emails merged, related events, order context, documents, customer stats, previous tickets/orders/complaints/refunds. One round trip = instant open.
- `getCustomerTicketStats({ customerId })`
- Extend `listTickets` with `sort` and `unassigned`.
- Reuse existing: `updateTicket`, `replyToTicket`, `resolveTicketAndResumeOrder`, `checkOpenTicketForOrder`, `getTicketOrderContext`, canned responses fns, document review fns.

### Realtime

Subscribe (via existing `useRealtimeTable`) to:
- `ticket_replies` filtered `ticket_id=eq.<id>`
- `support_tickets` filtered `id=eq.<id>`
- `email_logs` filtered by ticket
- `application_events` filtered by application

On any event → `queryClient.invalidateQueries(['ticket-workspace', id])`. Optimistic update on reply send (append pending card with spinner).

Presence ("someone else is typing") = Phase 2 (needs presence channel wiring; deferred to avoid scope bloat).

### Keyboard shortcuts

Add local `useEffect` listener on the workspace: R = focus reply, N = switch to note tab, A = open assignee popover, C = close ticket, F = focus left search, Esc = navigate back to list. Skip when focus is in an input.

### Files

**New:**
- `src/routes/admin.tickets.$ticketId.tsx` — rewritten
- `src/components/admin/tickets/TicketListRail.tsx`
- `src/components/admin/tickets/TicketHeader.tsx`
- `src/components/admin/tickets/TicketThread.tsx`
- `src/components/admin/tickets/MessageCard.tsx`
- `src/components/admin/tickets/ReplyComposer.tsx`
- `src/components/admin/tickets/TicketContextRail.tsx`
- `src/components/admin/tickets/ActivityTimeline.tsx`
- `src/components/admin/tickets/CustomerPanel.tsx`
- `src/components/admin/tickets/OrderPanel.tsx`
- `src/components/admin/tickets/DocumentsPanel.tsx`
- `src/components/admin/tickets/HistoryPanel.tsx`
- `src/components/admin/tickets/keyboard.ts`
- `src/lib/crm/ticket-workspace.functions.ts`

**Edited:**
- `src/lib/crm/tickets.functions.ts` (add `getCustomerTicketStats`, extend `listTickets`)
- `src/lib/tickets/ticket-actions.functions.ts` (accept CC/BCC + attachments in `replyToTicket`)

**Dependency add:** `dompurify` + `@types/dompurify` for safe HTML rendering.

### Explicitly out of scope (Phase 2)

Merge/split tickets · Followers · Server-side drafts · Scheduled send · Presence/typing · Pinned notes · Color labels · Full mentions parsing · Table/Emoji-picker in editor · SLA policy engine · Certificate/verification status widgets (require new fields).

---

Approve to build Phase 1.
