# Ticket System v2 — Email-Driven, Global-Standard

Modeled on Zendesk / Freshdesk / HelpScout basics:

- Every ticket is a conversation thread with **one canonical customer email** (the same address that received the order confirmation + invoice).
- Every staff reply → email to that address, with `Reply-To` and threading headers so the customer can just hit "Reply" in Gmail/Outlook.
- Every customer reply → lands back on the same ticket automatically (inbound email parser).
- Customer can also open the ticket in a signed link - no dont give this option.
- No customer login, no separate portal password.

---

## 1) Rules — "Registered email only"

- **Ticket recipient = `customers.primary_email**` at the moment of creation, snapshotted onto the ticket row (`ticket_email`) so later profile edits don't redirect the thread.
- Staff **cannot type an arbitrary recipient**. AddTicketDialog resolves the customer → shows their locked email → warns if the customer has no email on file.
- Inbound replies are accepted **only** if `From:` matches `ticket_email` (case-insensitive). Anything else → quarantined for manual review, never auto-attached.
- Same address is what receives order confirmation and invoice today (already wired via `sendTransactionalEmail(recipientEmail = customers.primary_email)`), so the customer sees one consistent thread.

---

## 2) Global-standard workflow (what changes vs today)

**Statuses** (drop `in_progress`, use industry-standard set):
`open → pending (waiting on us) → waiting_customer → resolved → closed`

- `open` = new / unassigned
- `pending` = assigned, we owe a reply
- `waiting_customer` = we've replied, waiting on customer
- `resolved` = closed with option to reopen within 7 days
- `closed` = final; reopening creates a new linked ticket

**Priorities**: low / normal / high / urgent (unchanged names, add `urgent`).

**SLA (first response + resolution)** per priority, business-hours aware (reuse existing `business-hours` module):

- urgent 1h / 4h · high 4h / 1 business day · normal 1 bd / 3 bd · low 2 bd / 5 bd
- Store `first_response_due_at`, `resolution_due_at`; badge turns amber at 80%, red on breach.

**Auto-assign**: reuse `assignment_pool` round-robin scoped to a `support` role bucket.

**Auto-close**: `waiting_customer` for 3 business days with no inbound → `resolved`; `resolved` for 7 days → `closed`. Reuses Scheduler 6 pattern; remove today's "only if application_id" restriction.

**Reopen**: customer replies to a resolved/closed ticket → auto-reopens to `pending` and re-assigns to last agent.

**CSAT**: after `resolved` email, single line "How did we do? 👍 👎" → captures rating on click via signed link.

---

## 3) Email flow (the core of the rebuild)

**Outbound (every message the customer sees)**

- Sent from `support@<sender-domain>` via zoho Emails queue.
- Subject convention: `[#TKT-YYYYMMDD-0001] <original subject>` — the bracketed token is how inbound matching finds the ticket.
- Headers: `Message-ID`, `In-Reply-To`, `References` chained per reply → shows as a single Gmail/Outlook thread.
- `Reply-To: support+<ticketId>@<inbound-domain>` — belt + suspenders alongside the subject token.
- Templates (React Email, registered in `registry.ts`):
  1. `ticket-created` — confirmation, ticket number, expected response time (from SLA).
  2. `ticket-reply` — the staff reply text, quoted previous message, CTA "View conversation" (signed link).
  3. `ticket-resolved` — resolution summary + CSAT thumbs + "Reply to reopen".
  4. `ticket-autoclose-warning` — sent 24h before auto-close from `waiting_customer`.

**Inbound (customer hits Reply)**

- New public route `POST /api/public/webhooks/inbound-email` receives the parsed email (webhook from Mailgun/Postmark/Zoho — pick one below).
- Match order: `Reply-To` token → subject `[#…]` token → `In-Reply-To` header lookup → sender-email fuzzy match to open tickets.
- Verify `from == ticket_email`, strip quoted history (standard `EmailReplyParser`-style trim), attach as a public `ticket_replies` row, flip status to `pending`, notify assignee.
- Unknown sender or no ticket match → row in `inbound_email_quarantine` for staff to triage; never auto-creates a new ticket to avoid spam.

**Inbound provider** (must pick one — see Open Decisions):

- **Zoho Mail** — already integrated in this project (`src/lib/mail/zoho-inbox.server.ts`). Cheapest, zero new secrets. Preferred.
- **Postmark inbound** — cleanest webhook, best parsing. Costs ~$1.25/1000.
- **Mailgun routes** — works, decent parsing.

---

## 4) UI changes

**Admin list `/admin/tickets**`

- Add SLA column with countdown chip, "Breached" filter, priority filter incl. urgent.
- Bulk actions: assign, close, change priority.

**Admin detail `/admin/tickets/$ticketId**`

- Header: recipient email (locked, with "same as invoice" hint), SLA countdown, source chip (web / email / staff).
- Thread: gmail-style, staff avatar left / customer right, "Emailed to &nbsp; at 14:22" chip under every public reply, internal notes in amber.
- Composer: default Public Reply; visible preview of what the customer will receive; Ctrl+Enter to send.
- Canned responses picker (new tiny `canned_responses` table, staff-editable).
- Right rail: customer card (name, email, phone, all orders), linked order shortcut, activity log.

**Order & Lead workspace**

- Replace placeholder "Support Ticket" tab with a real list of tickets for that customer/order + "Raise Ticket" button (customer + order pre-filled, email locked).

**Customer-facing (no login)**

- `/support/t/<signedToken>` — public read-only thread + reply box. Token embedded in every outbound email's "View conversation" button. Uses narrow anon RLS keyed by signed token, never exposes internal notes. - i dont want this feature customer should reply to our mail only through their email 

---

## 5) Schema changes (single migration)

Add to `support_tickets`:

- `ticket_email TEXT NOT NULL` (snapshot of recipient)
- `source TEXT` — `web | email_inbound | staff`
- `priority` extend with `urgent`
- `first_response_due_at`, `resolution_due_at`, `first_response_at`, `resolved_at` (last one exists), `closed_at`
- `assignee_last_active_at`
- `last_customer_message_at`, `last_staff_message_at`
- `csat_score SMALLINT`, `csat_at`

Add to `ticket_replies`:

- `direction TEXT` — `outbound | inbound | note`
- `email_message_id TEXT` (RFC Message-ID for threading)
- `email_in_reply_to TEXT`
- `email_send_log_id UUID` (link to `email_send_log`)

New tables:

- `canned_responses (id, title, body, is_shared, created_by)`
- `inbound_email_quarantine (id, from_email, subject, raw, reason, created_at, resolved_by, resolved_at)`

Drop the dead `ticket_state` column + `escalated` enum value.

Grants + RLS: staff-full via `has_any_staff_role`; add narrow `TO anon` SELECT policy on the customer thread view keyed by a signed-token RPC (no direct anon table access).

---

## 6) Rollout order

**M1 — Foundation (schema + email out)**
Migration, ticket_email snapshot, three React Email templates, wire `createTicket`/`replyToTicket`/`updateTicket→resolved` to send them, consolidate the two duplicate `replyToTicket` server fns into one. Employees immediately see "customer was emailed" chips.

**M2 — Inbound + threading**
Pick provider (see Open Decisions), add `/api/public/webhooks/inbound-email`, subject/Reply-To token matching, quarantine table, auto-reopen. This is where it becomes a real ticket system.

**M3 — SLA, auto-close, auto-assign, canned responses**
Business-hour SLAs, warning + auto-close scheduler for all tickets (not just order-linked), assignment pool, canned responses picker.

**M4 — Customer-visible signed-link thread + CSAT**
Public `/support/t/<token>` page, CSAT capture, unified inbox tab on order/lead workspaces.

**M5 — Cleanup**
Drop dead `ticket_state` / `escalated`, remove placeholder tab, wire in-app bell notifications for assignee.

---

## 7) Open decisions — please confirm before build

- **Inbound provider**: Zoho (already connected, cheapest) .
- **From address**: `help@businesshelpservices.com` same we using to send mails now   
**CSAT**: include in M4, or skip entirely?
- **Signed-link customer page (M4)**: build now or defer until inbound email is proven stable in M2/M3? = dont build it 