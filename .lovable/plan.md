# Switch PayU to LIVE

PayU support wants a ₹1 verification transaction on the **live** gateway (`secure.payu.in`) using your live merchant key + salt. The code currently defaults `PAYU_MODE` to `"test"` and the `PAYU_MODE` secret is set to `test`, so the form posts to `test.payu.in` — which your browser is refusing (likely ISP/DNS/PayU sandbox restriction on test.payu.in for live-onboarded merchants).

## Changes

1. **`src/lib/payments/payu.server.ts`** — change the fallback default for `PAYU_MODE` from `"test"` to `"live"`, so if the secret is ever missing the safer behavior is live (matches your current onboarding stage).

2. **Update the `PAYU_MODE` secret to `live`** via `secrets--update_secret`. This flips `PAYU_BASE_URL` to `https://secure.payu.in/_payment` immediately — no other code touched.

3. **No changes** to hash logic, txnid format, surl/furl, or webhook handler — they are gateway-agnostic.

## Verification

After the secret update:
- Reload `/apply/UA-2026-001021/summary` and click Pay.
- Form `action` in the hidden form (visible in network tab) should now be `https://secure.payu.in/_payment`.
- Use a real card / UPI for the ₹1 transaction PayU asked for. Share the resulting `mihpayid` with your PayU KAM.
- Webhook `/api/public/webhooks/payu` will mark the payment paid on success.

## Out of scope

- In-app TEST/LIVE toggle UI.
- Reverting back to test (if needed later, just update the `PAYU_MODE` secret to `test` — no redeploy of code required).
