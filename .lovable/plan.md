## What's actually happening (not a bug — diagnostic first)

The page in your screenshot is **correct**. Here's why:

**Database state for `UA-2026-001021` right now:**

| Field | Value |
|---|---|
| `leads.status` | `new_lead` |
| Latest `payments` row | status `created` (PayU order initiated **but never completed**) |
| `invoices` for this lead | none |

You see `Proceed to Payment` because **no payment is confirmed** for this lead in the DB. The previous live PayU attempt at 13:28 created an order but PayU never posted back a `success` to our webhook → so we correctly stay on the payment page.

There is no "showing UI for confirmed payments" bug — it's showing the payment UI because **the payment is genuinely unconfirmed**.

## Current end-to-end flow (verified by reading the code)

```text
[Lead form submit]
   └─> /payment/$leadCode  (payment.$leadCode.tsx)
         • Calls createPayUOrder server fn
         • Creates `payments` row (status='created')
         • Auto-submits hidden form to PayU (test or live URL by PAYU_MODE)

[User pays on PayU]
   └─> PayU POSTs result to /api/public/webhooks/payu
         • Verifies sha512 response hash
         • Updates payments.status → 'paid' / 'failed' / 'attempted'
         • On 'paid':
              - leads.status = 'payment_successful'
              - applications.application_status = 'payment_received'
              - generateInvoiceInternal(payment.id)
              - 303 redirect → /success/$leadCode  (for browser-return)
         • On 'failed': 303 → /payment-pending/$leadCode

[/success/$leadCode]
   • Polls getApplicationSummary up to 6× / 2s
   • If still not paid after 12s → bounces back to /payment/$leadCode
   • CTA → /onboarding/$leadCode

[/onboarding/$leadCode]   (Aadhaar + business info)
   └─> /onboarding/$leadCode/documents   (PAN, photo, etc.)
         └─> /onboarding/$leadCode/done  (sets lead → 'under_process')
```

## Likely root cause of the "abandoned" PayU attempt

`PAYU_MODE=live` is set, so we now POST to `https://secure.payu.in/_payment`. If `PAYU_MERCHANT_KEY` / `PAYU_MERCHANT_SALT` are still **test credentials**, the live endpoint rejects the request and the user never reaches a paying screen → no webhook → lead stays `new_lead`. We need to verify the live key/salt actually correspond to a live PayU account, otherwise this is a config issue not a code bug.

## Bugs / weak spots found while tracing the flow

1. **`success` page bounce-back race**: If PayU's S2S webhook is delayed >12s the user is sent back to `/payment/$leadCode` even when their card was actually charged. Fix: poll longer (e.g. 30s) and on timeout send to `/payment-pending/$leadCode` (it's pending, not "needs to pay again").
2. **`PAYU_MODE` default is `live`** in code. Safer to default `test` and only flip when explicitly set, so a missing env var can never accidentally hit live.
3. **No email confirmation today** after successful payment. We don't send the customer their invoice or a welcome / onboarding-link email anywhere.
4. **No reminder** if a user pays but never finishes `/onboarding/$leadCode`. There's no scheduled job or trigger that emails them their dynamic onboarding link + invoice + welcome.
5. **Email infrastructure not initialised**: `src/lib/email-templates/registry.ts` is empty, no `send-transactional-email` route, no queue tables. We need to scaffold it before we can send anything.
6. **`success` page receipt is hidden in dev**: `(showReceipt || typeof window !== 'undefined')` always evaluates true client-side, so the receipt block is rendered with `hidden` toggling — minor, but worth cleaning up to plain `showReceipt`.

## Plan (in order)

### Step 1 — Verify config (no code change)
Confirm with you that `PAYU_MERCHANT_KEY` / `PAYU_MERCHANT_SALT` are the **live PayU dashboard** credentials, not test. If they are still test creds, switch `PAYU_MODE` back to `test` until live keys are issued. Without this, no live payment will ever succeed regardless of code fixes.

### Step 2 — Reset the stale `created` PayU order
Delete the stuck `created` payment row + idempotency key for `UA-2026-001021` so a fresh ₹1 live test can be made cleanly.

### Step 3 — Harden the post-payment UX
- `success.$leadCode.tsx`: increase poll window to ~30s, on timeout route to `/payment-pending/$leadCode` instead of `/payment/$leadCode`.
- Default `PAYU_MODE` to `test` in `payu.server.ts`.
- Clean up the `typeof window !== 'undefined'` receipt-render quirk.

### Step 4 — Set up email infrastructure (Lovable Cloud)
Scaffold the transactional-email pipeline (queues, `send-transactional-email` route, suppression, unsubscribe page) since none of it exists yet. This is a prerequisite for any email in steps 5–6.

### Step 5 — Build 3 email templates and wire triggers
1. **`payment-receipt-welcome`** — sent from the PayU webhook on successful `paid`. Contains: greeting, payment receipt, tax invoice download link, and a CTA "Complete your onboarding" → `/onboarding/$leadCode`.
2. **`onboarding-link`** — same onboarding CTA, lighter content, used by the reminder job.
3. **`application-submitted`** — sent from `onboarding/$leadCode/done` on `under_process`.

### Step 6 — Abandoned-onboarding reminder
Create a `/api/public/cron/onboarding-reminders` route + pg_cron job that runs every hour and, for any lead with `status='payment_successful'` whose onboarding submission is missing/incomplete and last reminded > 24h ago, enqueues the `onboarding-link` email. Track `last_reminded_at` / `reminder_count` on the lead (max 3 reminders, then stop).

### Step 7 — End-to-end retest
With live creds (or test mode if creds aren't live yet): submit lead → pay ₹1 → confirm webhook flips lead/application/invoice → confirm receipt email arrives → finish onboarding → confirm submission email arrives. Then separately reset onboarding to test the reminder by manually invoking the cron route.

## Technical notes

- Step 4 uses `email_domain--setup_email_infra` then `email_domain--scaffold_transactional_email`. I'll verify the email domain status first; if none is set, I'll surface the domain setup dialog.
- All emails will go through Lovable Cloud's queue (auth_emails / transactional_emails), no third-party provider.
- Reminder cron uses a service-role call to `/api/public/cron/onboarding-reminders` guarded by an HMAC secret header so it can't be triggered by anyone hitting the URL.
- Schema add: `leads.onboarding_reminded_at TIMESTAMPTZ`, `leads.onboarding_reminder_count INT DEFAULT 0` (migration, with GRANTs untouched on existing table).

Want me to confirm the PayU live credentials assumption with you, or just proceed with Steps 2–7 assuming whatever creds are in the secrets are correct?
