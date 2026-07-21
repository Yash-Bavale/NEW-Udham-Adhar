## Goal
Expand the public Lead Form UI with more fields (to increase time-on-page) and add Google reCAPTCHA. Only the original fields are actually saved — the new fields are pure UI, not sent to the backend.

## Field additions (in this exact order)
Keep existing captured fields (Name, Email, Mobile, State, Language, Reason/Service). Insert the new decorative fields; all **required to submit** but not sent to `createLead`.

1. Applicant Name *(captured)*
2. Email *(captured)*
3. Mobile *(captured)*
4. Reason for Help *(captured — currently "Service")*
5. Language of Assistance *(captured)*
6. State *(captured)*
7. **District** — dropdown, options filtered by selected State (use existing `src/lib/onboarding/india-districts.ts`)
8. **Pincode** — text, `pattern="[1-9][0-9]{5}"`, 6 digits
9. **Aadhaar Number** — text, `inputMode="numeric"`, 12 digits, masked display (show last 4)
10. **PAN Card Number** — text, uppercase, `pattern="[A-Z]{5}[0-9]{4}[A-Z]"`
11. **Date of Birth** — shadcn Popover + Calendar date picker (good UI, `pointer-events-auto`), max = today
12. **Gender** — dropdown: Male / Female / Other
13. **Social Category** — radio group: General / SC / ST / OBC
14. **Specially Abled** — dropdown: Yes / No
15. **Major Activity** — radio group: Manufacturing / Services / Trading

Layout: 2-column grid on `md+`, single column on mobile. Group visually under a subtle "Applicant Details" divider after Language, then "KYC Details" divider before Aadhaar.

## reCAPTCHA (Google reCAPTCHA v2 Checkbox)
- Add `<script src="https://www.google.com/recaptcha/api.js" async defer>` via TanStack `head()` on the root route (or lazy-inject on form mount to avoid loading site-wide).
- Render `<div class="g-recaptcha" data-sitekey="…">` just above the Submit button.
- On submit, read `grecaptcha.getResponse()`; if empty, block submit with an inline error "Please verify you're human."
- **Client-side only** enforcement for now (per your answer) — no server-side token verification, no changes to `createLead`.
- Site key stored as `VITE_RECAPTCHA_SITE_KEY` (public/publishable — safe in code). Will request it via secrets tool at build time.

## Files touched
- `src/components/site/LeadForm.tsx` — add fields, DOB picker, reCAPTCHA widget, validation gate. `onSubmit` payload unchanged.
- `src/routes/__root.tsx` — add reCAPTCHA script tag in `head().scripts`.
- (No DB migration, no server-function change, no `leads.functions.ts` change.)

## Out of scope
- Persisting the new fields to DB.
- Server-side reCAPTCHA verification.
- Applying the same fields to `talk-to-expert.tsx` (ask separately if you want it there too).

## Confirmation needed at build time
I'll request `VITE_RECAPTCHA_SITE_KEY` (and skip secret storage since it's a publishable key — I'll add it directly to `.env` / config). If you don't have one yet, get it from https://www.google.com/recaptcha/admin (choose reCAPTCHA v2 "I'm not a robot Checkbox", add `udyamadhar.in`, `www.udyamadhar.in`, and `*.lovable.app`).
