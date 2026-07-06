## Goals

1. Stop auto-sending the "Action Required: Submit Information/Documents" email (`welcome_and_form_link` / E002). Employees will send it manually from the workspace.
2. Introduce a per-template **dispatch mode** (`auto` vs `manual`) that admins can configure — this becomes the single source of truth for whether automation actually fires.
3. Remove the duplicate/legacy templates so only the canonical 12 (SR 1–12, with `flow_id`) remain.
4. Fix the workspace's **Forms & Docs** tab — it stays disabled even after the customer submits the form.

---

## 1. Dispatch mode (auto vs manual)

**Schema** — add to `email_templates`:
- `dispatch_mode text not null default 'auto' check (dispatch_mode in ('auto','manual'))`
- Backfill: set `welcome_and_form_link` and every enabled auto-flow template's `dispatch_mode`; new "manual" ones for `welcome_and_form_link`, `cancel-action-required` (E003), `service_processing_update` (E005), and the govt-submitted one so employees choose the moment.
- Anything without a `flow_id` (SR 101+) defaults to `manual`.

**Gate the sender**: extend the internal enqueue helper in `src/lib/emails/emails.functions.ts` / `emails.server.ts` to look up `dispatch_mode` for the given `template_code` before enqueuing. If `manual`, the automation call becomes a no-op and returns `{ skipped: 'manual_dispatch' }` (still writes an audit row so timeline shows "auto-send skipped — manual mode").

**Manual-send UI**: `OrderActionRail` / `OrderWorkflowPanel` already has stage CTAs. Add a "Send email" secondary button on stages whose canonical template is `manual`. It calls a new `sendManualStageEmail` server fn that forces the send regardless of dispatch_mode, and records who sent it.

**Admin config UI**: extend `admin.email-templates.tsx` — each row gets a `Dispatch` column with an `Auto / Manual` toggle (admin/super_admin only). Editor drawer gets a matching field. Saving invalidates the templates cache.

---

## 2. Delete duplicate templates

Keep only rows whose `flow_id` is one of `E001, E002, E003, E004, E005, E006, E006-C, E-GOVT` **plus** the support/refund SR 8–11 rows already in the 12-template set. Migration will:
- `DELETE FROM email_templates WHERE sr_no >= 100;` (all legacy rows are numbered ≥100).
- Repoint any code that referenced deleted `code`s (`docs_required_reminder`, `final-notice-before-closure`, `payment_success`, `bhs_e003_customer_delay`, etc.) to their canonical replacement, or drop the send call if it's now covered by the manual flow.

Grep-driven fix list (already scanned): `bhs-templates.ts`, `order-actions.functions.ts`, `lead-transitions.ts`, `submissions-admin.functions.ts`, `payu.ts` webhook.

---

## 3. Auto flow behavior after change

- **On payment success** (`payu.ts` webhook + Razorpay path): sends only `order_confirmation` (E001, auto). The current scheduled `welcome_and_form_link` send at +30s is removed — employee will send it via the manual button in the workspace.
- All other auto templates keep their current triggers but pass through the new `dispatch_mode` gate.

---

## 4. Forms & Docs tab fix

`tabAvailability()` in `src/lib/orders/order-actions-map.ts` currently disables `form` when `status === 'NEW_ORDER'`. The reported case (stage = Form Submitted) shows the tab stuck because the underlying order status hasn't advanced past NEW_ORDER even though the customer already submitted. Fix:

- Enable `form` whenever `hasLead && !showConsultation` — the panel itself renders an empty / submitted / locked state. Reason string kept for the consultation case only.

---

## Files touched

- `supabase/migrations/…_email_dispatch_mode_and_dedupe.sql` (new): add column, backfill, delete legacy rows.
- `src/lib/emails/emails.server.ts` + `emails.functions.ts`: dispatch-mode gate, `sendManualStageEmail` server fn, extended `listEmailTemplates` selection, `setTemplateDispatchMode` mutation.
- `src/routes/admin.email-templates.tsx`: Dispatch column + toggle + editor field.
- `src/components/admin/workspace/OrderActionRail.tsx` (+ `stageActionMap.ts` if needed): "Send email" secondary button per stage where template is manual.
- `src/routes/api/public/webhooks/payu.ts`: remove `welcome_and_form_link` scheduled send.
- `src/lib/orders/order-actions-map.ts`: relax `form` tab availability.
- `src/integrations/supabase/types.ts`: regen types for new column.

## Out of scope

- Rewriting template HTML (already synced in the previous turn).
- New template categories or additional automation stages beyond E001–E006 + E-GOVT.
- Bulk sending / marketing (still refused).
