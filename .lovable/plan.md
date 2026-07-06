# Fix: Incoming email replies never fetched → no tickets, no threads

## Root cause

The polling endpoint `/api/public/cron/poll-zoho-inbox` exists and is coded correctly, and all Zoho credentials (`ZOHO_MAIL_ACCOUNT_ID`, `ZOHO_MAIL_CLIENT_ID/SECRET`, `ZOHO_MAIL_REFRESH_TOKEN`) are configured — but **no pg_cron job is scheduled to call it**. A query of `cron.job` returns zero rows matching poll/inbox/zoho (and effectively nothing app-owned). Confirmed side effects:

- `email_logs` has 0 rows with `direction='incoming'`
- `inbound_email_quarantine` is empty
- Your reply to `bhs.1783330512659.gygvopxp@businesshelpservices.com` (an outbound thread to `help@businesshelpservices.com`) is sitting in the Zoho mailbox unread by the app

Outbound `From` = `help@businesshelpservices.com`, which is the polled Zoho account, so once polling runs, matching by `In-Reply-To` → `email_logs.message_id` (`<bhs.1783330512659…>`) will attach the reply to order `AP-2026-006921` and open/append a support ticket automatically.

## Fix

1. **Schedule pg_cron** (migration) to POST every 2 minutes to the stable prod URL:
   ```
   https://udyamadhar-backend-128-654-90-mumbai-india.lovable.app/api/public/cron/poll-zoho-inbox
   ```
   Headers: `apikey: <CRON_SECRET>`, `Content-Type: application/json`. Job name: `poll-zoho-inbox`. Store the secret in Vault (`cron_secret`) and read via `vault.decrypted_secrets` inside the cron command, matching the pattern used by the existing email-queue cron. Ensure `pg_cron` + `pg_net` extensions are enabled (they already are, since the email queue cron uses them).

2. **Kick a one-shot manual poll** right after the cron is created so your existing reply is ingested this turn (via `curl` from the sandbox with the `CRON_SECRET`). Then verify:
   - a row appears in `email_logs` with `direction='incoming'`, matching `message_id`, and non-null `application_id` for AP-2026-006921
   - a `support_tickets` row (or reply appended to the existing one for that order) shows up, sourced from `email_inbound`
   - the order's active Scheduler-2 (customer closure) is paused

3. **No code changes** to the poll route, matcher, or ticket UI — the pipeline is already correct; it just isn't being triggered.

## Out of scope

- Reworking the ticket UI, quarantine review UI, or email thread renderer.
- Migrating polling to Zoho push webhooks (future enhancement).
