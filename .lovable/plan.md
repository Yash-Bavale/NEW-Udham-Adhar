## Root cause

I checked the live order `11448f96…` (lead `UA-2026-007629`) in the database. After Step 1 fired, the row looks like this:

```
lead_source     = "website"          ← original capture source, never changed
service         = "New Udyam Registration"
status / v2     = payment_pending
application.application_status = awaiting_payment
```

`isConvertedConsultationLead()` requires `lead_source` to contain `talktoexpert` / `expertconsultation`. Because the original lead was captured with `lead_source = "website"` and `selectConsultationService` never stamps a conversion marker, the check returns **false** after Step 1 runs. So:

- `selectStep` is false (service is no longer the consultation label)
- `awaitingSecondPayment` is false (lead_source isn't a consultation source)
- `showConsultationPanel` is false → Step 2 panel never mounts → no "Copy / Send Payment Link" buttons, so no email can be sent either.

The visible symptom on this order matches exactly: the normal `FormSubmissionPanel` appears instead of the amber Step 2 card.

## Fix

Stamp an unambiguous "this lead came from Talk-to-Expert" marker at Step 1 and teach the detector to honor it, independent of the original lead capture source.

### 1. `src/lib/crm/talk-to-expert.functions.ts` — `selectConsultationService`
- In the `leads` update, also set `lead_source = "talk_to_expert_converted"` (preserving the original value in `workflow_events.metadata.original_lead_source` for audit).
- In `resetConsultationSelection`, restore `lead_source` back to its original value if present in metadata, otherwise leave the converted marker (still recognized as consultation).

### 2. `src/lib/crm/consultation.ts`
- Extend `isConsultationSource()` so it also matches `talk_to_expert_converted` (normalized form `talktoexpertconverted` already contains `talktoexpert`, so no change needed — verify with the existing regex).
- Confirm: `isUnconvertedConsultationLead` stays purely service-name based; `isConvertedConsultationLead` keeps source-based check, which now succeeds.

### 3. Backfill existing rows
Run a one-off SQL migration to mark any lead whose latest application has `application_status = 'awaiting_payment'` AND has a prior successful payment AND was originally a Talk-to-Expert lead (detected via `workflow_events` of type `consultation_service_selected`). For these, set `leads.lead_source = 'talk_to_expert_converted'`. This rescues lead `c3c8a623…` and any siblings.

### 4. Verification
- Reload `/admin/orders/11448f96-6cc0-473c-a4df-4353a8217f17` — the amber **Step 2 · Share Payment Link** card should render with the payment URL, Copy, Send Email (60 s cooldown), WhatsApp, and Change Service controls.
- Click **Send Payment Link** → `email_queue` row inserted for template `consultation_service_converted`; with the recently-shipped immediate-send change, the email fires synchronously.
- Test a fresh Talk-to-Expert order end-to-end: Step 1 → Step 2 visible → email sends → after webhook flips `application_status`, the panel auto-hides and `FormSubmissionPanel` / `FulfillmentStatusUpdater` reappear.

No UI/UX changes — only the gating logic and a marker field.
