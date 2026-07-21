
## Heads-up on the E002 upload

The file `E002-incomplete-information-link-mail-2.html` you attached actually contains Jest test code (`describe("activeBranchesFor", …)`), not the E002 HTML. I can't update E002 without the real HTML — please re-upload the correct file and I'll apply it in the same pass. The rest of the plan below proceeds regardless.

## What's wrong today

1. **B06 "Consultation Completed" does NOT send any email.** In `CustomerJourneyMap.tsx` the `mutConsultation` handler only calls `updateFulfillmentStatus` — the comment says "skip the E005 resubmit email so we don't double-notify". That's why no mail goes out when Consultation Completed is clicked. You now want B06 to send E005 with an operator-entered **Note / Employee Remarks** merged in.
2. **E005 template** in the DB has no `{{employee_remarks}}` placeholder — the new HTML you uploaded adds it as a "Note" row in the Order Summary and `{{executive_name}}` in the sign-off.

## Changes

### 1. Update E005 template (DB)
- Migration replaces `email_templates.body_html` for `code = 'E005'` with the exact HTML from `E005-consultation-completed-application-submitted-govt-portal.html`.
- Subject → `Your Order {{order_number}} Has Been Completed`.
- Ensure the placeholder list on that row includes: `customer_name`, `order_number`, `service_name`, `closure_date`, `customer_email`, `customer_mobile`, `employee_remarks`, `executive_name`.

### 2. Update E002 template (DB) — pending correct upload
- Same migration pattern, once you re-upload the real HTML. Placeholders will match whatever `{{…}}` tokens are in that file.

### 3. Add "Consultation Note" dialog for B06
- New small dialog in `CustomerJourneyMap.tsx` (same pattern as the customer-delay / tech-delay dialogs), triggered by B06 instead of firing the mutation directly.
- Fields: single `Textarea` labelled "Note to customer (appears in the email)", optional, max 1000 chars.
- Submit runs a new server fn `markConsultationCompleted({ orderId, remarks })` that:
  - Calls `transition_order_status` → `consultation_completed` fulfillment stage (same as today).
  - Enqueues `BHS_EMAILS.E005_CONSULTATION_SUBMITTED` via `enqueueFromTemplateInternal` with variables `{ customerName, orderNumber, serviceName, closureDate (IST), customerEmail, customerMobile, employeeRemarks: remarks || '—', executiveName: current-user display name }`.
- Toast: "S08 · Consultation Completed — E005 sent".

### 4. Wire location
- New server fn lives in `src/lib/orders/actions/consultation.functions.ts` and is re-exported from `src/lib/orders/actions/index.ts`.
- `CustomerJourneyMap.tsx` gets:
  - `dialog?.kind === "consultation_completed"` branch,
  - `mutConsultation` refactored to accept `{ remarks }`,
  - B06 handler → `setDialog({ kind: "consultation_completed" })`.

### 5. Sanity pass on the rest of the button→email map (no behaviour change unless broken)
While in the file I'll verify each of B01/B02/B03/B04/B05/B07/B08 actually enqueues its documented template (E002/E003/E011/E004/E005/E007/E008) end-to-end — if any silently skip the email like B06 did, I'll flag them back to you in the reply with a proposed fix rather than change scope silently.

## Files touched
- `supabase/migrations/<new>.sql` — E005 body_html + (E002 pending upload).
- `src/lib/orders/actions/consultation.functions.ts` (new).
- `src/lib/orders/actions/index.ts` — export.
- `src/components/admin/workspace/CustomerJourneyMap.tsx` — dialog + wiring.

## Out of scope
- No changes to journey graph, stage machine, ticket flow, or other templates.
- No retroactive resend for orders already marked Consultation Completed.
