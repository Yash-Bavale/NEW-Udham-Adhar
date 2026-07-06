# Support ticket + inbound email walkthrough

## What actually exists today (state check)

Before changing anything I checked the DB — inbound → ticket wiring is **already running**:

- `support_tickets`: **43** rows; latest 8 all created from `email_inbound` on 2–6 Jul.
- `inbound_email_quarantine`: 11 rows `converted_to_ticket`, 9 `no_match` (all system senders: `mailer-daemon@mail.zoho.in`, `noreply@zohoaccounts.in`) — so the "no ticket ever created" perception is because the last few emails you replied with were either (a) filtered as system noise, or (b) the poll cron hasn't run since your last reply. We'll verify and force a run.
- Ticket detail page already renders inbound vs outbound replies (`ticket_replies.direction`) with `email_message_id` threading — the thread UI exists at `/admin/tickets/{id}`.
- Quarantine review UI exists at `/admin/quarantine`.

So the plumbing works; what's missing is **visibility** (you can't see the poller status, or convert a `no_match` email into a ticket with one click) and a **live demonstration**.

## Plan

### 1. Verify + document the inbound pipeline

- Read `src/lib/mail/inbox-matcher.server.ts` and `zoho-inbox.server.ts` end-to-end and confirm:
  - Poller endpoint: `POST /api/public/cron/poll-zoho-inbox` (guarded by anon/publishable/CRON_SECRET).
  - Fetches unread mail from `help@businesshelpservices.com` via Zoho OAuth.
  - Matches inbound to a ticket by: `In-Reply-To` header → existing `ticket_replies.email_message_id`; else by sender email → most recent open ticket for that customer; else creates a NEW ticket (`source='email_inbound'`) if sender is a known customer/lead; else quarantines as `no_match`.
- Confirm pg_cron job `poll-zoho-inbox` is scheduled every 2 min and hitting the route (I'll query `cron.job` + `cron.job_run_details` through a SECURITY DEFINER helper since the `cron` schema is restricted).

### 2. Force a live poll now and generate a ticket

- Add an admin-only button "Poll inbox now" on `/admin/quarantine` (calls a `createServerFn` with `requireSupabaseAuth` + admin role check that invokes `pollZohoInbox(50)`).
- You reply to any BHS email from a customer address, then click the button — a new ticket appears in `/admin/tickets`, and I'll open it with you to show the thread.

### 3. Show the email thread on a ticket

- On `/admin/tickets/{id}` the timeline already shows:
  - Original inbound message (rendered from body_html, sender chip).
  - Each outbound staff reply (with "Emailed" badge when `emailed_at` is set).
  - Internal notes (Lock icon, not sent to customer).
- I'll add a small **"Message headers"** popover per reply showing `email_message_id` / `email_in_reply_to` so you can see how threading is stitched.

### 4. Improve the Quarantine tab (the "not tracked" ones)

`no_match` rows are inbound emails to help@businesshelpservices.com from unknown senders (or system senders). Today they sit unreviewed. I'll add:

- Filter chips: All / No match / Converted.
- Per-row actions:
  - **Create ticket** — opens a dialog pre-filled with sender, subject, body → creates a `support_tickets` row with `source='email_inbound'` and a first `ticket_replies` (direction='inbound').
  - **Link to existing ticket** — searchable ticket picker; attaches as an inbound reply.
  - **Mark as noise** (mailer-daemon / OTP mail / etc.) — sets `review_action='noise'`, hides from default view.
- One-tap "Add sender as customer" when the sender has no customer/lead row (this is why some legit emails stay `no_match`).

### 5. Journey tree for a customer email (docs page)

Add a short admin help card at the top of `/admin/quarantine` explaining the flow:

```text
help@businesshelpservices.com (Zoho Mail)
        │  poll every 2 min via /api/public/cron/poll-zoho-inbox
        ▼
[fetch UIDs] ── seen? ──► skip
        │ new
        ▼
Match by  In-Reply-To header
        │ hit ──► append inbound reply to existing ticket
        │ miss
        ▼
Match by sender email → recent open ticket
        │ hit ──► append inbound reply
        │ miss
        ▼
Sender is known customer/lead?
        │ yes ──► create NEW ticket (source=email_inbound)
        │ no  ──► inbound_email_quarantine (reason=no_match)
                        │
                        ▼ staff review in /admin/quarantine
                Create ticket / Link / Mark as noise
```

## Technical details

- New serverFn `pollInboxNow` in `src/lib/mail/inbox-poll.functions.ts` — `requireSupabaseAuth` + `has_role(admin|super_admin)` gate; imports `pollZohoInbox` inside handler.
- New serverFns `convertQuarantineToTicket`, `linkQuarantineToTicket`, `markQuarantineAsNoise` in `src/lib/tickets/quarantine.functions.ts` (file exists — extend it).
- UI edits: `src/routes/admin.quarantine.tsx` (filters + actions + poll button + help card), `src/routes/admin.tickets.$ticketId.tsx` (message-header popover).
- No schema changes required (`review_action` column already exists).
- Zero business-logic change to the poller itself.
