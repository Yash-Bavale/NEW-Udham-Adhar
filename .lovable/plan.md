## Root cause
The app is sending through Zoho SMTP using `nodemailer`. In this hosted runtime, that SMTP socket is being blocked/failing through the proxy, so every compliance/order email retries and fails with:

`[zoho] proxy request failed, cannot connect to the specified address`

## Fix plan
1. **Keep Zoho as the only sender**
   - Do not use Lovable Emails.
   - Send all outgoing app emails from `help@busiesshelpservices.com` through Zoho only.

2. **Replace failing SMTP with Zoho Mail HTTPS API**
   - Change `src/lib/emails/zoho-smtp.server.ts` from `nodemailer` SMTP to Zoho Mail REST API.
   - Reuse the existing Zoho OAuth secrets already configured in the project.
   - Use Zoho endpoint: `/api/accounts/{accountId}/messages`.
   - Keep current message threading headers, order IDs, customer IDs, and template IDs where Zoho allows custom headers/metadata.

3. **Preserve attachments for invoices/certificates**
   - Upload attachments to Zoho’s attachment endpoint first.
   - Send the returned Zoho attachment references in the email send request.
   - If Zoho rejects an attachment, log the exact Zoho response instead of the current generic proxy error.

4. **Update admin email UI wording**
   - Change dashboard/provider text from “Zoho Mail (SMTP)” to “Zoho Mail API”.
   - Keep the same dashboard/logs so staff can verify sent/failed emails.

5. **Retry affected compliance emails**
   - After code is fixed, reset recent failed/dead-letter rows whose error is the Zoho proxy failure back to queued so “Process queue now” can resend them.
   - Keep all retry attempts logged.

## Expected result
New emails will no longer use the blocked SMTP path, and old failed compliance/order emails can be retried through Zoho’s HTTPS API.