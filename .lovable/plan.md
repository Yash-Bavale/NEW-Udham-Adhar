## Goal

Stop using Lovable Emails. Send every CRM/transactional email through your Zoho Mail account (SMTP) and log every send (success/failure/bounce) so you can track delivery from inside the admin panel.

## What changes

### 1. Sending layer (server)

Replace the Lovable Email API call inside `src/lib/emails/emails.server.ts` with a Zoho SMTP sender.

- Add `nodemailer` (Worker-compatible build) using SMTP over TLS to `smtp.zoho.in:465` (or `smtppro.zoho.com:465` for Zoho Mail Pro / `smtp.zoho.com` for .com accounts).
- Read credentials from secrets (added via `add_secret`, never hardcoded):
  - `ZOHO_SMTP_HOST` (default `smtp.zoho.in`)
  - `ZOHO_SMTP_PORT` (default `465`)
  - `ZOHO_SMTP_USER` (full Zoho mailbox, e.g. `notify@businesshelpservices.com`)
  - `ZOHO_SMTP_PASS` (Zoho **App Password**, not the login password — generated from Zoho Account → Security → App Passwords)
  - `ZOHO_FROM_NAME` (display name, default "Udyam Registration Consultancy & Assistance Services")
- `from` header = `"<ZOHO_FROM_NAME>" <ZOHO_SMTP_USER>`. Reply-To stays `help@businesshelpservices.com`.
- Attachments (tax-invoice PDF) keep working — nodemailer supports them natively, so the existing invoice attachment flow is preserved.

### 2. Tracking layer

Every send writes a row to `email_send_log` (already exists) with: `message_id` (from SMTP response, e.g. `<xxx@businesshelpservices.com>`), `template_name`, `recipient_email`, `status` (`sent` / `failed`), `error_message`, `metadata` (order number, transaction id), `created_at`. The existing `email_queue` audit row is also updated to `sent` / `failed`.

Bounce / complaint tracking via SMTP is limited (no webhooks like Lovable/Resend). Two options I will wire:

- **Reply-path capture**: set SMTP `envelope.from` = `bounce+<message_id>@notify.businesshelpservices.com` so Zoho returns bounces to a mailbox we can poll (optional, off by default).
- **In-app dashboard**: query `email_send_log` deduplicated by `message_id` → status counts, per-template breakdown, per-recipient history, retry button for `failed` rows. Mounted at `/admin/emails` (super-admin + admin only).

### 3. Lovable Emails decommission

- Keep the `email_queue` table and templates — only the *delivery* path changes.
- Remove the `fetch('https://...lovable.app/api/email')` call site.
- Do NOT call `email_domain--toggle_project_emails`; we leave it as-is so Supabase auth emails (password reset / OTP) keep working through their default path. If you'd rather also route Supabase auth emails through Zoho SMTP, say so and I'll configure Supabase Auth → SMTP with the same Zoho credentials.

### 4. Admin dashboard — `/admin/emails`

- KPI cards: Sent (24h / 7d / 30d), Failed, Suppressed, Success rate.
- Filters: date range, template, status, recipient search.
- Table (paginated, 50/page): Template • Recipient • Status badge • Sent at (IST) • Error • Resend button.
- Detail drawer: full HTML preview, raw SMTP response, headers, attachment list, related order link.
- All queries deduped on `message_id` per the email dashboard guide.

### 5. Retry / queue behavior

- Immediate send stays the default (per your earlier preference).
- On SMTP failure → row marked `failed`, automatic retry up to 3× with exponential backoff (1m / 5m / 30m) via existing cron route.
- After 3 failures → `dlq` + super-admin notification.

## Secrets you'll need to provide

After approving, I'll trigger a secure form for:

1. `ZOHO_SMTP_USER` — the Zoho mailbox you want to send from
2. `ZOHO_SMTP_PASS` — Zoho **App Password** (Zoho → My Account → Security → App Passwords → Generate)

Host/port/from-name have safe defaults; override only if you use Zoho Mail Pro / a different region.

## Files touched

- `src/lib/emails/emails.server.ts` — swap delivery to nodemailer/Zoho SMTP, write to `email_send_log`.
- `src/lib/emails/zoho-smtp.server.ts` — new helper (transporter, retry, logging).
- `src/routes/admin.emails.tsx` — new tracking dashboard.
- `src/components/admin/EmailLogTable.tsx`, `EmailDetailDrawer.tsx` — UI.
- `src/routes/api/public/cron/email-retry.ts` — retry sweeper (every 5 min).
- Sidebar: add "Email Logs" under the existing admin section.
- `package.json` — add `nodemailer` + `@types/nodemailer`.

## Out of scope (ask if you want these too)

- Routing Supabase **auth** emails (password reset / magic link) through Zoho SMTP.
- Inbound bounce-mailbox polling.
- Open / click tracking pixels (Zoho SMTP doesn't expose these natively; would need a tracking redirect service).