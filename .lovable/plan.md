## PayU Prebuilt Checkout — wire test keys and verify flow

Good news: the integration code is already aligned with PayU's Prebuilt Checkout doc — request hash, response hash, hidden form POST to `/_payment`, S2S/return webhook with hash verification, idempotency, and lead/application/invoice updates are all in place. We just need to swap in your test credentials and confirm the end-to-end flow on `test.payu.in`.

### 1. Replace PayU secrets with the test keys you shared
- Update `PAYU_MERCHANT_KEY` → `sMb9J9`
- Update `PAYU_MERCHANT_SALT` → `TO9dRJcB35J9Ec4PKnXKSHLw5cnc2SPy`
- Add `PAYU_MODE=test` (forces `https://test.payu.in/_payment`; flip to `live` later)

Done via `secrets--update_secret` / `add_secret` — you'll get a secure form to paste them.

### 2. Confirm gateway row
`payment_gateways.payu` is already `is_enabled=true, priority=10`. No change needed.

### 3. End-to-end verification (no code changes expected)
- `/payment/:leadCode` → calls `createPayUOrder` → auto-submits hidden form to `https://test.payu.in/_payment` with fields per doc: `key, txnid, amount, productinfo, firstname, email, phone, surl, furl, hash, udf1..udf3, service_provider=payu_paisa`.
- Hash uses doc sequence: `key|txnid|amount|productinfo|firstname|email|udf1..udf5|||||||salt`.
- PayU posts back to `surl`/`furl` = `/api/public/webhooks/payu` with `status, hash, mihpayid, bankrefnum, …`. Handler:
  - verifies response hash `salt|status||||||udf5..udf1|email|firstname|productinfo|amount|txnid|key` (with `additionalCharges` prefix when present),
  - marks `payments.status = paid|failed`, stores `mihpayid` + raw payload,
  - on success: `leads.status = payment_successful`, `applications.application_status = payment_received`, generates invoice PDF, 303-redirects to `/success/:leadCode`,
  - on failure: 303-redirects to `/payment-pending/:leadCode?reason=…`.
- `/success/:leadCode` polls until paid.

### 4. Test with PayU's sandbox cards (from the doc)
- Card: `5123 4567 8901 2346`, expiry `05/27`, CVV `123`, OTP `123456` → success
- Use any test UPI ID like `success@payu` to simulate UPI success
- Use a real lead — I'll suggest creating one via the public form, then opening `/payment/<leadCode>` to run a transaction.

### 5. Going live later (when you have live creds)
Same flow — only `secrets--update_secret` on `PAYU_MERCHANT_KEY`, `PAYU_MERCHANT_SALT`, and `PAYU_MODE=live`. Whitelist `https://everythinghappensqindiaserver4cored.lovable.app/api/public/webhooks/payu` as Success URL + Failure URL in the PayU live dashboard.

### Files touched
None — code is already doc-compliant. The only change is secret values.

### Technical notes
- `udf3` carries `leadCode` so the webhook can redirect users back to the right page without re-querying.
- `transaction_id` and `razorpay_order_id` both hold the txnid (legacy column reuse) so lookup works regardless of which one a query targets.
- Webhook returns `303 See Other` so PayU's POST becomes a GET on our success page (avoids browser "resubmit form?" warning).

Confirm and I'll switch to build mode, prompt you for the two secret values, and then we can run a live test transaction together.