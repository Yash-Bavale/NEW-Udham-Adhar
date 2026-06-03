## Goal

1. Stop sending the customer acknowledgment email on complaint submission.
2. Route admin/internal notifications (both complaint form **and** contact form) to a private internal email address that is **not hardcoded** in the codebase.
3. Default it to `vinoddaware28@gmail.com` but keep the value private so it can be changed later without a code edit.

## Approach

Store the internal recipient as a server secret named `INTERNAL_NOTIFICATION_EMAIL`. Server code reads it from `process.env` at request time. If unset, it falls back to `vinoddaware28@gmail.com`. The literal email never appears in committed source except as a last-resort fallback constant — and even that can be removed later by simply setting the secret.

I'll also retire the old hardcoded `help@businesshelpservices.com` fallback in the two public endpoints so all internal notifications consistently use the new secret-driven recipient.

## Changes

### 1. Add secret
- Add secret `INTERNAL_NOTIFICATION_EMAIL` via the secrets tool. User enters `vinoddaware28@gmail.com` (or any future address) in the secure form.

### 2. `src/routes/api/public/complaint.ts`
- Remove the `enqueueFromTemplateInternal("complaint_submitted", ...)` call (customer ack).
- Replace `DEFAULT_ADMIN_EMAIL` + `smtp.reply_to` lookup with:
  ```ts
  const adminTo = process.env.INTERNAL_NOTIFICATION_EMAIL || "vinoddaware28@gmail.com";
  ```
- Keep the internal admin HTML notification (`enqueueEmailInternal`) pointed at `adminTo`.
- Drop the now-unused `smtp_settings` query and `enqueueFromTemplateInternal` import.

### 3. `src/routes/api/public/contact.ts`
- Same recipient logic: read `process.env.INTERNAL_NOTIFICATION_EMAIL` with the same fallback.
- Keep existing customer-facing template flow as-is (user only asked to change complaint customer ack). Internal admin notification recipient switches to the new secret.

### 4. Leave untouched
- `src/lib/onboarding/onboarding.functions.ts` — separate flow, not in scope of this request.
- Email templates, queue worker, admin Emails settings page.

## Notes
- Response payload to the frontend stays the same (`{ ok, complaintNumber }`), so the existing complaint form UI keeps working with no client changes.
- Because the value lives in env, the user can later change it in Settings → Secrets without redeploying code.
