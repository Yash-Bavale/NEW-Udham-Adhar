# Completion-flow fixes + workspace polish

Root causes I found while tracing the AP‑2026‑006606 screenshot and the related code paths:

1. **Certificate email never leaves the box.** Both `updateFulfillmentStatus` (line ~554) and `resendOrderCertificate` (line ~681) in `src/lib/crm/orders-v2.functions.ts` insert directly into `email_queue` instead of calling `enqueueEmailInternal`. We migrated everything else to immediate Zoho SMTP send, but these two were missed — the rows sit in the queue forever.
2. **Customer Journey stuck on "Payment Done" after completion.** `computeOrderStage` returns `payment_done` whenever `form_submitted_at` is null, *before* checking `fulfillment_status`. For orders force-completed without the customer form (very common for Update / Download), the strip can never advance past step 2.
3. **"Need to pause or cancel?" still shown on completed orders.** `OrderWorkflowPanel` renders that card whenever `lane === "happy"`, with no guard for `current === "completed"`.
4. **Certificate number not persisted on the order.** It lands in the `certificates` table but `applications.certificate_uploaded_at` / `certificate_number` are never set, so any UI that joins on the application row shows nothing.
5. **Form-link controls still active after completion.** `FormSubmissionPanel` always renders Copy link / Resend form link buttons — they should be disabled once the order is `completed` / `cancelled`.
6. **Mobile number too small in the order header.** `WorkspaceShell` header line uses `font-mono text-xs` for the phone number.

## Changes

### A. `src/lib/crm/orders-v2.functions.ts`
- Replace the two raw `email_queue.insert({ template_code: "certificate_delivery", … })` blocks (completion + resend) with `enqueueEmailInternal({ templateCode: "certificate_delivery", … })` so the email is delivered immediately through Zoho SMTP and logged in `email_send_log`.
- In the completion branch (`if (target === "completed")`), also write `certificate_uploaded_at = now` and `certificate_number = certNumber` onto the `applications` row so the journey strip and order list reflect completion without joining `certificates`.
- Add `import { enqueueEmailInternal } from "@/lib/emails/emails.server";`.

### B. `db migration` — add `applications.certificate_number text`
- New migration `add_application_certificate_number.sql`:
  ```sql
  alter table applications add column if not exists certificate_number text;
  create index if not exists applications_certificate_number_idx on applications (certificate_number);
  ```
- Backfill from the latest `certificates` row per application.

### C. `src/lib/crm/computeOrderStage.ts`
- Reorder logic so `fulfillment_status === "completed"` (or `application_status === "completed"`) returns `"completed"` *before* the `form_submitted_at` gate. Same for the other late stages (`under_processing`, `application_submitted`, `verification_pending`, `documents_received`, `certificate_uploaded_at`).
- Net effect: the Customer Journey strip on AP‑2026‑006606 will light up all 9 dots through "Done" once we mark complete.

### D. `src/components/admin/workspace/OrderWorkflowPanel.tsx`
- Gate the "Need to pause or cancel?" card with `lane === "happy" && current !== "completed" && current !== "cancelled"`.
- When `current === "completed"`, show a compact "Order completed" summary card with the certificate number, issued-at timestamp, and a "Resend certificate" button (already wired via `resendOrderCertificate`) — no pause/cancel CTAs.

### E. `src/components/admin/FormSubmissionPanel.tsx`
- Accept an optional `isLocked?: boolean` prop.
- When locked, disable Copy link / Resend form link buttons, swap the empty-state banner to a neutral "Form link disabled — order is completed/cancelled" notice, and hide the "draft" warning.
- `WorkspaceShell` passes `isLocked={current === "completed" || current === "cancelled"}`.

### F. `src/components/admin/workspace/WorkspaceShell.tsx`
- Bump the header mobile number from `font-mono text-xs` → `font-mono text-sm font-semibold text-slate-900` and add a small phone icon. Email stays at `text-xs` so the row doesn't wrap awkwardly.
- Pass `isLocked` to `FormSubmissionPanel` (rendered in the Form & Docs tab).

### G. (Sanity) `src/components/admin/workspace/CustomerJourneyMap.tsx`
- No structural change needed — once `computeOrderStage` returns `completed` and `certificate_uploaded_at` is set, the existing stageMeta lookup will mark every dot. We'll only adjust the `completed` timestamp fallback to also accept `application.fulfilled_at` so older orders without `certificate_uploaded_at` still show a green checkmark.

## Out of scope
- No changes to email template content, Zoho SMTP config, cancellation workflow, or sidebar.
- No new tabs, no schema changes beyond the single nullable `certificate_number` column.

Ready to switch to build mode and apply A–G?
