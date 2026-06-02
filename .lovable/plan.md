# Test PayU webhook end-to-end with ₹1 sandbox payment

The webhook (`/api/public/webhooks/payu`) is already implemented — it verifies the response hash, marks the payment row paid, updates lead + application, generates the invoice, and redirects to `/success/:leadCode`. The goal now is to (a) flip back to **test mode**, (b) simulate a signed PayU callback so we know the handler works without depending on PayU's UI, then (c) do one real ₹1 test transaction.

## Changes

### 1. Switch back to TEST mode
- Update the `PAYU_MODE` secret to `test` so the form posts to `https://test.payu.in/_payment`.
- `PAYU_MERCHANT_KEY` / `PAYU_MERCHANT_SALT` must hold your PayU **test/sandbox** credentials (from PayU dashboard → Test Console). If they're currently live values, I'll prompt you to update them via the secrets form.

### 2. Harden the webhook handler (small fixes)
File: `src/routes/api/public/webhooks/payu.ts`
- **Redirects are currently relative paths** (`/success/...`). PayU's browser POST originates from `test.payu.in`, so a relative `Location` is resolved against the browser context — works, but fragile. Switch to **absolute URLs** using `APP_BASE_URL` (or fall back to the published domain), matching what `surl`/`furl` already do.
- **Tolerate amount mismatch detection**: log a warning if `Number(form.amount) !== Number(payment.amount)` so we catch tampering attempts (no behavior change, just a log).
- **Always return 200 to PayU's S2S** when called without a browser context (PayU's S2S retries on non-2xx). Detect S2S vs browser by `Accept` header / absence of cookies, and respond `"OK"` 200 instead of a 303 redirect for the S2S call. Browser-initiated POST (from `surl`) still gets the 303.

### 3. Build a webhook test script
File: `scripts/payu-webhook-test.ts` (new, exec-only — not part of the app bundle)
- Reads `PAYU_MERCHANT_KEY` / `PAYU_MERCHANT_SALT` from env.
- Loads the latest `created` payment row for lead `UA-2026-001021` (₹1, already exists).
- Builds a `success` PayU response payload, computes the correct response hash, and POSTs it as `application/x-www-form-urlencoded` to the **published** webhook URL `https://everythinghappensqindiaserver4cored.lovable.app/api/public/webhooks/payu`.
- Prints the response and then queries the `payments` table to confirm `status = 'paid'`, `razorpay_payment_id` set, and that the invoice was generated.

This proves the handler works end-to-end without needing PayU's UI.

### 4. Real ₹1 sandbox payment
After steps 1–3 pass:
- Open `/apply/UA-2026-001021/summary` (already ₹1 total).
- Click **Pay** → browser posts to `test.payu.in/_payment`.
- Use a PayU sandbox test card (e.g. `5123 4567 8901 2346`, CVV `123`, expiry `05/30`, OTP `123456`).
- On success, PayU posts back to `/api/public/webhooks/payu`, handler marks payment paid, browser lands on `/success/UA-2026-001021`. PayU also fires the S2S callback to the same URL — handler is idempotent so the second call is a no-op.

## Verification checklist (I'll run after each step)
- [ ] `PAYU_MODE` secret = `test`, form `action` in network tab = `https://test.payu.in/_payment`.
- [ ] Webhook test script: response 303 (or 200 for S2S simulation), DB row flipped to `paid`, invoice generated.
- [ ] Real ₹1 transaction completes, `/success/...` page loads, lead status = `payment_successful`.

## Out of scope
- Razorpay / Cashfree wiring.
- Refund webhook handling.
- Per-environment admin toggle UI.
- Pre-creating a separate dedicated ₹1 test lead (the existing UA-2026-001021 already totals ₹1).
