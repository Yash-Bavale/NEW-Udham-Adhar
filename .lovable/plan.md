
## Scope

Apply the seven changes below. Nothing else is touched.

---

### 1. State → District cascading dropdown

- Add `INDIA_DISTRICTS: Record<string, string[]>` (all 28 states + 8 UTs, ~700 districts total) to `src/lib/onboarding/schemas.ts`.
- In `src/components/onboarding/OnboardingForm.tsx` `FieldRenderer`:
  - Render `state` as a `<select>` (already done).
  - When the field key is `district`, render a `<select>` whose options come from `INDIA_DISTRICTS[allValues.state]`. If no state selected, options are empty and the field is disabled with placeholder "Select state first".
  - When state changes, clear `district` (handled by adding a small side-effect in the parent `update` or by clearing in OnboardingForm whenever `values.state` changes).

### 2. Auto-uppercase / title-case form inputs

In `OnboardingForm.tsx` `transform()`:
- **IFSC** (`bank_ifsc`, pattern `^[A-Z]{4}0[A-Z0-9]{6}$`): strip spaces, uppercase, slice 11.
- **Udyam Registration Number** (`udyam_number` — new pattern below): strip spaces, uppercase, slice 19, enforce `UDYAM-` prefix once user types.
- **UAM Number** (`uam_number`): uppercase.
- **Generic title-case** for free-text name-style fields (`applicant_name`, `pan_holder_name`, `business_name`, `bank_name`, `address_*`, `city`): on blur, transform to Title Case (first letter of each word capitalised). Do this in an `onBlur` handler, not in `onChange`, so typing isn't disrupted. Skip email/textarea/numeric fields.

### 3. Standardise Udyam Registration Number input

In `schemas.ts`, for every `udyam_number` field (UDYAM_UPDATE, UDYAM_DOWNLOAD, CORRECT_PAN_AADHAAR):
- `pattern: "^UDYAM-[A-Z]{2}-\\d{2}-\\d{7}$"`
- `placeholder: "UDYAM-MH-26-0276396"`
- `maxLength: 19`
- `help: "Format: UDYAM-<State>-<Year>-<7 digits>, e.g. UDYAM-MH-26-0276396"`

`FieldRenderer` detects this pattern → routes through the new Udyam transform (uppercase, auto-insert hyphens optional — keep simple: just uppercase + maxlength + browser pattern validation).

### 4. Payment success page: 15s → 30s + new copy/animation

In `src/routes/success.$leadCode.tsx`:
- `REDIRECT_SECONDS = 30`.
- Re-tune phases: `confirming` 0–10s, `confirmed` 10–20s, `action` 20–30s.
- New copy:
  - Phase 1 "Confirming your payment…" → keep, add subline "Securely verifying with the payment gateway."
  - Phase 2 "Payment confirmed ✓" → add "Setting up your secure onboarding workspace…"
  - Phase 3 "Almost there — one last step" → "Our experts need a few more details. Opening your form in a moment."
- Add a subtle motion sweep: animated radial pulse behind the ring (using `motion.div` scale+opacity loop like the processing page).

### 5. "You're all set" → "Form Submitted Successfully" + final-step UI

In `src/routes/onboarding.$leadCode.done.tsx`:
- Replace title `"You're all set"` with `"Form Submitted Successfully"` (helpMode keeps "Help is on the way").

In `src/components/onboarding/OnboardingShell.tsx`:
- When `step === 3` (the Done step), render the step pill for "Done" as **completed** (filled brand-navy circle with a Check icon), not as the active number "3". I.e. treat step 3 as `done` when on the Done page so it doesn't look pending.
- Apply this to all onboarding done pages automatically (single shell change).

### 6. SEO page content additions (text-only, no other changes)

- `src/routes/udyam-msme.tsx` — prepend to `content` prop:
  `"Udyam MSME Certificate — Get Your Udyam MSME Certificate Online. "` followed by existing text.
- `src/routes/udyam-download-online.tsx` — prepend to `content` prop:
  `"Udyam Download Online — Udyam Download for Small Businesses. "` followed by existing text.

No meta, no HTML, no layout changes.

### 7. New Udyam Registration form — number the fields

In `schemas.ts` `NEW_UDYAM.fields`, prefix `label` with the numbering the user specified (1, 2, 3, 4.1, 4.1.1, 4.1.2, 4.2, 4.3, 5/6/7 for WDV/exclusion/turnover, 8…25). No field added/removed/reordered, NIC search stays as-is (already wired to existing data via `searchNicCodes`).

Exact mapping (label → numbered label):
```
aadhaar_number        → 1. Aadhaar Number
applicant_name        → 2. Your Name (as per Aadhaar)
business_type         → 3. Type of Organisation
pan_number            → 4.1 PAN Number
pan_holder_name       → 4.1.1 Name of PAN Card Holder
pan_dob               → 4.1.2 Date of Birth as per PAN Card
itr_previous_year     → 4.2 Have you filed ITR for PY 2024–25?
gstin_status          → 4.3 Do you have GSTIN?
written_down_value    → 5. Written Down Value (WDV) as on 31 March 2024–25 (A)
exclusion_cost        → 6. Exclusion of cost — Pollution Control / R&D / Industrial Safety Devices 2024–25 (B)
total_turnover        → 7. Total Turnover during 2024–25
business_name         → 8. Name of Enterprise
aadhaar_mobile        → 9. Mobile Number (+91)
email                 → 10. Email
social_category       → 11. Social Category
gender                → 12. Gender
specially_abled       → 13. Specially Abled (Divyang)
address_flat          → 14. Flat / Door / Block No.
address_premises      → 14a. Name of Premises / Building
address_village       → 14b. Village / Town
address_block         → 14c. Block
address_road          → 14d. Road / Street / Lane
city                  → 14e. City
pincode               → 14f. PIN Code
state                 → 14g. State
district              → 14h. District
previous_registration → 16. Previous EM-II / UAM Registration Number, if any
incorporation_date    → 17a. Date of Incorporation / Registration
business_commenced    → 17b. Whether production/business commenced
commencement_date     → 17c. Date of Commencement
bank_name             → 18a. Bank Name
bank_ifsc             → 18b. IFSC Code
bank_account_no       → 18c. Bank Account Number
major_activity        → 19. Major Activity of Unit
nic_2_digit           → 20a. NIC 2 Digit Code
nic_4_digit           → 20b. NIC 4 Digit Code
nic_5_digit           → 20c. NIC 5 Digit Code
employees_male        → 21a. Persons employed — Male
employees_female      → 21b. Persons employed — Female
employees_others      → 21c. Persons employed — Others
gem_registration      → 22. Interested in GeM Portal?
treds_registration    → 23. Interested in TReDS Portals?
ncs_registration      → 24. Interested in NCS Portal?
nsic_b2b_registration → 25. Interested in NSIC B2B Portal?
skill_india_registration → 26. Interested in Skill India Digital Portal?
```

---

## Files changed

1. `src/lib/onboarding/schemas.ts` — add `INDIA_DISTRICTS`, update Udyam number pattern/placeholder/help, prefix NEW_UDYAM labels with numbers.
2. `src/components/onboarding/OnboardingForm.tsx` — district cascading select, IFSC/Udyam uppercase transforms, title-case on blur for name-like text fields, clear district when state changes.
3. `src/components/onboarding/OnboardingShell.tsx` — render step 3 as completed (checkmark) when current step is 3.
4. `src/routes/onboarding.$leadCode.done.tsx` — title → "Form Submitted Successfully".
5. `src/routes/success.$leadCode.tsx` — 30s timer, retuned phase thresholds and copy, added radial pulse animation.
6. `src/routes/udyam-msme.tsx` — prepend new sentence to `content`.
7. `src/routes/udyam-download-online.tsx` — prepend new sentence to `content`.

## Not in scope (per "don't change anything else")

- No layout/route/SEO/meta/footer/header changes.
- No backend, payments, leads, or DB changes.
- NIC search stays on the existing data source.
- Other service forms (Update/Download/Migrate/Correct/Forgot) unchanged except the Udyam-number field standardisation in §3.
