I checked the current lead in the screenshot (`UA-2026-001031`) and the backend already has its form saved as `submitted`. So the main bug is UX/navigation: after clicking **Save & Continue**, the user can be left feeling stuck even though the data is saved.

Plan:

1. **Fix the Save & Continue behavior on details step**
   - Keep the existing final submit save.
   - After a successful submit, force navigation to the correct next step.
   - If that service has no required document uploads, skip the documents page and go directly to the success page.
   - If documents are needed, go to the documents page.

2. **Show a clear success/progress message**
   - After final submit succeeds, show text like “Details submitted successfully” instead of only “Saved just now”.
   - Keep autosave as draft-only so users can tell the difference between autosaved draft and final submit.
   - Show backend validation errors clearly if any required field/format blocks submit.

3. **Make the Documents step less confusing**
   - If a service has zero documents, automatically or clearly continue to the success page.
   - If documents are optional only, allow Continue.
   - If required documents exist, keep the button disabled until required files are uploaded.

4. **Cross-check all 7 after-payment service schemas**
   - New Udyam Registration
   - Update Udyam Certificate
   - Udyam Certificate Download
   - Migrate UAM to Udyam
   - Forgot Registered Mobile / Email
   - Correct PAN / Aadhaar Name in Udyam
   - Talk to Expert

5. **Give you 7 preview links after the fix**
   - Create/use paid test leads for each service type.
   - Share direct `/onboarding/<leadCode>` links so you can click through every after-payment page and tell me changes.