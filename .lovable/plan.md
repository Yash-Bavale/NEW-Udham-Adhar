## What we're doing

Your codebase doesn't match the attached prompt's stack (it references Edge Functions, `app_code`, `customer_id` on submissions, an `email_queue` table, etc. — none of those apply here). I'll apply the **intent**: make sure form data is captured end-to-end, then surface it cleanly in the CRM exactly where staff need it.

## Verification (already done, diagnostics ran)

- `onboarding_submissions` is being written correctly — rows have `form_data`, `service_code`, `submitted_at`, and are linked to both `lead_id` and `application_id`. ✅
- `applications.form_status` is updated to `submitted` and `application_status` transitions to `details_pending`. ✅
- `documents` table: rows are inserted, but `application_id` is **NULL** on uploads (only `lead_id` is set). That's the real broken link. ⚠️

## Changes

### 1. Fix `documents.application_id` so uploads attach to the order
File: `src/lib/onboarding/onboarding.functions.ts` — in the document upload-finalize / insert path, look up the lead's latest application and set `application_id` on the new `documents` row (same way `submitOnboarding` already does).

Optional one-time backfill via migration: set `application_id` on existing `documents` rows where it's NULL by joining the lead's most recent application. (Confirm before running.)

### 2. New `FormSubmissionPanel` component (shared)
File: `src/components/admin/FormSubmissionPanel.tsx`

Reads `onboarding_submissions` + `documents` for one application via a new tiny server fn `getFormSubmissionForApplication({ applicationId })` in `src/lib/crm/submissions-admin.functions.ts`.

Renders:
- Header: "Form Submission" + submitted timestamp (IST), status pill (`submitted` / `draft`), "Copy Form Link" + "Resend Form Link" buttons.
- Field grid grouped by section. Section/label config driven by the service schema already in `src/lib/onboarding/schemas.ts` (uses `field.group` if present, else flat). No new per-service config file — reuse what's in the DB/schema loader.
- Mask Aadhaar (`aadhaar_number`, `aadhar_number`) and bank account (`bank_account_number`, `account_number`) to last 4: `XXXX XXXX 1234`.
- Documents checklist: required docs from `service_form_schemas.documents` (already loaded by `getOnboarding`); each row shows ✓ Received / ✗ Missing, file name, preview (👁) + download (↓) using `getDocumentSignedUrl`.
- "X required document(s) still missing" amber notice when applicable.
- Empty state: "Form not yet submitted" with "Send form link" button.

### 3. Wire panel into both detail pages
- `src/routes/admin.leads.$leadId.tsx` — replace the current `AdminOnboardingPanel` with `FormSubmissionPanel` (or keep the panel and have it render the new one when an application exists). Keep position: below status controls, above timeline.
- `src/routes/admin.orders.$orderId.tsx` — add a new "Form Data" section in the left column above `InternalActivity`, rendering `FormSubmissionPanel` with the order's `applicationId`.

### 4. Form-status chip on the leads list
- `src/lib/crm/leads-admin.functions.ts` — include each lead's latest `application.form_status` and document counts in the list query.
- `src/routes/admin.leads.index.tsx` — add a compact "Form" column:
  - null / `not_submitted` → grey "Not submitted"
  - `submitted` + all required docs uploaded → green "Complete"
  - `submitted` + missing docs → amber "Docs pending"
  - `resubmitted` → blue "Resubmitted"

### 5. Copy / Resend form link helpers
Form URL is the existing onboarding route: `${APP_BASE_URL}/onboarding/${lead_code}`. The "Copy" button is client-only (`navigator.clipboard`). The "Resend" button calls a small new server fn that re-queues the existing `client-info-request` / onboarding template via `enqueueFromTemplateInternal` and writes an audit entry.

## Non-goals
- No changes to the customer-facing onboarding form itself.
- No Edge Function from the prompt — we already use TanStack server fns.
- No new DB columns. (`form_data`, `form_status`, `application_id` already exist.) The only DB touch is an optional backfill of `documents.application_id` for historical rows.
- No changes to PayU / payment / success flow.

## Verification after build
1. Submit a fresh onboarding for a paid lead → `documents.application_id` is set.
2. Open the lead detail page → Form Submission panel shows masked fields, doc checklist, preview/download work.
3. Open the order detail page → same panel renders with the same data.
4. Open the leads list → new "Form" chip reflects the correct state.
5. Click Copy Form Link → URL `…/onboarding/<lead_code>` copied. Resend → email enqueued + activity event logged.
