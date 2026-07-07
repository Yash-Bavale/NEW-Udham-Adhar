## What is the right way

Use Zoho Mail HTTPS API only, not SMTP and not Lovable email. SMTP is what caused the proxy error. The remaining blocker is now Zoho OAuth/provider access: Zoho returned `Access Denied / too many requests` and then `invalid_client`, which means the saved OAuth client/refresh token is either temporarily throttled, wrong for the Zoho data center, revoked, or not authorized for the mailbox.

## What I need from you

After you approve this plan, I will open a secure credentials form if needed. Do not paste secrets in chat.

Please be ready with fresh Zoho OAuth credentials for the exact mailbox that sends mail:

- Sender mailbox: `help@businesshelpservices.com` — confirm this exact spelling is correct.
- Zoho data center: likely `in` unless your Zoho account was created elsewhere.
- OAuth client ID.
- OAuth client secret.
- Refresh token generated with Zoho Mail scope: `ZohoMail.messages.CREATE` or `ZohoMail.messages.ALL`.
- Numeric Zoho Mail account ID for that mailbox, if available.

## Recovery plan

1. **Stop further damage first**
   - Keep the queue paused/deferred so Zoho is not hammered every minute.
   - Keep all failed compliance/order emails in the queue; do not delete them.

2. **Lock sending to Zoho Mail API**
   - Keep SMTP removed from the app send path.
   - Send from the confirmed `help@businesshelpservices.com` mailbox only.
   - Keep Lovable email disabled/not used for these business emails.

3. **Replace or verify Zoho credentials**
   - If the current OAuth credentials still return `invalid_client`, use fresh Zoho credentials through the secure secret form.
   - Set the correct Zoho data center and account ID so the app does not try the wrong Zoho host.

4. **Test safely with one email**
   - Requeue only one failed email first.
   - Process one queue item manually.
   - Confirm it logs as sent and appears in Zoho Sent Mail before touching the full backlog.

5. **Release the backlog gradually**
   - Requeue failed compliance/order/ticket emails in small batches.
   - Stop immediately if Zoho returns auth/rate-limit errors again.
   - Keep attempts/logs preserved for compliance evidence.

6. **Publish the fixed app**
   - The backend cron currently calls the published app URL, so preview fixes will not affect the live cron until you publish.
   - After publish, verify the cron is using the fixed Zoho API sender.

## Technical details

- The original error was from SMTP/proxy connectivity.
- The next Zoho API error was an invalid payload field; that code path is fixed in preview.
- The current blocker is OAuth/provider authorization, not SMTP.
- The cron uses the published app endpoint, so publishing is required after code approval.

## Success check

- One test email is accepted by Zoho Mail API.
- `email_queue` row becomes `sent`.
- `email_logs` shows `[zoho] ... accepted/sent`, not proxy or invalid-client errors.
- Then and only then, requeue the rest of the failed business-critical emails.