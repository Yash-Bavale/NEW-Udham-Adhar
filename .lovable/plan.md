## Goal

Keep the existing **Payment Successful** UI (the screenshot you shared — green tick + "Action Needed: We need a few details" + "Start Onboarding" CTA). On top of that, properly handle the two other outcomes coming back from PayU: **pending** (webhook delayed / awaiting confirmation) and **failed** (PayU returned `failure` or signature mismatch).

Today everything that isn't a clean success gets dumped into `/payment-pending/$leadCode`, which shows a generic "we'll contact you" message — wrong for both a real failure and a real pending state.

## Changes

### 1. `src/routes/success.$leadCode.tsx` — keep, just clarify pending fallback
- Keep the current success UI exactly as in your screenshot (green check, Action Needed card, Start Onboarding button, collapsible receipt).
- Polling logic stays. If after ~30s the payment is still not marked paid, redirect to `/payment-pending/$leadCode` (already does this) — but pending page will now look correct (see #2).

### 2. `src/routes/payment-pending.$leadCode.tsx` — rewrite as true "Pending / Confirming" state
New UI:
- Amber/blue spinner hero: **"Confirming your payment…"**
- Sub-line: "PayU is still confirming the transaction. This usually takes under a minute."
- Reference number shown.
- Auto-poll `getApplicationSummary` every 4s; the moment payment flips to paid → redirect to `/success/$leadCode` (which then shows the success UI + onboarding CTA).
- After ~2 min still pending → show secondary block: "Taking longer than usual" with two actions: **Retry Payment** (→ `/payment/$leadCode`) and **Contact Support** (→ `/contact`). Reassurance: "If money was deducted, it will be auto-reconciled — do not pay twice."

### 3. New `src/routes/payment-failed.$leadCode.tsx`
- Red X hero: **"Payment Failed"**.
- Reads `?reason=` query param to show PayU's failure reason (e.g. "Card declined", "Insufficient funds").
- Reference number + service summary (via `getApplicationSummary`).
- Primary CTA: **Retry Payment** → `/payment/$leadCode`.
- Secondary CTA: **Contact Support**.
- Reassurance line: "No amount has been charged. If your account shows a debit, it will auto-refund in 3–5 business days."

### 4. `src/routes/api/public/webhooks/payu.ts` — split pending vs failed redirects
- Currently `redirectToFailure` sends users to `/payment-pending` regardless. Split into two helpers:
  - `redirectToFailure(leadCode, reason)` → `/payment-failed/$leadCode?reason=…` (used when PayU `status=failure` or signature mismatch).
  - `redirectToPending(leadCode)` → `/payment-pending/$leadCode` (only used when status is unknown / still processing).
- Signature-verification failure also goes to `/payment-failed` (not pending) since it's a hard error.

### 5. `src/routes/payment.$leadCode.tsx` — quick guard
- On mount, if `getApplicationSummary` shows lead is already `paid`, auto-redirect to `/success/$leadCode` instead of re-showing the pay form (prevents double-payment loop after a successful txn).

## Route summary after change

```text
/payment/$leadCode          → pay form (skips if already paid)
/success/$leadCode          → ✅ confirmation + Start Onboarding (unchanged UI)
/payment-pending/$leadCode  → ⏳ confirming, auto-redirect on success
/payment-failed/$leadCode   → ❌ failed, retry CTA
```

No DB / business-logic changes. Frontend + one webhook redirect tweak only.
