## Part 1 — Service-wise post-payment onboarding forms

After payment, `src/lib/onboarding/schemas.ts` resolves a form by `service_code` via `getSchema()`. Common docs (Aadhaar front/back, PAN) are defined but only used by services that explicitly list them.

### 1. `new-udyam-registration` — "New Udyam Registration — Incomplete Information"
~50 fields (full enterprise intake). Sections: Aadhaar/Identity, PAN & ITR, Investment & turnover, Enterprise details, Contact, Social/Gender/Divyang, Official Address (flat, premises, village, block, road, city, pincode, state, district), Previous EM-II/UAM, Status of Enterprise (incorporation date, commencement), Bank details (name, IFSC, account no.), Major Activity, NIC codes (2/4/5-digit pickers), Employees (M/F/Others), Government portal interest (GeM, TReDS, NCS, NSIC B2B, Skill India). **Documents:** none uploaded at this stage.

### 2. `update-udyam-certificate` — "Update Udyam Certificate — Incomplete Information"
Fields: applicant_name, udyam_number (pattern `UDYAM-XX-YY-#######`), registered_mobile, registered_email (optional), fields_to_update (textarea). **Documents:** none.

### 3. `download-udyam-certificate` — "Udyam Registration Certificate Download — Incomplete Information"
Fields: applicant_name, udyam_number, registered_mobile, registered_email (optional). **Documents:** none.

### 4. `migrate-udyog-aadhaar-to-udyam` — "Migrate — Incomplete Information"
Fields: applicant_name, uam_number (pattern `XX##X#######`), registered_mobile (optional), registered_email (optional). **Documents:** none.

### 5. `forgot-mobile-email` — "Recover Registered Mobile / Email"
Fields: applicant_name, udyam_number (optional), aadhaar_number (12-digit), new_mobile, new_email, reason (textarea). **Documents (all required):** Aadhaar Card PDF, PAN Card PDF, Signed Standard Form (download → fill → sign → upload, link `/forms/forgot-mobile-email-application.pdf`).

### 6. `correct-pan-aadhaar` — "Correct PAN / Aadhaar Name in Udyam — Incomplete Information"
Stage 1 fields: applicant_name, udyam_number, registered_mobile, registered_email, correction_required (textarea).
Stage 2 (`CORRECT_PAN_AADHAAR_STAGE2`) reuses the full New Udyam field set after Stage 1 is submitted. **Documents:** none.

### 7. `talk-to-expert` — "Talk to Expert — Consultation Booked"
No fields, no documents. Goes straight to thank-you page; team calls the registered mobile.

### Fallback
Any unmapped `service_code` falls back to `NEW_UDYAM`.

### Upload constraints (all services that have docs)
Max 5 MB per file; allowed: PDF, JPG, PNG, WEBP.

---

## Part 2 — Restore payment flow + redesign post-payment countdown

### Problem
- `src/components/site/LeadForm.tsx` (line 46) currently redirects to `/processing/$leadCode`, which loops a 30s countdown forever ("payment flow temporarily disabled").
- `src/routes/success.$leadCode.tsx` uses a different 30-second phase UI after payment; you want it replaced with a 60-second countdown that matches the visual design of the processing page, with copy adapted to the post-payment context.

### Changes

**A. `src/components/site/LeadForm.tsx`** — restore payment redirect.
- Line 46: change `to: "/processing/$leadCode"` → `to: "/payment/$leadCode"`.

**B. `src/routes/app.$token.tsx`** — same restoration for the magic-link return path.
- Line 77 + line 103: redirect / link to `/payment/$leadCode` instead of `/processing/$leadCode` (only when the lead is not yet paid; if already paid keep current logic that routes to success/onboarding).

**C. `src/routes/processing.$leadCode.tsx`** — stop the indefinite loop.
- Remove the `setElapsed(0); setCycles(...)` loop. When countdown hits 0, navigate to `/payment/$leadCode`. Keep the page as a graceful fallback in case any flow lands here, but it will no longer be the primary post-lead destination.

**D. `src/routes/success.$leadCode.tsx`** — rebuild as a 60-second post-payment countdown using the processing-page design.
- Keep the existing payment-confirmation polling logic (poll `getApplicationSummary` until paid; redirect to `/payment-pending/$leadCode` if not confirmed).
- Once confirmed, render the same visual shell as `processing.$leadCode.tsx` (concentric rotating rings, gradient sweep, center icon, large remaining-seconds counter, gradient progress bar, 4 step pips, ambient blur background, `TrustBlock` below).
- `TOTAL_SECONDS = 60`. Single linear countdown (no looping).
- New post-payment step sequence (4 pips, each ~15s):
  1. 0s — ShieldCheck — "Payment received securely" / "Confirming transaction with bank"
  2. 15s — FileCheck2 — "Preparing your onboarding form" / "Setting up your secure form"
  3. 30s — Sparkles — "Personalising your application" / "Tailoring fields to your service"
  4. 45s — CheckCircle2 — "Almost ready" / "Opening your form in a moment"
- At 0 remaining → `navigate({ to: "/onboarding/$leadCode", params: { leadCode }, replace: true })`.
- Keep the existing loading state, error state, and "Ref: {leadCode}" footer. Drop the rotating colour palette / `PHASE_STEPS` window logic — match the processing page exactly so both countdowns feel like one continuous brand experience.
- Helper text below counter: "Please don't close or refresh this window. Your form is being prepared."

### Out of scope
- No changes to onboarding form schemas, payment gateway code, or webhook handlers.
- Sitemap and any other `/processing` references stay as-is (the route still exists as a fallback).
