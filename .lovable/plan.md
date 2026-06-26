## Flow (as I understand it)

1. **Customer pays for "Talk to Expert"** → order lands in admin as a consultation.
2. **Staff calls customer**, discusses, then on the order page **selects the next service** they actually need.
3. On Save, the system computes pricing and **mints a payment link**, but does NOT auto-email yet. Instead the panel reveals two buttons:
   - **Send Payment Link** (emails + WhatsApp-ready text to customer)
   - **Copy Payment Link** (copies URL to clipboard for manual share)
   Staff can re-send / re-copy as many times as needed.
4. **Order stays in "Awaiting 2nd Payment" stage** — no onboarding form is shown to the customer, no form-submission panel in admin.
5. **Customer pays the 2nd payment** (webhook flips status).
6. **Only then** does the system:
   - Show the onboarding form link to the customer (success page + email).
   - Reveal the **FormSubmissionPanel** and **"Share Form Link / Copy Form Link"** buttons to staff inside the order workspace.
   - Resume the normal fulfillment workflow (documents → verification → completed).

## What changes

### `src/lib/crm/talk-to-expert.functions.ts`
- Split `convertConsultationLead` into two calls:
  - `selectConsultationService({ leadId, serviceId })` — updates lead with new service + pricing, sets `applications.application_status = 'awaiting_payment'`, voids old pending links, mints fresh `payment_links` row. **Does NOT send email.** Returns `{ paymentUrl, txnid, amount }`.
  - `sendConsultationPaymentLink({ leadId })` — sends the `consultation_service_converted` email using the currently active pending link. Idempotent — staff can click multiple times (rate-limit at ~1/min in UI).
- Keep activity-log + workflow_events entries for both actions separately ("service_selected", "payment_link_sent").

### `src/components/admin/ConvertConsultationPanel.tsx`
Rewrite as a 2-step panel:
- **Step A (no service selected yet):** service dropdown + "Save Service" button.
- **Step B (service selected, awaiting payment):** read-only service name + price summary (staff-visible only), masked payment URL, and three buttons:
  - **Send Payment Link** (calls `sendConsultationPaymentLink`)
  - **Copy Link** (clipboard copy)
  - **Change Service** (reverts to Step A, voids current link)
- Poll `getPaymentLinkStatusForLead` every 15 s; when `paid: true`, panel collapses with a success state and triggers `qc.invalidateQueries(['admin.order'])` so the rest of the workspace re-renders into the normal flow.

### `src/routes/admin.orders.$orderId.tsx`
Current logic already hides `FormSubmissionPanel` + `FulfillmentStatusUpdater` while the lead is an unconverted consultation. Extend that check to also hide them while the lead is **converted but the 2nd payment is still pending** (`application_status === 'awaiting_payment'` AND no successful payment for the new service). Re-show them only after 2nd payment success.

### `src/components/admin/StageActionsPanel.tsx` / `computeOrderStage.ts`
Add stage label "Awaiting 2nd payment" between `consultation_pending` and `payment_done` for converted consultation orders. Tone: amber.

### Customer-facing
- The `/payment/$leadCode` route already re-initiates a fresh PayU/CCAvenue order on open — no change needed; the relaxed `paidAlready` check for converted consultations is already in place.
- Onboarding form email (`onboarding_form_link` template) is already triggered by the payment webhook on success — works as-is for the 2nd payment because the webhook fires the same path.

## What stays the same
- Pricing/amount stays hidden from non-finance staff (existing `canSeeMoney` gating).
- Customer contact strip + side profile stay visible.
- No DB schema changes — uses existing `payment_links`, `applications.application_status`, `workflow_events`.

## Out of scope
- WhatsApp deep-link button (can add later if you want a `wa.me/<mobile>?text=...` shortcut next to Copy).
- SMS sending — only email + manual copy for now.

Confirm and I'll build it.
