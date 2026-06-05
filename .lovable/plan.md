
## Scope

Update two onboarding schemas in `src/lib/onboarding/schemas.ts`:

1. **`NEW_UDYAM`** (1st service — also reused as Stage 2 of the 6th service)
2. **`CORRECT_PAN_AADHAAR`** (6th service — Stage 1)

No UI/component changes — `OnboardingForm` already blocks submission when HTML5 `required` fields are empty, so just flipping `required: true` in the schema enforces the "don't take form till fields get submitted" behavior.

## Changes to `NEW_UDYAM` (relabel + mark required)

Renumber labels and flip `required` to match the spec. Items the user did **not** mark with `*` stay optional.

| Field key | New label | Required |
|---|---|---|
| aadhaar_number | `1. Aadhaar Number` | ✓ |
| applicant_name | `2. Your Name (as per Aadhaar)` | ✓ |
| business_type | `3. Type of Organisation / संगठन के प्रकार` | ✓ |
| pan_number | `4.1 PAN Number` | ✓ |
| pan_holder_name | `4.1.1 Name of PAN Card Holder` | ✓ |
| pan_dob | `4.1.2 Date of Birth as per PAN Card` | ✓ |
| itr_previous_year | `4.2 Have you filed ITR for PY 2024–25?` | ✓ |
| gstin_status | `4.3 Do you have GSTIN?` | ✓ |
| written_down_value | `Written Down Value (WDV) as on 31 March 2024–25 (A)` *(number removed)* | ✓ |
| exclusion_cost | `Exclusion of cost — Pollution Control / R&D / Industrial Safety Devices 2024–25 (B)` *(number removed)* | ✓ (was optional) |
| total_turnover | `Total Turnover during 2024–25` *(number removed)* | ✓ |
| business_name | `8. Name of Enterprise` | ✓ |
| aadhaar_mobile | `9. Mobile Number (+91)` | ✓ |
| email | `10. Email` | ✓ |
| social_category | `11. Social Category` | ✓ |
| gender | `12. Gender` | ✓ |
| specially_abled | `13. Specially Abled (Divyang)` | ✓ |
| section_address | `14. Official Address of Enterprise` (section header) | — |
| address_flat | `Flat / Door / Block No.` | ✓ |
| address_premises | `Name of Premises / Building` | optional (no `*`) |
| address_village | `Village / Town` | ✓ |
| address_block | `Block` | optional (no `*`) |
| address_road | `Road / Street / Lane` | ✓ |
| city | `City` | ✓ |
| pincode | `PIN Code` | ✓ |
| state | `State` | ✓ |
| district | `District` | ✓ |
| previous_registration | `16. Previous EM-II / UAM Registration Number, if any` | ✓ |
| section_status | `17. Status of Enterprise` (section header) | — |
| incorporation_date | `a. Date of Incorporation / Registration` | ✓ |
| business_commenced | `b. Whether production / business commenced` | ✓ |
| commencement_date | `Date of Commencement` | ✓ (was optional) |
| section_bank | `18. Bank Details` (section header) | — |
| bank_name | `Bank Name` | ✓ |
| bank_ifsc | `IFSC Code` | ✓ |
| bank_account_no | `Bank Account Number` | ✓ |
| major_activity | `19. Major Activity of Unit` | ✓ |
| nic_2_digit | `20a. NIC 2 Digit Code` | ✓ (unchanged) |
| nic_4_digit | `20b. NIC 4 Digit Code` | ✓ (unchanged) |
| nic_5_digit | `20c. NIC 5 Digit Code` | ✓ (unchanged) |
| **NEW** `section_employees` | `21. Number of persons employed` (section header) | — |
| employees_male | `Male` | ✓ (was optional) |
| employees_female | `Female` | ✓ (was optional) |
| employees_others | `Others` | ✓ (was optional) |
| gem_registration | `22. Interested in Government e-Marketplace (GeM) Portal?` | ✓ (was optional) |
| treds_registration | `23. Interested in TReDS Portals?` | ✓ (was optional) |
| ncs_registration | `24. Interested in National Career Service (NCS) Portal?` | ✓ (was optional) |
| nsic_b2b_registration | `25. Interested in NSIC B2B Portal?` | ✓ (was optional) |
| skill_india_registration | `27. Interested in Skill India Digital Portal?` | ✓ (was optional; user skipped 26 as written) |

Notes:
- User explicitly skipped numbers 15 and 26 — labels match that.
- WDV / Exclusion / Turnover have no number in the spec; numbers removed from labels.
- NIC heading not numbered separately by user, but we keep `20a/b/c` since employees needs to move to 21.
- `CORRECT_PAN_AADHAAR_STAGE2` automatically inherits all of these because it references `NEW_UDYAM.fields`.

## Changes to `CORRECT_PAN_AADHAAR` (Stage 1 of 6th service)

- `registered_email`: `required: false` → `required: true` (placeholder updated to drop "if available").

## Out of scope

- No changes to other schemas, components, or routes.
- Existing in-flight drafts keep working — only labels/required flags change.
