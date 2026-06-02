## What to change

### 1) `src/routes/apply.$leadCode.summary.tsx` — remove 2-min session timer
- Delete `SESSION_SECONDS`, the `secondsLeft` state, its `useEffect` ticker, the `SessionBar` component and its render.
- Remove `sessionExpired` from the `canPay` formula so the Pay button stays enabled as long as PayU is selected and no order is in-flight.
- Remove the "Session expired — refresh to retry" branch from the Pay button label.
- Keep everything else (gateway list, GST breakdown, edit-details, hidden auto-submit PayU form) untouched — the PayU integration path (`createPayUOrder` → set `order` → auto-submit form to `order.actionUrl`) is unchanged and continues to open the gateway in the same tab without a second intermediate page.

### 2) `src/routes/success.$leadCode.tsx` — show success + onboarding CTA, not a receipt
Rebuild the page so the *first* thing the user sees after PayU returns is:
- Large green check + "Payment Successful" headline + ref code.
- A prominent **"Action needed"** card explaining we now need their business/Aadhaar details and documents to file the application, with 2–3 short bullets (e.g. "Aadhaar details", "Business info", "Supporting documents").
- A single primary CTA: **Start Onboarding →** (links to `/onboarding/$leadCode`).
- A secondary, low-emphasis **"View receipt"** disclosure (collapsible / link) that reveals the existing detailed receipt block (payment row, GST split, applicant info, print button) for users who still want it. The receipt content itself is preserved — just demoted from the default view.
- Keep `getApplicationSummary` call and print behavior intact behind the disclosure.

### 3) `src/lib/onboarding/onboarding.functions.ts` — fix false "Payment required" after onboarding submit
Root cause: `getOnboarding` decides `paid` purely from `lead.status` ∈ {`payment_successful`, `under_process`, `completed`}. If `lead.status` drifts (e.g. an admin moves it back, or a future flow writes a different status) the user is bounced to "Go to Payment" even though a successful PayU payment row exists.

Fix: make `paid` authoritative by checking the `payments` table:
- In the `getOnboarding` handler, after loading the lead, also `select id from payments where lead_id = lead.id and status = 'paid' limit 1`.
- Set `paid = !!paidPaymentRow || lead.status ∈ {payment_successful, under_process, completed}`.
- Return the same shape (just a more reliable `paid` flag); no UI change needed in `onboarding.$leadCode.tsx`.

This guarantees that once PayU has confirmed a payment (which is the source of truth), the onboarding screen never re-prompts for payment regardless of subsequent `lead.status` edits.

## Out of scope
- No changes to PayU webhook, payment table schema, or invoice generation.
- No design/route changes to `/onboarding/$leadCode/*` other than the server-side `paid` computation.
- No new timers, polling, or session UX on the summary page.
