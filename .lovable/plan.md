## Plan — Order Delay Workflow, Notifications, Email Thread, Dashboard Duplicates

This is a large multi-part request. Splitting into shippable pieces so nothing breaks half-way.

---

### 1. Our-Side Delay → email customer + employee follow-up loop

**Email**
- Send E005 (`bhs_e005_processing_update` / our-side delay template) to the customer immediately when "Our Side Delay" is chosen. Today we skip customer email on internal side — will remove that skip.
- Log to `email_logs` linked to the application so it shows in the Email Thread.

**Reminder options UI** (new panel in `ExternalDelayDialog` / `OrderActionRail` after internal-side delay is set):
- Manual reminder (date+time picker) → writes `workflow_reminders` row (kind = `internal_review`, fire_at = picked time).
- Auto every 2 hours → writes recurring `workflow_reminders` (kind = `internal_recurring`, interval_seconds = 7200).
- Stop reminders (reason required) → cancels reminders, logs `application_events` `reminder_stopped` with reason.
- If nothing chosen within 30 min → cron auto-starts 2h loop, flips `order_status → HIGH_PRIORITY`, notifies super_admin.

**Escalation rules** (cron in `workflow-reminders.ts`):
- Manual: on fire → notify assignee; if still `OUR_SIDE_DELAY` past fire time → flip to `HIGH_PRIORITY`.
- Auto 2h: each fire notifies assignee; after 3 consecutive fires with no action (`last_action_at` unchanged) → `HIGH_PRIORITY` + notify super_admins.
- Stop conditions: order becomes `COMPLETED` / `REFUND_REQUESTED` / `CLOSED`, or employee stops with reason.

Schema additions (`workflow_reminders`):
- `interval_seconds int null`, `consecutive_fires int default 0`, `last_action_at timestamptz`, `stop_reason text`.
- Extend `workflow_reminder_kind` enum: `internal_recurring`, `internal_manual`.

---

### 2. Notification system + sound

- Wire `useNotifications` hook (already exists) into `AdminShell` topbar with unread badge + dropdown list, mark-read, mark-all-read (server fns already exist).
- Realtime subscribe via `useRealtimeTable('notifications', ..., filter=user_id=eq.<uid>)` — refetch on insert.
- On new notification: play a soft chime (`/notification.mp3` placed in `public/`) once, throttled 1/sec. Two-tone: bell for `priority=high` (HIGH_PRIORITY / overdue / super_admin escalations), chime for normal.
- Add mute toggle stored in `localStorage` (`bhs.notif.muted`).
- New order → notification to lead assignee + team leads. Priority order flip → notification to assignee + super_admins. Follow-up due → notification to owner.

---

### 3. Orders list highlights

In `admin.orders.tsx` list rows, add a left color bar + tag pill computed from `order_status`:
- `NEW_ORDER` — blue "New"
- `WAITING_CUSTOMER_INFO` / `INFO_RECEIVED` — amber "Pending"
- `IN_PROCESSING` / `SUBMITTED_TO_GOVT` — violet "Working"
- `HIGH_PRIORITY` — red pulsing "Priority"
- `CUSTOMER_HOLD` / `OUR_SIDE_DELAY` — orange "On Hold"
- `COMPLETED` — emerald "Done"

Add filter chips at top: All · New · Working · Pending · Priority · Follow-ups.

---

### 4. Email Thread on Order Workspace (WhatsApp-style)

New component `OrderEmailThread.tsx` shown as a tab/section in `WorkspaceShell`:
- Fetches `email_logs` (outgoing) + `inbound_email_quarantine` matched to order/customer, ordered by time asc.
- Each bubble: direction badge, template code (if any), timestamp, subject, first 100 chars, expand → full HTML preview iframe, Resend button (outgoing only, calls existing `resendEmail` fn).
- Outgoing = right-aligned, brand navy border. Incoming = left-aligned, green border + 📥.
- Footer: **Compose Custom Email** (dialog: subject + rich text → server fn sends via existing SMTP + writes `email_logs` with `template_code=null, source='manual'`) and **Send Template Email** dropdown (existing templates for this stage).

Server: reuse `emails.functions.ts` — add `listOrderEmailThread({orderId})` merging outgoing+incoming and `sendCustomOrderEmail({orderId, subject, html})`.

---

### 5. Executive Dashboard — duplicate leads count

- Add `duplicateLeads` metric in `get_dashboard_metrics()` SQL function:
  ```
  (SELECT count(*) - count(DISTINCT COALESCE(lower(email), regexp_replace(mobile,'\D','','g')))
     FROM leads WHERE email IS NOT NULL OR mobile IS NOT NULL)
  ```
- Render a KPI card "Duplicate Leads" on `SuperAdminDashboard` next to Total/Today/Week.

---

### 6. Super admin — view employee current password

**Security note (must read):** Passwords in Supabase Auth are stored as one-way bcrypt hashes. The plaintext is not stored anywhere and cannot be retrieved by anyone — not even the database owner. So a literal "see current password" for employees is impossible.

Two feasible alternatives — pick one:
- **A. "Reset & reveal" flow** — super_admin clicks "Show password", a new random password is generated, `supabaseAdmin.auth.admin.updateUserById()` sets it, plaintext shown once in a modal + copy button, event logged to `audit_log`. Employee will need to use the new password.
- **B. "Send reset link"** — super_admin triggers a Supabase password-recovery email to the employee. No plaintext exposure.

I'll implement **A** by default (matches intent) with a red "This will change the employee's password" confirmation, unless you want B instead.

---

### Order of delivery

1. Migration: reminder columns + enum values + `duplicate_leads` metric.
2. Backend: delay email to customer, reminder scheduler logic, custom email fn, thread fn, admin reset-password fn.
3. Frontend: reminder panel, notifications topbar + sound, orders highlights + filter chips, EmailThread component, dashboard KPI, users password action.

Roughly 10–14 file edits + 1 migration. I'll ship it in that order and verify build after each backend + frontend batch.

---

**Two things I need from you before I start coding:**
1. Password feature — **A (reset & reveal)** or **B (send reset link)**?
2. Notification sound — I'll drop a soft chime in `public/notification.mp3`. Any preference (bell / chime / ding) or ok with default?
