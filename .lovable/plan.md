# Finish remaining onboarding-form items

Three items from your last message are still pending. Plan below.

## 1. State → District cascading dropdown (all 28 states + 8 UTs)

- Create `src/lib/onboarding/india-districts.ts` exporting `INDIA_DISTRICTS: Record<string, string[]>` covering every state and UT (~780 districts total).
- In `src/components/onboarding/OnboardingForm.tsx`:
  - When a field's `name === "district"`, render a `<select>` whose options come from `INDIA_DISTRICTS[currentState] ?? []`.
  - When `state` changes, clear `district` so a stale value from another state can't remain.
  - If no state is picked yet, the district select is disabled with placeholder "Select state first".
- The same district select is used in every schema that has a `district` field (Udyam, MSME, Udyog Aadhaar, New Udyam 14h, etc.).

## 2. Auto-format inputs (UPPERCASE / Title Case)

In `OnboardingForm.tsx`, add per-field input transforms by field name:

- **Force UPPERCASE as you type** (`onChange` transform):
  - `bank_ifsc`
  - `udyam_number`
  - `uam_number`
  - `pan_number`, `pan_holder_pan`
  - `gstin`
- **Title Case on blur** (so typing still feels natural):
  - `applicant_name`, `pan_holder_name`, `authorized_person_name`
  - `bank_name`, `branch_name`
  - `enterprise_name`, `organisation_name`
  - `address_flat`, `address_premises`, `address_village`, `address_block`, `address_road`, `city`
- Title-case helper preserves common all-caps tokens (PVT, LTD, LLP, HUF, OPC, INC, CO).
- Email stays lowercase; numeric/pin/mobile untouched.

## 3. NIC code searchable dropdown (fields 20a / 20b / 20c)

- Add `src/lib/onboarding/nic-codes.ts` exporting `NIC_CODES: { code: string; description: string; section: string }[]` from the NIC 2008 dataset already in the project's data folder.
- Build a small `<NicCodeCombobox />` (shadcn `Command` + `Popover`) used by `OnboardingForm.tsx` whenever a field's name matches `/^nic_code_[abc]$/`:
  - Type-ahead filters by code OR description.
  - Selecting a row stores just the 5-digit code in the form value, shows `"12345 — Description"` in the trigger.
  - Keyboard accessible, mobile-friendly (full-screen sheet on `<sm`).

## Technical notes

- No schema/validation changes needed — these are presentation-layer edits in `OnboardingForm.tsx` plus two new data files.
- District + NIC data files are static TS modules, tree-shaken per route.
- No backend, no migrations, no route changes.

## Files touched

- `src/lib/onboarding/india-districts.ts` (new)
- `src/lib/onboarding/nic-codes.ts` (new)
- `src/components/onboarding/OnboardingForm.tsx` (district select, auto-case transforms, NIC combobox wiring)
- `src/components/onboarding/NicCodeCombobox.tsx` (new)
