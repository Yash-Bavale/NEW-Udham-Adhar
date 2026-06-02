## What I found

The backend is healthy, but the latest lead `UA-2026-001024` has a PayU payment stuck as `created` with transaction ID `UA-2026-001024-MPWRPUO5-KGA2YJ`.

The PayU screenshot says: “This txnid has been used previously or was successfully captured.” That matches the current code: it reuses the latest `created` PayU transaction on retry. PayU requires every payment attempt to use a fresh unique `txnid`, so retries can fail before payment completion.

## Plan

1. **Stop reusing failed/stale PayU transaction IDs**
   - Change PayU order creation so every new click creates a fresh `txnid`.
   - Only block/reuse when there is already a successful paid payment for the lead.
   - Mark older `created` / `attempted` PayU rows for the same lead as `failed` or superseded before creating the new attempt.

2. **Make webhook completion more reliable**
   - Keep verifying PayU response hash.
   - Ensure successful PayU responses update:
     - payment status to `paid`
     - lead status to `payment_successful`
     - application status to `payment_received`
   - Store PayU response details for audit/debugging.

3. **Improve failed/pending return handling**
   - If PayU returns duplicate-txn or failure, record that failure in the payment row instead of leaving it as `created`.
   - Redirect customer to the app failure page with a clear retry path.

4. **Add defensive database protection**
   - Add/confirm a unique index on PayU `transaction_id` so duplicate transaction IDs cannot be inserted silently.
   - Add a safe helper migration if needed for consistent retry cleanup.

5. **Validate the flow**
   - Check the latest payment rows for the affected lead after the fix.
   - Confirm the next retry generates a different PayU `txnid` and no longer hits the “txnid used previously” issue.

## Files likely to change

- `src/lib/payments/payu.functions.ts`
- `src/routes/api/public/webhooks/payu.ts`
- One database migration if the unique transaction/index cleanup is missing