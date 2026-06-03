## Current status: we are at Phase F, but C–L are on hold

- **Phase A–B:** completed earlier (DB-backed form schemas + 7 service schema seed).
- **Phase C–L:** you later asked to keep these on hold while SEO/page ordering work happened.
- **Phase E:** dynamic secure application links are planned but **not built yet**.
- **Phase F:** PDF/invoice/certificate-upload planning is where the roadmap paused, but **not implemented**.

So practically: **we are still before E/F execution; C–L are on hold.**

## Root cause found for the stuck form

The screenshot lead uses service text like **“New Udyam Registration”**, **“Migrate”**, and **“Talk to Expert”**, but the current schema mapper only recognizes exact labels from `SERVICES`, such as:

- `New Business Help Services`
- `Udyog Aadhaar to Udyam Migration`
- `Talk to Expert – Suitable Service Selection`

Because of that mismatch, the backend can load the **wrong form schema** (often Talk to Expert) for preview/legacy leads. That makes the Details step and Documents step inconsistent, so clicking **Save & Continue** may save draft/submit data but the customer feels stuck or lands on the wrong next step.

## Fix plan

### 1. Fix service-name mapping permanently
Update `serviceCodeFromLabel()` so all real service name variants map to the correct service code:

- `New Udyam Registration` → `new-udyam-registration`
- `New Business Help Services` → `new-udyam-registration`
- `Download Udyam Certificate` → `download-udyam-certificate`
- `Udyam Registration Certificate Download` → `download-udyam-certificate`
- `Migrate` → `migrate-udyog-aadhaar-to-udyam`
- `Udyog Aadhaar to Udyam Migration` → `migrate-udyog-aadhaar-to-udyam`
- `Talk to Expert` → `talk-to-expert`
- `Talk to Expert – Suitable Service Selection` → `talk-to-expert`

### 2. Make submit feedback impossible to miss
After successful final submit:

- show **“Details submitted successfully”** in the form area,
- show the success toast,
- disable the button while saving,
- change button text to **“Opening next step…”** while redirecting.

### 3. Force the correct next step
After final submit:

- if service has required/optional documents → go to `/onboarding/$leadCode/documents`,
- if service has zero documents → go directly to `/onboarding/$leadCode/done`,
- use `replace: true` so browser back doesn’t return users to a completed submit state.

### 4. Fix the Documents step UX
On the Documents step:

- if no documents are needed, auto-send to Done,
- if required documents exist, keep Continue disabled until uploaded,
- if documents are optional, allow Continue immediately,
- add a clear success toast/message when continuing to Done.

### 5. Cross-check all 7 preview pages
Verify these 7 leads now resolve to the correct service schema and next step:

1. `/onboarding/UA-2026-900001` — New Udyam Registration
2. `/onboarding/UA-2026-900002` — Update Udyam Certificate
3. `/onboarding/UA-2026-900003` — Udyam Certificate Download
4. `/onboarding/UA-2026-900004` — Migrate Udyog Aadhaar to Udyam
5. `/onboarding/UA-2026-900005` — Forgot Registered Mobile / Email
6. `/onboarding/UA-2026-900006` — Correct PAN / Aadhaar Name in Udyam
7. `/onboarding/UA-2026-900007` — Talk to Expert

## Files to change

- `src/lib/onboarding/onboarding.functions.ts`
- `src/routes/onboarding.$leadCode.tsx`
- `src/routes/onboarding.$leadCode.documents.tsx`
- `src/components/onboarding/OnboardingForm.tsx`

No SEO pages, payment logic, invoice logic, or admin CRM phases will be touched in this fix.