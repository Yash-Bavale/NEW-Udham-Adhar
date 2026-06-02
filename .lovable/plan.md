
## Root cause

`processQueueInternal` in `src/lib/emails/emails.server.ts` calls `sendLovableEmail({ purpose: "transactional", ... })` without an `unsubscribe_token`. Lovable's API requires one for transactional emails and returns:

```
400 missing_unsubscribe — Transactional emails must include an unsubscribe_token
```

Every queued send retries 5× and lands in `dlq`.

## Fix (one file: `src/lib/emails/emails.server.ts`)

Inside the per-row loop, before calling `sendLovableEmail`:

1. Normalize recipient: `const recipient = row.to_email.toLowerCase().trim()`.
2. Look up an existing token in `email_unsubscribe_tokens` for `recipient` (filtering out already-used / unsubscribed rows).
3. If none, generate `crypto.randomUUID()` and `insert` a new row `{ email: recipient, token }`. Handle unique-constraint races by re-selecting.
4. Pass `unsubscribe_token: token` to `sendLovableEmail` alongside the existing fields.

This mirrors the logic in `src/routes/lovable/email/transactional/send.ts` (lines ~150–215) — one token per recipient, reused across sends. The system-appended unsubscribe footer in Lovable Emails uses this token, so no template changes are needed.

## Cleanup (optional, same edit)

- Reset the 3 stuck `dlq` rows in `email_queue` back to `queued` with `attempts = 0` and `next_attempt_at = now()` so they get re-processed after the fix — only if the user wants the old test sends retried (they look like SMTP test rows to typo'd addresses, so probably skip).

## What I will NOT change

- The scaffolded Lovable email infrastructure (`/lovable/email/transactional/send.ts`, `/lovable/email/queue/process.ts`) is correct and untouched.
- No DB schema or migration changes — `email_unsubscribe_tokens` already exists.
- No template, sender domain, or SMTP config changes.

## Verification

After the edit, enqueue a fresh test email (via the Emails admin "Send test" action or by triggering any flow that calls `enqueueEmailInternal`), then re-query `email_logs` — the next row should be `sent` with a real `message_id` in `smtp_response`.
