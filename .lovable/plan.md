## PayU — what to check & how to proceed

Code, secrets, webhook route, invoice generator, success/failure pages are all in place. What's left is **configuration + testing + go-live**, not new code. Below is the exact order to follow.

---

### 1. Confirm what's already wired (no action needed)

- Secrets present in Cloud: `PAYU_MERCHANT_KEY`, `PAYU_MERCHANT_SALT` ✅
- Checkout route: `/payment/:leadCode` → auto-posts to PayU
- Server-to-server callback: `POST /api/public/webhooks/payu` (verifies SHA512, idempotent, updates `payments` + `leads` + `applications`, generates invoice)
- Result pages: `/success/:leadCode`, `/payment-pending/:leadCode`
- Mode defaults to `test` (uses `https://test.payu.in/_payment`)

---

### 2. Configure your PayU merchant dashboard

Log in at https://onboarding.payu.in (test) or https://merchant.payu.in (live) and set:

| Field | Value |
|---|---|
| Success URL (SURL) | `https://everythinghappensqindiaserver4cored.lovable.app/api/public/webhooks/payu` |
| Failure URL (FURL) | same as above |
| Webhook / S2S URL | same as above |
| Webhook events | `payment_success`, `payment_failure`, `payment_pending` |

Note: the app already sends SURL/FURL with each request, but PayU also validates them against the dashboard whitelist — they MUST match.

---

### 3. Test mode end-to-end (do this first)

1. Open `/payment/<lead_code>` for any existing lead with a `total_amount > 0`
2. Click **Proceed to Payment** → you should land on `test.payu.in`
3. Use PayU test cards:
   - **Success**: `5123 4567 8901 2346`, CVV `123`, expiry `05/30`, OTP `123456`
   - **Failure**: `4012 0010 3714 1112`, CVV `123`, expiry `05/30`
4. After redirect, verify:
   - Browser lands on `/success/<lead_code>` (or `/payment-pending/...`)
   - `payments` row: `status = paid`, `payment_date` set, `webhook_response` populated
   - `leads.status = payment_successful`
   - `applications.application_status = payment_received` (if app exists)
   - `invoices` row created with auto-numbered `INV-YYYY-NNNNNN`
   - Invoice PDF present in the `invoices` storage bucket

If hash mismatch shows in logs → salt mismatch between dashboard and `PAYU_MERCHANT_SALT` secret.

---

### 4. Common things to verify if a test fails

- **"Gateway not configured"** → secret missing/typo
- **"Signature verification failed"** → wrong salt, or test creds used against live URL
- **Stuck on PayU page** → SURL/FURL not whitelisted in dashboard
- **Webhook hits but lead not updated** → check `payment.lead_id` matches; inspect `webhook_response` JSON in `payments` row
- **Invoice not generated** → check server logs for `[payu] invoice generation failed`; bucket permissions

---

### 5. Switch to live (only after test passes)

1. Get production Merchant Key + Salt from PayU (separate from test creds)
2. Update secrets: `PAYU_MERCHANT_KEY`, `PAYU_MERCHANT_SALT` (replace test values)
3. Add a new runtime secret `PAYU_MODE = live` — the helper switches to `https://secure.payu.in/_payment` automatically
4. Whitelist the production SURL/FURL in the live merchant dashboard
5. Run one small real transaction (₹1 if possible), then verify the same checklist as step 3
6. Refund the test transaction from PayU dashboard

---

### 6. Suggested follow-ups (optional, after go-live)

- Add a **finance dashboard** card in `/admin` showing today's PayU collection vs failures (data already in `payments`)
- Add a **manual reconciliation** action in admin: re-fetch a transaction by `txnid` via PayU's verify API for stuck rows
- Add **email receipt**: trigger when invoice PDF is created (deferred earlier — needs email domain setup)

---

### Files involved (reference only, no changes proposed now)

- `src/lib/payments/payu.server.ts` — hash + URL helpers
- `src/lib/payments/payu.functions.ts` — `createPayUOrder` server fn
- `src/routes/payment.$leadCode.tsx` — customer checkout page
- `src/routes/api/public/webhooks/payu.ts` — S2S callback
- `src/lib/invoices/pdf.server.ts` + `src/lib/crm/invoices.functions.ts` — invoice engine

---

**Want me to switch to build mode and add anything from section 6 (admin finance card, reconciliation action), or are you going to run the test transaction first?**
