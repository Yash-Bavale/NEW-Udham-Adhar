# Form fidelity audit + fixes (CRM Workspace)

## What I verified from the DB

I read 50 recent submissions and inspected three representative rows (UA-2026-007641, UA-2026-007634, UA-2026-007570).

Stored form_data keys per service:

- `download-udyam-certificate` → `applicant_name`, `udyam_number`, `registered_mobile`, `registered_email`, **`aadhaar_mobile`** (leaked)
- `update-udyam-certificate` → above + `fields_to_update`, **`aadhaar_mobile`** (leaked)
- `new-udyam-registration` → full 40+ field payload + 4 empty `section_*` separator keys

`service_form_schemas` table is empty, so the CRM uses the TS schema in `src/lib/onboarding/schemas.ts` as source of truth (correct behavior).

## What's actually wrong

1. **`aadhaar_mobile` leak for Update / Download / Migrate / Correct-PAN flows.**
   `src/routes/onboarding.$leadCode.index.tsx:81` seeds `initial.aadhaar_mobile = lead.mobile` for **every** service. The non-New schemas don't define this field, so it's never shown in the form, but it still gets saved into `form_data`. In the CRM it then surfaces under "Other fields" as `aadhaar mobile`, which looks like a duplicate of Registered Mobile and confuses staff.

2. **Empty `section_*` separator keys** (`section_address`, `section_status`, `section_bank`, `section_employees`) are persisted as empty strings for New Udyam and pollute "Other fields".

3. **Sequence/labels**: schema fields render in correct order after the previous fix, but the "Other fields" block currently mixes real leaked data (`aadhaar_mobile`) with garbage separator keys, breaking the "same as form" rule.

4. **Service name displayed in workspace** uses `lead.service` (free-text) in headers and in the lead row. Canonical name is `services.service_name` keyed off `lead.service_id`. They match today, but a future rename in `services` would desync. Worth wiring the panel header to prefer the canonical label.

5. **`udyam_number` empty for UA-2026-007641**: the row is a *draft*, not a submission — `status='draft'`. The required-field guard only fires on submit, so this is expected. No fix needed, but the new always-render rule is what made it visible.

## Fixes

### A. Stop polluting `form_data` with fields the form never showed
`src/routes/onboarding.$leadCode.index.tsx`
- Only seed `aadhaar_mobile` when the **active service schema actually contains** an `aadhaar_mobile` field. Otherwise leave it unset.
- Strip `section`-type keys from the payload before save (they're UI-only separators).

### B. Filter "Other fields" in `FormSubmissionPanel`
`src/components/admin/FormSubmissionPanel.tsx`
- Compute `extras` as keys that are (a) not in the schema, (b) not `section_*`, (c) not empty strings/nulls. This keeps the panel a faithful mirror of the form the customer saw, while still surfacing genuinely unmapped data if any sneaks in.

### C. Show the exact customer-selected service name in the workspace
`src/components/admin/FormSubmissionPanel.tsx` header + the order workspace header strip
- Prefer `service.service_name` (already fetched from `services` table in `getFormSubmissionForApplication`) over `lead.service`. Fall back to `lead.service` when the service row is missing. No truncation (`break-words`, no max-width).

### D. One-time data cleanup (migration)
- `UPDATE onboarding_submissions SET form_data = form_data - 'aadhaar_mobile' WHERE service_code IN ('update-udyam-certificate','download-udyam-certificate','migrate-udyog-aadhaar-to-udyam','correct-pan-aadhaar') AND (form_data->>'aadhaar_mobile') IS NOT NULL;`
- `UPDATE onboarding_submissions SET form_data = form_data - 'section_address' - 'section_status' - 'section_bank' - 'section_employees' - 'section_documents' WHERE form_data ?| array['section_address','section_status','section_bank','section_employees','section_documents'];`

### E. Sanity check (no code change, just verification)
After A–D, re-query the same three leads and confirm the workspace shows:
- service header = canonical service name (e.g. "Download Udyam Certificate")
- all schema fields in schema order, full values, no truncation, `—` only for genuinely blank required ones
- "Other fields" block hidden when there's nothing extra

## Out of scope (won't change)
- Field labels, ordering, validation, or the public onboarding form UI.
- New Udyam payload structure or any other service schema.
- The "Copy All Details" clipboard format (already filters empties).
