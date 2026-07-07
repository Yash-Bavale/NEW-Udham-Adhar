I checked the backend now. Current count from the email queue:

- Total queued emails: 438
- Emails not matching any row in Email Templates: 330
- Emails with no template code at all: 23
- Emails with a template code that is not present in Email Templates: 307
- Sent emails that did not match Email Templates: 307

Biggest unmatched template codes I found:

- onboarding_complete: 88
- payment_success: 66
- admin_onboarding_submitted: 53
- onboarding_reminder: 30
- contact_acknowledgement: 20
- order_pending_closure: 13
- docs_required_reminder: 7
- workflow_closure_notice: 6
- service_processing_update: 4
- consultation_service_converted: 4
- plus smaller old/misc codes and 23 raw emails with no template code

Plan to fix it:

1. Stop raw customer/admin email sends
   - Replace direct `enqueueEmailInternal` sends with real Email Templates where possible.
   - Keep the internal queue sender, but prevent normal app flows from sending customer-facing emails without a template code.

2. Add missing template rows for active unmatched codes
   - Create Email Template records for currently used active flows that are missing from the template manager, especially:
     - `payment_success`
     - `onboarding_complete`
     - `admin_onboarding_submitted`
     - `onboarding_reminder`
     - `contact_acknowledgement`
     - `docs_required_reminder`
     - `order_pending_closure`
     - `workflow_closure_notice`
     - `service_processing_update`
     - `ticket_created`
   - Where these duplicate newer BHS templates, map code paths to the newer template instead of creating duplicates.

3. Fix the hardcoded send paths
   - Contact form and Talk-to-Expert emails currently create raw bodies without Email Template records.
   - Ticket reply email currently sends with `templateCode: null`.
   - Admin test email currently sends raw content.
   - These will be converted to template-backed sends or clearly marked as test/system-only.

4. Add a guardrail
   - Add an internal validation so customer-facing emails cannot be queued with a missing template code.
   - Allow only explicitly marked system/test/internal notifications to bypass templates.

5. Improve admin visibility
   - In Email Logs / Email History, show a warning badge when an email has no matching Email Template.
   - Add an “Unmatched Templates” section/count so this problem is visible immediately.

6. Backfill/audit existing records safely
   - Do not rewrite sent email content.
   - For old rows, preserve history but classify unmatched codes so the admin UI can show whether they are legacy/missing-template/raw emails.

Technical notes:

- `enqueueFromTemplateInternal` already enforces lookup in `email_templates`; this is the correct path.
- The problem comes from older/direct calls to `enqueueEmailInternal`, plus legacy template codes that exist in queued/logged emails but not in `email_templates`.
- I will use migrations for missing template rows and code changes for active raw send paths.