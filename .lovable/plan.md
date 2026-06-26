## Current behaviour — closure / "document sent" email

When an order is moved to **Completed** via the Completion Gate (`updateFulfillmentStatus` in `src/lib/crm/orders-v2.functions.ts`):

1. The uploaded certificate is stored in the `documents` storage bucket and a row is written to `certificates`.
2. The application transitions to `completed`, `lead_status_v2` becomes `closed`, and an `application_completed` event is logged.
3. A `certificate_delivery` email row is inserted into `email_queue` with:
   - Customer's primary email (falls back to lead email)
   - HTML body via `buildCertificateEmailHtml(...)`
   - A **7-day signed download URL** placed inside the body as a "Download Certificate" button
4. The shared poller in `src/lib/emails/emails.server.ts` picks up the queue row every cycle and sends through Mailgun.

`resendOrderCertificate` and the legacy `deliverCertificate` follow the same shape.

### Verdict

- **Email is delivered** to the customer (subject to suppression/bounce) — the queue + poller path is the same one used for invoices, which we already verified is working.
- **PDF/JPG is NOT attached** to the email. None of the three closure paths set `variables.__attachments`, which is the only field the sender reads to attach files. The customer only gets a signed link valid 7 days.

So "delivered with attachment" today = **No** — only a link.

## What this plan changes

Make the certificate file ride the email as a real attachment, on top of the existing signed-link button.

### Files to edit

1. `src/lib/crm/orders-v2.functions.ts`
   - In `updateFulfillmentStatus` (completion branch) and `resendOrderCertificate`:
     - After we resolve `certDoc.file_path`, download the file bytes via `admin.storage.from("documents").download(filePath)`.
     - Convert to base64 (Buffer-safe, server runtime).
     - Skip attaching only if size > 9 MB (Mailgun + provider safety margin); otherwise always attach.
     - When inserting into `email_queue`, add to the `variables` object:
       ```
       __attachments: [{
         filename: `${certificate_number || application_code}.pdf|.jpg|.png`,
         content_type: certDoc.mime_type,
         content_base64: <base64>,
       }]
       ```
     - Keep the signed URL in the body as a backup.

2. `src/lib/crm/certificates.functions.ts` (`deliverCertificate`)
   - Same pattern so the legacy "Deliver" button on `/admin/certificates` also attaches the file.

3. No DB migration, no new packages, no template changes required — `emails.server.ts` already reads `__attachments` from `variables` and POSTs them to Mailgun (`src/lib/emails/emails.server.ts` lines 191-228).

### Safety checks

- If the file download fails, fall back to the current link-only email (do not block completion).
- Log `[certificate] attachment skipped: <reason>` so we can see it in server logs.
- File size guard (~9 MB) to avoid Mailgun's 25 MB hard limit being approached after base64 inflation.

### Verification after build mode

- Use Playwright on the running app to: open a completed order, click "Resend certificate", then read `email_send_log` for the new row and confirm the attached row in Mailgun (or inspect the queue row's `variables.__attachments` length to confirm it was set).
- Manually check one real recipient inbox if the user provides a test address.
