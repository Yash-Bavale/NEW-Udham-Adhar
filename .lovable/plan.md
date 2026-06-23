# PART 1 — PayU Audit & Fill-the-Gaps Plan

## Audit summary

Already implemented and matches spec (keep as-is):
- SHA-512 outgoing + incoming hash, server-only (`payu.server.ts`)
- Hash-verified webhook at `/api/public/webhooks/payu` with `verify_payment` fallback
- Idempotent payment row creation, txnid uniqueness
- Amount mismatch warning
- `paid` status not downgradable
- Invoice generation with GST split (CGST/SGST vs IGST) via `generateInvoiceInternal`
- Payment-success email enqueue
- Test/live mode flag (`PAYU_MODE`)
- Public payment page `/payment/$leadCode` posting hidden form to PayU
- `verify_payment` lookup fallback on hash mismatch (better than spec)

Gaps vs spec (the work in this plan):
1. No `payment_links` table → no employee-side "Generate Payment Link" UI
2. No `webhook_error_log` table → errors only go to console
3. Webhook does NOT auto-create an `application` row when one is missing
4. Single `payment_success` email — spec wants separate `order_confirmation` (with invoice) + `welcome_and_form_link` (slight delay) + lead status flip to `welcome_mail_sent`
5. Missing PayU-detail columns (mihpayid, mode, bank_ref_num, error_message, webhook_received_at, is_test_payment) — currently stuffed into `raw_response`
6. No GST snapshot columns on invoice (`company_state_snapshot`, `customer_state_snapshot`) — spec wants these pinned
7. No employee tooling to copy link / WhatsApp link / poll status

Explicit non-goals (per your answers):
- No Supabase Edge Function rewrite — keep `createServerFn` + TSS `/api/public/webhooks/payu`
- No `razorpay_* → gateway_*` column rename
- PART 2 (UI overhaul) is deferred

## Work

### A. Database migration (one migration)

```sql
-- payment_links: employee-issued / customer-self-checkout link tracking
CREATE TABLE public.payment_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  txnid text UNIQUE NOT NULL,
  payment_url text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',  -- pending|paid|failed|expired
  expires_at timestamptz,
  opened_at timestamptz,
  paid_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.payment_links TO authenticated;
GRANT ALL ON public.payment_links TO service_role;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read" ON public.payment_links FOR SELECT TO authenticated
  USING (public.has_any_staff_role(auth.uid()));
CREATE POLICY "staff write" ON public.payment_links FOR INSERT TO authenticated
  WITH CHECK (public.has_any_staff_role(auth.uid()));
CREATE POLICY "staff update" ON public.payment_links FOR UPDATE TO authenticated
  USING (public.has_any_staff_role(auth.uid()));

-- webhook_error_log
CREATE TABLE public.webhook_error_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_type text NOT NULL,
  error_message text NOT NULL,
  raw_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.webhook_error_log TO authenticated;
GRANT ALL ON public.webhook_error_log TO service_role;
ALTER TABLE public.webhook_error_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read" ON public.webhook_error_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)
      OR public.has_role(auth.uid(), 'super_admin'::app_role));

-- PayU-specific columns on payments (idempotent)
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS payu_mihpayid text,
  ADD COLUMN IF NOT EXISTS payu_mode text,
  ADD COLUMN IF NOT EXISTS payu_bank_ref_num text,
  ADD COLUMN IF NOT EXISTS payu_net_amount_debit numeric,
  ADD COLUMN IF NOT EXISTS payu_error_message text,
  ADD COLUMN IF NOT EXISTS webhook_received_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_test_payment boolean DEFAULT false;

-- Invoice GST snapshots (idempotent)
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS company_state_snapshot text,
  ADD COLUMN IF NOT EXISTS customer_state_snapshot text;
```

### B. Webhook hardening (`src/routes/api/public/webhooks/payu.ts`)

- Populate the new PayU detail columns from form payload (`mihpayid`, `mode`, `bankrefnum`, `net_amount_debit`, `error_Message`, `webhook_received_at = now()`, `is_test_payment = PAYU_MODE !== 'live'`).
- If the payment has no `application_id` when status becomes `paid`, auto-create one (mirrors spec Step 4A-1):
  - Use existing `applications` table; rely on its `application_code` trigger.
  - Set `fulfillment_status = 'order_received'`, copy `assigned_to` from lead.
  - Patch `payments.application_id` after insert.
- On any caught error, insert into `webhook_error_log` and return 200 (PayU must not retry forever).
- After invoice generation, queue **two** emails instead of one:
  1. `order_confirmation` — uses `invoice_pdf_url` from generated invoice
  2. `welcome_and_form_link` — with `send_after_seconds: 30` so it lands after the receipt
- Add `lead_status_v2` transitions: `payment_successful` then `welcome_mail_sent` after the welcome email is enqueued.
- Mark `payment_links.status='paid'`, `paid_at=now()` keyed by `txnid`.

### C. Generate-Payment-Link server function

New `src/lib/payments/payment-links.functions.ts`:
- `createPaymentLink({ leadId })` — `requireSupabaseAuth` + staff role check.
  - Reuses existing pending link for that lead if one is still `pending` and not expired (returns it instead of minting a new one).
  - Otherwise calls into the same code path as `createPayUOrder` to insert a fresh `payments` row with txnid, then writes a `payment_links` row with `payment_url = ${origin}/payment/${leadCode}`.
  - Returns `{ paymentUrl, txnid, amount, status, expiresAt, isReused }`.
- `getPaymentLinkStatus({ txnid })` — light poll for UI auto-refresh (every 15s).
- `regeneratePaymentLink({ leadId })` — explicit "force new" path; voids prior pending row via `payments.status='failed'` and `payment_links.status='expired'`.

### D. Admin "Generate Payment Link" panel

New `src/components/admin/PaymentLinkPanel.tsx` rendered inside the existing Lead Workspace (right column), visible when:
- Lead has no `paid` payment, and
- `lead.status` in {`new_lead`,`contacted`,`follow_up_required`,`payment_pending`,`payment_failed`}

Panel contents (functional only — no UI redesign here):
- Service + amount breakup (base / GST / total) read from the lead
- Primary button: "Generate & Copy Link"
- After link exists: read-only URL field, Copy button (toast), WhatsApp share button (`https://wa.me/91${mobile}?text=...`), "Regenerate" (with confirm)
- Status line auto-polls every 15s; on `paid` shows success state and triggers a workspace refresh.

No CRM design tokens are changed — uses existing components and the current Tailwind utility set. This is the functional hook for the prettier panel in PART 2.

### E. Verification (no Edge Functions involved)

After build:
1. Open a lead in admin, click Generate & Copy Link → confirm `payments` + `payment_links` rows + URL points to `/payment/<leadCode>`.
2. Visit the URL, post to PayU test, complete a sandbox UPI/test card payment.
3. Confirm webhook flips `payments.status='paid'`, fills new PayU columns, creates application if missing, generates invoice with snapshot columns set, enqueues both emails 30s apart, and lead lands at `welcome_mail_sent`.
4. Force a failure (negative test) → `payment_links.status='failed'`, lead stays/returns to `payment_pending`, error logged (but not in webhook_error_log unless it's a code error).
5. Re-POST the same webhook payload → second call returns OK without double-writing (idempotency check on `status='paid'` already in place).

## Out of scope this plan
- PART 2 admin UI redesign (status badges, KPI cards, lead-detail layout, design tokens, modals, slide-overs)
- Renaming `razorpay_order_id/payment_id/signature` columns
- Switching `/api/public/webhooks/payu` to a Supabase Edge Function
- SMS gateway integration (WhatsApp share via `wa.me` only; no Twilio/MSG91 wiring)
