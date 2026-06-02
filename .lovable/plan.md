## Goal
Stop hitting the dead `test.payu.in` sandbox. Make checkout post to `https://secure.payu.in/_payment` using live PayU credentials.

## Changes

1. **`src/lib/payments/payu.server.ts`**
   - Default `PAYU_MODE` to `"live"` instead of `"test"` (still overridable via env).
   - Keep both URLs; `live` → `https://secure.payu.in/_payment`.

2. **Secrets**
   - Prompt the user to update `PAYU_MERCHANT_KEY` and `PAYU_MERCHANT_SALT` with their **live** credentials from the PayU dashboard (Settings → My Account → Merchant Key/Salt for the live profile). Test keys will NOT work on `secure.payu.in`.
   - Add `PAYU_MODE = live` as a runtime secret so it's explicit and easy to flip back later without a code change.

3. **No DB / schema changes.** The `payment_gateways` admin row (`name='payu'`, `is_enabled=true`) stays as-is.
4. **No UI changes.** Checkout button + success/failure pages already work end-to-end; they just need a reachable gateway URL.

## Verification
- After secrets are saved, click "Pay" on `/apply/UA-.../summary`. The hidden form should now POST to `https://secure.payu.in/_payment` and load the real PayU checkout.
- Webhook `/api/public/webhooks/payu` already uses the same salt for hash verification, so success/failure callbacks will validate.

## Warning
Live mode = real money. Use a ₹1 test service or PayU's live test card (if enabled on your account) for the first transaction.

## Out of scope
- Making mode toggleable from the admin DB row (can be a follow-up).
- Retry/error UX improvements on the checkout button.
