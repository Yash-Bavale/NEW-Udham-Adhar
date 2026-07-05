# BHS CRM v2 — Implementation Plan

Aligns the app with the v2 PRD (Email + Support + Journey). Adds two things on top of the PRD:

1. **Office-hours-aware schedulers** — all internal timers (24h closure, 2h reminders, 30-min auto-start, ticket auto-close) count only during business hours. Window defaults to **10:00–18:00 IST, Mon–Sat**, and is editable by Super Admin from Settings.
2. **Redesigned Order Workspace** — one screen an employee can drive an order from start to finish, with a Journey Strip, exception banner, contextual action panel, email thread, and ticket panel.

The plan follows the PRD's 9 phases but front-loads foundations (status engine, office hours, workspace shell) so every later phase builds on a stable base.

---

## Phase 0 — Foundations (office hours + workspace shell)

**DB (migration)**

- `business_hours_config` (single-row): `tz` (default `Asia/Kolkata`), `open_time` (10:00), `close_time` (18:00), `working_days` (`[1,2,3,4,5,6]` Mon–Sat), `holidays` (date[]), `updated_by`, `updated_at`.
- `app_settings` (key/value JSONB) for future toggles.
- RLS: read for any staff role (`has_any_staff_role`), write for `super_admin` only.

**Helpers**

- `src/lib/scheduling/business-hours.ts` — pure functions: `isBusinessHour(date, cfg)`, `nextBusinessInstant(date, cfg)`, `addBusinessSeconds(from, seconds, cfg)`, `businessSecondsBetween(a, b, cfg)`. Used by every scheduler.
- Server fn `getBusinessHoursConfig` (cached 60s) + `updateBusinessHoursConfig` (super_admin).

**UI**

- **Settings → Business Hours** tab: edit window, days, holidays. Live preview: "Next fire at …".
- **Workspace shell rewrite** (`OrderWorkspacePage`): 3-column layout — left rail (Customer, Order meta), center (Journey Strip + Exception Banner + Contextual Action Panel + Email Thread), right (Tickets, Timeline, Documents). Replaces current `WorkspaceShell`.

## Phase 1 — Order Status Engine ✅

- ✅ `order_status_enum` (15 states) created; `applications.order_status` converted from text → enum, backfilled from `fulfillment_status`, defaults to `NEW_ORDER`.
- ✅ `delay_reasons` already seeded from Phase 0 (17 rows).
- ✅ SQL fns `allowed_order_transitions(from)` and `transition_order_status(order, new, reason, remarks, force)` — enforce transition map, log to `application_events`, `force=true` restricted to super_admin.
- ✅ Server fns in `src/lib/orders/order-status.functions.ts`: `transitionOrder`, `listAllowedTransitions`, `getDelayReasons`, plus `ORDER_STATUS_LABELS`.

## Phase 2 — Zoho SMTP + Email Registry ✅

- ✅ Zoho SMTP credentials already present (`ZOHO_SMTP_HOST/PORT/USER/PASS`, `ZOHO_FROM_NAME`).
- ✅ `zoho-smtp.server.ts` rewritten to auto-generate a stable `Message-ID`, stamp `In-Reply-To`, `References`, `X-BHS-Order`, `X-BHS-Customer`, `X-BHS-Template`, `X-BHS-Queue-Id` on every outbound.
- ✅ `email_logs` extended with `direction`, `message_id` (unique), `in_reply_to`, `references_header`, `zoho_mail_uid` (unique), `triggered_by`, `from_email`, `body_html`, `body_text`, `customer_id` + matching indexes for incoming-mail matching.
- ✅ `sendQueueRow` now looks up `customer_id`, forwards threading headers, and persists `message_id` + body into `email_logs`.
- ✅ BHS v2 template registry (E001–E012) in `src/lib/emails/bhs-templates.ts`, mapping to existing template codes + 5 new disabled system templates (`bhs_e003_customer_delay`, `bhs_e005_manual_reminder`, `bhs_e007_feedback`, `bhs_e010_ticket_autoclose`, `bhs_e012_submitted_to_govt`).
- ✅ E001 already auto-fires from PayU webhook via `order_confirmation` template.

## Phase 3 — Scheduler 2 (Customer-Side Delay, 24h business time)

- Table `order_schedulers` per PRD, with `remaining_seconds` (business-seconds), `paused_by_ticket_id`.
- Fire logic uses `addBusinessSeconds(started_at, 24*3600, cfg)` → stored as `fires_at` wall-clock. Recomputed on resume.
- New cron route `/api/public/cron/schedulers-tick` (every 1 min). Anon-key auth. Fires E004 + `→ CLOSED` when due.
- Pause/resume/cancel APIs used by ticket lifecycle.
- Employee action **"Customer Side Delay"** opens reason picker → sends E003 → starts scheduler.

## Phase 4 — Scheduler 3 (Our-Side Delay reminder engine)

- Table `order_reminders` per PRD.
- Same cron tick handles reminder firing during business hours only.
- Rules: 30-min grace to pick an option (business-time) → auto-start 2h reminders; 3 unattended reminders → `HIGH_PRIORITY`; manual reminder past due → notification + priority.
- Action panel exposes the 3 sub-options (Manual / Auto 2h / Stop-with-reason).

## Phase 5 — Employee Action Panel (Order Workspace)

Contextual panel that shows only the buttons legal for `order_status` (Part 7 of PRD):

- `Send/Resend Form Link` (E002), `Start Processing`, `Customer/Our Side Delay`, `Mark Submitted to Govt` (E012), `Upload Certificate`, `Complete Order` (E006 + docs purge), `Request Refund`, `Reopen Order`, `Close Order (manual)`.
- Each button → `transitionOrder` + email queue + scheduler side-effects, wrapped in a single server fn per action for atomicity.
- Refund actions gated to `super_admin` (`Approve`, `Reject`, `Mark Processed` → E011).

## Phase 6 — Zoho Incoming Mail (IMAP alternative)

Cloudflare Workers cannot open raw IMAP sockets, so the PRD's IMAP poller cannot run inside the app. Options:

- **A. Use Zoho Mail REST API** from a TSS cron route `/api/public/cron/poll-zoho-inbox` (every 2 min). Needs a one-time OAuth setup (`ZOHO_MAIL_CLIENT_ID/SECRET/REFRESH_TOKEN`). Recommended.
- **B. Deploy a single Supabase Edge Function `poll-zoho-inbox**` that uses IMAP libs; keep everything else in TSS. Simpler if OAuth setup is a blocker.

Either poller: dedupes by `zoho_mail_uid`, matches order via `In-Reply-To/References` → `email_logs.message_id`, else via `X-BHS-Order`, else by `from_email` + most-recent active order. Adds row to `email_logs (direction=incoming)`; opens/updates ticket; **pauses Scheduler 2** if active.

I'll ask which option before wiring credentials.

## Phase 7 — Support Tickets

- Extend `support_tickets` with `source`, `type`, `email_thread_id`, `auto_close_at`, `order_closure_paused`, `paused_scheduler_id`.
- Auto-ticket creators for 5 conditions (new email, contact form, complaint form, email reply, internal).
- Ticket detail: threaded replies (incoming + outgoing emails inline), 3 close buttons:
  1. Close – No Action (no email)
  2. Close with Reply (sends E008/E009 + arms 24h business-time auto-close → E010)
  3. Close and Restart Order (cancels Scheduler 2, order → `REOPENED`, resends E002 if needed)

## Phase 8 — Notifications

- Table `notifications` per PRD; RLS to owner.
- Emitters wired to the 10 events in Part 10.
- Bell UI in `AdminShell` top bar (unread count, panel, deep links). Realtime channel `user:<uid>:notifications`.

## Phase 9 — Journey UI polish + QA

- **Journey Strip** (6-stage happy path) + **Exception Banner** (Customer Hold / Our Delay / High Priority / Refund / Closed / Reopened) below it. Each stage shows timestamp; exception banner shows scheduler countdown in **business hours remaining** (e.g. "closes in 17h 32m business time").
- **Email Thread** panel — WhatsApp-style bubbles, direction-colored, template chip, expandable body, "Compose custom email" and "Send template" actions.
- End-to-end scripted tests via Playwright against localhost for the 6 PRD scenarios.

---

## Office-hours behavior summary


| Timer                                | Counts during          | Storage                                                                  |
| ------------------------------------ | ---------------------- | ------------------------------------------------------------------------ |
| Scheduler 2 — 24h closure            | Business hours only    | `remaining_seconds` in business-seconds; `fires_at` recomputed on resume |
| Scheduler 3 — 2h auto reminder       | Business hours only    | interval in business-seconds                                             |
| Scheduler 3 — 30-min grace           | Business hours only    | derived from `OUR_SIDE_DELAY` timestamp                                  |
| Ticket auto-close (24h post-reply)   | Business hours only    | `auto_close_at` recomputed                                               |
| Manual reminder (specific date/time) | Wall clock (as chosen) | as entered                                                               |


Super Admin edits window from **Settings → Business Hours**; changes apply to new firings; in-flight `remaining_seconds` are preserved.

## Delivery order & sizing

Phases 0–2 in the first build cycle (foundations + email spine). Then 3–5 (schedulers + action panel). Then 6–7 (incoming mail + tickets). Then 8–9 (notifications + polish). Each phase is shippable independently.

## Open decisions I need before starting Phase 6

- **Incoming mail transport**: Zoho Mail REST API 
- **Zoho SMTP credentials**: I will request them via the secret tool when Phase 2 starts.

Everything else follows the PRD verbatim.