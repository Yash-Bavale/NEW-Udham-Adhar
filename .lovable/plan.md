Plan to fix the stuck after-payment onboarding flow:

1. Fix the real navigation bug
- The URL changes to `/documents`, but the Details form keeps showing because the dynamic onboarding route is acting like a parent route without rendering the child route.
- Refactor `/onboarding/$leadCode` into a proper layout route and move the current Details form into an index child route so `/documents` and `/done` actually render their own screens.

2. Make the stepper service-aware instead of always showing Details → Documents → Done
- Services with required uploads: show `Details → Documents → Done`.
- Services with no required uploads: show only `Details → Done`.
- The submit button will not say “Opening next step…” when there is no required next step; it will say something like “Submit details” and then go straight to the success page.

3. Route each service correctly after submit
- New Udyam Registration: Details → Documents → Done.
- Forgot Registered Mobile / Email: Details → Documents → Done.
- Update Udyam Certificate: Details → Done, with optional upload access only if needed.
- Migrate: Details → Done, with optional upload access only if needed.
- Correct PAN / Aadhaar Name: Details → Done, with optional upload access only if needed.
- Udyam Certificate Download: Details → Done.
- Talk to Expert: Details → Done, with optional upload access only if needed.

4. Improve messages and button states
- Remove stuck “Opening next step…” state.
- Show clear messages:
  - “Details submitted successfully.” when there is no required document step.
  - “Details submitted. Continue to document upload.” when documents are required.
- Add a fallback so if navigation takes too long, the button comes back and shows a retry/error message instead of staying disabled forever.

5. Cross-check all 7 preview paid links
- Test all 7 service onboarding links after implementation.
- Confirm each one lands on the correct next page and no service shows an unnecessary Documents step.