## What actually happened on AP-2026-006630

I checked the database for this application:

- Lead service: **Download Udyam Certificate** (`download-udyam-certificate`)
- Onboarding submission row:
  - `status = "draft"`
  - `submitted_at = NULL`
  - `form_data.udyam_number = ""`

So the customer **never actually submitted the form**. They opened it, typed name / email / mobile, the form auto-saved as a **draft**, and they closed the tab before pressing the final "Submit Details" button. Required-field validation only runs on the real submit (server `submitOnboarding` checks `if (!data.draft)`), which is correct — we must allow drafts to be saved with missing fields, otherwise auto-save would constantly error out.

The Udyam-number field IS mandatory: both the TS fallback schema (`UDYAM_DOWNLOAD`) and the DB schema row mark `udyam_number` as `required: true` with the `UDYAM-XX-00-0000000` pattern. The server would have rejected the empty value if the customer had clicked Submit.

The real problem is in the CRM: the workspace shows draft data the same way as submitted data, so it looks like "the customer submitted with an empty field" when in fact they abandoned the form mid-way.

## Plan — make draft vs submitted unmistakable, and recover the lead

### 1. Strong "DRAFT — not submitted" banner in `FormSubmissionPanel.tsx`

When `submission.status !== "submitted"` (or `submitted_at` is null):

- Replace the small grey pill with a full-width **amber warning banner** at the top of the panel:
  > "Customer started filling this form but did NOT submit it. Values below are an auto-saved draft and may be incomplete. Required fields are still missing."
- List the specific required fields that are still blank (computed from the active schema) so staff instantly see e.g. *"Udyam Registration Number — missing"*.
- Each required field row in the panel gets a red "Required — empty" tag when its value is blank, instead of the silent "—".
- Add two action buttons in the banner:
  - **Copy onboarding link** (same `/onboarding/<leadCode>` URL we already build elsewhere)
  - **Resend onboarding email** (calls existing `enqueueFromTemplateInternal("onboarding_reminder", …)` if available, else falls back to the generic reminder template already wired in `emails-admin.functions.ts`)

### 2. Surface "draft, not submitted" everywhere we currently say "Form submitted"

- `LeadWorkspacePanel` / `OrderJourney` / `StageJourneyStrip`: the "Form Submission" stage tile should render in amber with label **"Form started — not submitted"** when `onboarding_submissions.status = 'draft'`, instead of the current green "submitted" treatment. Tile already reads the submission row; we just branch on `status`.
- `/admin/my-work` and `/admin/leads` (Form column): show a small amber **"Draft"** chip next to leads whose latest submission is a draft, so staff can chase them.

### 3. Stop the `applications.form_status` / `form_submitted_at` triggers from firing on drafts

Quick audit while I was in the file:
- `submitOnboarding` only sets `form_status = "submitted"` and transitions the application to `details_pending` when `!data.draft` ✓ correct.
- DB trigger `set_application_form_submitted_at` fires on **insert** of `onboarding_submissions`, regardless of `status`. That means a pure draft row stamps `applications.form_submitted_at`, which is what makes the workspace look "submitted". Migration: change the trigger to only stamp when `NEW.status = 'submitted'` (and add an `UPDATE` trigger so it stamps later when the draft is converted to submitted).

### 4. Recover this specific lead

- Add a one-click **"Re-send onboarding link"** action on the application page (uses the existing onboarding email template + the customer's email/WhatsApp). Action is also useful for any future abandoned drafts.
- Optional: a tiny cron (or just a manual button for now) that emails customers whose draft is older than 24h and still missing required fields. Out of scope unless you want it — flag if yes.

### Files touched

- `src/components/admin/FormSubmissionPanel.tsx` — banner, required-empty highlighting, action buttons.
- `src/components/admin/LeadWorkspacePanel.tsx`, `OrderJourney.tsx`, `StageJourneyStrip.tsx` — draft-aware stage tile.
- `src/routes/admin.leads.index.tsx`, `src/routes/admin.my-work.tsx` — "Draft" chip in form column.
- `src/lib/crm/emails-admin.functions.ts` (or new `resendOnboardingLink` server fn) — re-send action.
- New migration: update `set_application_form_submitted_at` trigger to gate on `status = 'submitted'`.

### What I will NOT change

- I will not force required fields on draft auto-save (that would break the auto-save UX).
- I will not change the customer-facing schema — `udyam_number` is already `required: true` with the correct pattern.
- I will not retroactively rewrite `AP-2026-006630`'s form_data; the draft row stays so the customer can resume from where they left off.
