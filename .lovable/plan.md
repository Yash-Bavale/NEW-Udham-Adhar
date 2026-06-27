## Issues

1. **All emails failing with `400 missing_parameter: text`**
   `src/lib/emails/emails.server.ts` sends `text: row.body_text ?? ""` to Lovable's email API. The API now rejects empty strings as a missing parameter, so every queued email (incl. the certificate delivery email) fails with this 400.

2. **Certificate delivery email not arriving**
   Same root cause — `deliverCertificate` / `resendOrderCertificate` enqueue with HTML only, no `body_text`, so the send call ships `text: ""` and is rejected.

3. **Lead list service column shows the wrong / truncated label**
   For the "Udyam Registration Certificate Download" service, the leads table cell is `max-w-[200px] truncate` (`src/routes/admin.leads.index.tsx:403`) which clips it to "Udyam Registration Certificat…". User wants the full, correct service name visible.

## Fix

### 1. Always send a non-empty `text` to Lovable email API
In `src/lib/emails/emails.server.ts`:
- Add a tiny `htmlToPlainText(html)` helper (strip `<style>/<script>`, unwrap tags, decode common entities, collapse whitespace, trim).
- Build `text` as: `row.body_text?.trim() || htmlToPlainText(row.body_html) || row.subject || " "` so it is never an empty string.
- Apply for both the attachments branch (`fetch /v1/messaging/email/send`) and the no-attachments branch (`sendLovableEmail`).

This single change unblocks:
- Order confirmation / payment success emails
- Certificate delivery + resend emails (they reuse the same queue → sender path)
- Talk-to-Expert payment-link emails
- All workflow / delay / closure emails

### 2. Verify certificate delivery
No code change beyond #1 — `deliverCertificate` and `resendOrderCertificate` already attach the file and enqueue. Once the 400 is gone they will go out. After deploy, re-test by hitting "Resend" on a delivered certificate and confirm `email_queue.status = 'sent'` and the recipient receives the PDF.

### 3. Show full service name in leads table
In `src/routes/admin.leads.index.tsx` (line ~403), remove the hard `max-w-[200px] truncate` on the Service `<td>` and let it wrap (or widen to `max-w-[260px]` with `break-words`, no truncation) so "Udyam Registration Certificate Download" and "Talk to Expert – Suitable Service Selection" render in full. No data-layer change — `leads.service` already stores the correct label from `SERVICES` in `src/lib/constants.ts`.

## Verification

- `psql` check `email_queue` after a manual resend → `status='sent'`, `last_error` null.
- Open `/admin/certificates`, click **Resend** on a delivered row → toast success, row in `email_logs`, customer inbox receives PDF.
- Open `/admin/leads` → confirm the certificate-download and talk-to-expert rows now show the full service label.

No other behavior, schema, or UI changes.