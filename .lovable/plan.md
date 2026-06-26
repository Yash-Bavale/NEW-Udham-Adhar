## Root cause

Both bugs trace to a single broken DB query in `src/lib/crm/orders-v2.functions.ts`.

The leads `select(...)` (in both `listOrdersV2` and `getOrderDetailV2`) requests a column `payment_successful_at` that **does not exist on `public.leads`** (verified via schema). PostgREST returns an error, the join arm returns `data: []` / `null`, and downstream we lose:

- `lead.name` / `lead.mobile` / `lead.email` → entire Orders list shows "—", Order detail header shows "—", customer mini-card shows "—".
- `lead.lead_source` / `lead.service` → `isUnconvertedConsultationLead(lead)` returns `false` for every order, so the **Talk-to-Expert** Convert panel never renders, and the regular Form Submission / Fulfillment panels render instead (the "not submitted" UI the user is seeing on Talk-to-Expert orders).

So fixing the broken select restores both: the customer name/mobile/email everywhere AND the Talk-to-Expert workspace flow (convert card visible, generic form panel hidden until staff selects the real service).

## Fix (frontend/server-fn only — no schema changes)

**File: `src/lib/crm/orders-v2.functions.ts`**

1. In `listOrdersV2` — leads select (line ~127): drop `payment_successful_at` from the column list.
2. In `getOrderDetailV2` — leads select (line ~219): drop `payment_successful_at`.
3. Derive `payment_successful_at` from already-fetched payments:
   - For list rows: take the earliest `payment_date` among payments whose `status` is `paid|success|successful` for that application; pass that into `computeOrderStage` instead of `lead.payment_successful_at`.
   - For detail: same derivation from the `paysRes` array; pass into the computed-stage usage in `admin.orders.$orderId.tsx` (already reads from `lead?.payment_successful_at` in `timestamps.payment_done`) — instead synthesize it server-side and return it as `paymentSuccessfulAt` on the detail payload, then read that in the route.

**File: `src/routes/admin.orders.$orderId.tsx`**

4. Use the new `paymentSuccessfulAt` from the detail payload for the `timestamps.payment_done` tooltip (replace the `lead?.payment_successful_at` reference).

No other changes. Talk-to-Expert detection logic, ConvertConsultationPanel, ConsultationContactStrip, and the conditional that hides `FormSubmissionPanel` + `FulfillmentStatusUpdater` + `ProcessingChecklist` for unconverted consultation leads are already in place and will start working as soon as `lead` is non-null.

## Verification

- Re-load `/admin/orders` → Customer column shows real names + mobile.
- Open the order in the screenshot (`AP-2026-006606`) → header shows "Sidheshwar Jambkar · 9270716030 · Update Udyam Certificate"; right-side Customer card shows name/mobile/email.
- Open a real Talk-to-Expert order → amber **Set Customer's Service** card shows at the top, contact strip shows name+mobile+email with Call/WhatsApp/Email actions, and the "Form Submission — not submitted" panel is hidden until staff picks the real service.
