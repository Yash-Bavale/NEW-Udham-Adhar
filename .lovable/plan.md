## Evidence found
- Order `AP-2026-006601` is marked `completed` and has `certificate_number = UDYAM_EX` saved.
- A certificate row exists for the order, but `delivered_at` is still empty.
- No `certificate_delivery` row exists in the email queue or email send log for this completion attempt.
- The activity log says “queued to customer”, but the code catches and hides the certificate email failure, so the UI gives a false success message.

## Plan
1. **Stop hiding certificate email failures**
   - In the completion flow, if certificate email creation/sending fails, return a real error to the UI instead of logging silently.
   - Change the success note from “queued” to “sent” only after the email helper actually creates/sends the row.

2. **Use one certificate delivery path everywhere**
   - Update the separate Certificates page “Deliver” action to use the same immediate Zoho email helper as the order completion flow.
   - Keep the audit row, certificate attachment, and 7-day signed download link.
   - Mark `certificates.delivered_at` when the send succeeds.

3. **Mark completion certificate as delivered after successful send**
   - When order completion sends the certificate email successfully, update the new certificate row with `delivered_at`.
   - This fixes the Certificates page showing the certificate as still pending after completion.

4. **Add better UI feedback**
   - The completion dialog/toast will show that the certificate email was sent, not just that the order moved stage.
   - If email fails, the order will not pretend delivery happened; staff will see the exact error.

5. **Verify with the affected order**
   - After changes, resend the certificate for `AP-2026-006601` using the existing resend path or the certificate deliver action.
   - Confirm a `certificate_delivery` send log appears and the certificate row gets `delivered_at`.