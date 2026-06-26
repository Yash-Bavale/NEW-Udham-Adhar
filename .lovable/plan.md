
## Goal

For **Talk to Expert** leads (₹99 consultation already paid), let the employee pick the actual service the customer needs after the call. On save, the system silently generates a payment link for the new service and sends it to the customer via email + WhatsApp — no pricing visible to the employee.

The ₹99 consultation fee stays as-is (already paid, non-adjusted).

## UX

A compact panel **"Convert Consultation → Service"** appears at the top of the lead workspace ONLY when:
- `lead.lead_source = 'talk_to_expert'`
- service is still `Expert Consultation`
- no paid payment exists for the new service yet

```text
┌────────────────────────────────────────────┐
│ 🎯 Set Customer's Service                  │
│ Pick the service the customer needs.       │
│ A payment link will be sent automatically. │
│                                            │
│ Service     [ Select service ▾ ]           │
│                                            │
│ [ Save & Send Payment Link ]               │
└────────────────────────────────────────────┘
```

- No price shown anywhere in this panel.
- After save → toast "Service set. Payment link sent to customer." Panel disappears.
- Existing PaymentLinkPanel (which does show price to roles with finance access) takes over for follow-up tracking.

## Technical plan

### 1. Server function `convertConsultationLead`
New file `src/lib/crm/talk-to-expert.functions.ts`

- Auth: `requireSupabaseAuth` + staff role check.
- Input (Zod): `{ leadId: uuid, serviceId: uuid }`.
- Loads service from `services` (price + gst). Computes base/gst/total server-side — never returned to client.
- Guard:
  - `lead.lead_source === 'talk_to_expert'`
  - lead not already converted (still "Expert Consultation")
  - no existing `payments` row with `status='paid'` for the *new* service amount
- Updates `leads`: `service`, `service_id`, `base_amount`, `gst_amount`, `total_amount`, `lead_status_v2 = 'payment_pending'`, append note "Converted from Expert Consultation → {service} by {staff}".
- Inserts `activity_logs` row (`service_converted`).
- Internally invokes the same code path as `createPaymentLink` to mint a fresh pending link.
- Enqueues email via existing `enqueueFromTemplateInternal` using new template `consultation_service_converted` with `{customer_name, service, payment_url, total_amount}`.
- Returns `{ ok: true }` only — no pricing.

### 2. Email template (migration)
Insert one row into `email_templates`:
- code: `consultation_service_converted`
- subject: `Your service & secure payment link — {{service}}`
- body: Zoho-style HTML matching existing brand templates with one prominent "Pay Securely" button → `{{payment_url}}`.

### 3. UI component
`src/components/admin/ConvertConsultationPanel.tsx`

- Uses existing `listActiveServices` server-fn for the dropdown (label only — name).
- No price fields rendered.
- Confirm button → calls `convertConsultationLead`.
- On success: toast + invalidate `admin.lead-detail`, `admin.lead-events`, `admin.payment-link` queries so PaymentLinkPanel refreshes.

### 4. Wire-up
In the lead workspace composer (`LeadWorkspacePanel.tsx`), render `<ConvertConsultationPanel />` conditionally above existing panels when the talk-to-expert criteria are met.

### 5. WhatsApp auto-send
Email is sent server-side automatically. WhatsApp is opened by employee (browser cannot auto-send WA from server). The existing PaymentLinkPanel already shows the WhatsApp share button with the freshly-generated link — employee can click it once after conversion. We won't auto-fire WA from the server (not possible without WhatsApp Business API integration, which isn't configured in this project).

### Out of scope
- ₹99 refund/adjustment logic (kept as-is per your instruction).
- Pricing visibility changes to other panels.
- WhatsApp Business API automation.

No schema changes; only the new email-template row.
