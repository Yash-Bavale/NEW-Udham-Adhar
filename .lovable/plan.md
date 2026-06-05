
# CCAvenue Payment Gateway Integration

Pause Phase 5.5e. Add CCAvenue alongside PayU using the existing
`payment_gateways` + `payments` schema and the gateway-agnostic
initiator. PayU stays live; the customer picks gateway on the
`/apply/:leadCode/summary` page. Live mode only (no test env).

## Secrets (added via secrets tool, not committed)

- `CCAV_MERCHANT_ID`
- `CCAV_ACCESS_CODE`
- `CCAV_WORKING_KEY` — used as the AES-128-CBC key for request/response crypto

## Database (single migration)

1. Seed `payment_gateways` with a `ccavenue` row (`display_name: "CCAvenue"`,
   `is_enabled: false`, `priority: 20`, `webhook_secret_name: 'CCAV_WORKING_KEY'`).
   Admin enables it from `/admin/gateways` once smoke-tested.
2. No table shape changes — `payments` already stores `gateway_name`,
   `transaction_id`, `gateway_order_id`, `gateway_response_json`, `status`,
   `amount`, `paid_at`, `failure_reason`, etc.

## Files to add

### Server-only crypto + REST helpers — `src/lib/payments/ccavenue.server.ts`
- `getCcavCreds()` — reads the three env vars, throws if missing.
- `encryptRequest(plaintext, workingKey)` / `decryptResponse(cipherHex, workingKey)` —
  AES-128-CBC with MD5-derived key and the CCAvenue-standard fixed IV
  (`0x00..0x0f`), using Node `crypto` (Worker-safe).
- `buildOrderForm(params)` — builds the `merchant_id|order_id|amount|currency|...`
  pipe-delimited string CCAvenue expects, returns
  `{ encRequest, accessCode, redirectUrl: "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction" }`.
- `callOrderStatusApi(orderNo)` — POSTs to
  `https://api.ccavenue.com/apis/servlet/DoWebTrans` with `command=orderStatusTracker`,
  decrypts the response, returns normalized
  `{ status, amount, orderNo, trackingId, bankRefNo, raw }`.
- `callRefundApi({ refNo, refundAmount, refundRef })` — same DoWebTrans envelope
  with `command=refundOrder`; returns normalized refund result.
- `normalizeCcavStatus(raw)` → `"paid" | "failed" | "pending" | "refunded"`.

### Server function — `src/lib/payments/ccavenue.functions.ts`
- `createCcavenueOrder({ leadCode })` — mirrors `createPayUOrder`:
  - loads lead by code, computes amount from `total_amount`
  - generates `order_id` (`CCAV-<leadCode>-<timestamp>`)
  - inserts a `payments` row (`gateway_name: 'ccavenue'`, `status: 'initiated'`)
  - builds redirect URL + encrypted payload
  - returns `{ method: "POST", action, fields: { encRequest, access_code } }`
    so the existing client form-poster can submit it.

### Initiator wiring — `src/lib/payments/initiate.functions.ts`
- Replace the `"ccavenue"` rejection branch with a real call to
  `createCcavenueOrder`. Keep `payu` branch untouched. Update the
  `InitiatePaymentResult` type to a union of both order shapes.

### Public webhook / return — `src/routes/api/public/webhooks/ccavenue.ts`
- POST handler reads `encResp` from form data, decrypts with working key,
  parses the `key=value&...` payload.
- Match `order_id` → payments row; verify amount; map `order_status`
  (`Success` / `Aborted` / `Failure` / `Invalid` / `Awaited`) to our enum.
- On hash/amount mismatch or `Awaited`, call `callOrderStatusApi` to
  reconcile (mirrors the PayU verify-after-mismatch behaviour).
- Update `payments`, update `leads.status`, transition the application
  (`payment_successful` reason), enqueue invoice + success email — reuse
  the helpers already imported by the PayU webhook.
- After processing, 302 redirect the browser to
  `/apply/:leadCode/payment-status` (CCAvenue posts to a single URL for
  both browser-return and S2S, like PayU).

### Admin refunds — extend `src/lib/crm/payments.functions.ts`
- Add `refundPayment({ paymentId, amount, reason })` guarded by
  `requireSupabaseAuth` + `assertRole(["super_admin","admin","accounts"])`.
- Route by `gateway_name`: `ccavenue` → `callRefundApi`; `payu` → existing
  refund or throw "not implemented" placeholder.
- On success, insert a child `payments` row (`status: 'refunded'`, negative
  amount, parent ref in metadata), write an audit log, mark the original
  payment `refunded` / `partially_refunded`.
- Surface a "Refund" button on the existing finance/payments admin row
  (small UI add — confirm dialog + amount input).

### Optional reconciliation helper
- `reconcileCcavenuePayment({ paymentId })` server fn that calls
  `callOrderStatusApi` and updates the row. Wire to a "Sync status" button
  on the admin payment row.

## Customer-facing checkout

`/apply/:leadCode/summary` already lists enabled gateways. Once the seed
flips `is_enabled` to true, CCAvenue appears as a selectable option with
the existing card layout. The current form-poster component handles
`{ method, action, fields }` for both gateways without change.

## Verification steps after build

1. Smoke a low-value live order end-to-end (CCAvenue requires live for
   real cards). Confirm webhook decrypts, `payments` row flips to `paid`,
   lead → `payment_successful`, invoice + email trigger.
2. Trigger the Status API from admin and confirm normalized fields.
3. Issue a partial refund; confirm child row + parent status update.
4. Confirm PayU flow is still intact (no regression in shared initiator).

## Open items I'll need from you before/during build

- The three CCAvenue secret values (entered via the secrets prompt).
- CCAvenue's "Response URL" must be set in their dashboard to
  `https://<your-domain>/api/public/webhooks/ccavenue` — I'll show you the
  exact URL after wiring.
- For Refunds API, CCAvenue requires the server's outbound IP to be
  whitelisted in their dashboard.
