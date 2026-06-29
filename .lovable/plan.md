# Cancellation Closure — Reliability & Audit Fixes

## Current behaviour (verified)
- Cron `closure-workflow-hourly` runs every hour, picks up rows where `closure_next_at <= now()` and advances `request_received → closed`, `concern_reply_sent → final_ticket_closed`, `refund_reviewed → closed`. Templates exist, are enabled, and Step 2 confirmation has been observed delivering to a real customer (AP-2026-006623).
- Staff-initiated steps (`requestCancellation`, `sendConcernReply`, `sendRefundDecision`, `acknowledgePostClosure`) write to `activity_logs`.

## Problems found
1. AP-2026-006623's Step 1 email is stuck at `email_queue.status='sending'` (403 `no_matching_sender` from before the Zoho sender fix). The queue worker only picks up `pending`, so this row will never retry — customer never received Step 1.
2. `requestCancellation` and the cron loop catch email errors and still advance `closure_stage`. A failed send produces a silent gap in the customer's email trail.
3. The cron does not write `activity_logs` or `workflow_events` when it advances a stage or marks an order cancelled. There is no audit record of the automated step.
4. No visibility in the admin UI that an email in the cancellation chain failed.

## Changes

### 1. Resurrect stuck Step 1 sends
- One-off SQL: requeue rows where `template_code LIKE 'cancel-%' AND status='sending' AND sent_at IS NULL AND created_at < now() - interval '15 minutes'` by setting `status='pending'`, clearing `last_error`, incrementing `attempts`.
- Add a guard in the email worker (or a tiny cron) to auto-recover `sending` rows older than 15 minutes back to `pending` once, so this can't strand again.

### 2. Gate Step 1 on successful enqueue
- In `src/lib/crm/cancellation.functions.ts` → `requestCancellation`: send Step 1 with `requireImmediateSuccess: true` (same flag added during the certificate fix). On failure: do NOT set `closure_stage='request_received'`, surface the error to staff, and log an `activity_logs` entry "Step 1 email failed — cancellation not started".

### 3. Make the cron auditable and email-safe
- In `src/routes/api/public/cron/closure-workflow.ts`:
  - Send each transition email with `requireImmediateSuccess: true`. If it throws, skip the stage update for that row, push `failed++`, and `console.error` with `application_code`.
  - After a successful advance, insert:
    - `activity_logs` row (`activity_type='cancellation_auto_advanced'`, description naming old→new stage).
    - `workflow_events` row (`event_type='closure_auto_advanced'`, `is_system=true`, metadata with stages and template code) so the customer timeline shows it.
  - For `request_received → closed`, also record `application_status` change in `application_events` (the existing trigger handles `fulfillment_status`; confirm `application_status='cancelled'` is captured — add explicit insert if not).

### 4. Admin visibility
- `CancellationPanel.tsx`: surface "Last cancellation email" status (sent/failed/pending) by querying `email_queue` filtered to `template_code LIKE 'cancel-%'` for the application. Show a red banner + "Resend" button when the latest row is `failed` or stuck `sending > 15m`.

## Technical notes
- `requireImmediateSuccess` already exists on `enqueueEmailInternal` (`src/lib/emails/emails.server.ts`); `enqueueFromTemplateInternal` needs to accept and forward it.
- Cron auth already verified against `SUPABASE_PUBLISHABLE_KEY` — no changes there.
- No schema migration needed; all writes target existing tables (`activity_logs`, `workflow_events`, `application_events`).

## Out of scope
- Redesigning the 13-reason policy library or the cancellation UI flow.
- Adding new email templates (existing 7 cover all stages per the spec you sent).
