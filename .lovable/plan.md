## Root cause

The build infra error (`no providers available`) is a transient Lovable Cloud sandbox hiccup — not a code issue. Retrying the build clears it.

The **real bug** is in `/admin/orders`: my Stage 3 edit to `listOrdersV2` filters on `leads.payment_successful_at IS NOT NULL`, but that column does not exist on the `leads` table. The Orders page throws at runtime.

The actual "payment successful" signal lives in `public.payments` as `status = 'paid'` (DB confirms: 8 paid, 6 failed, 2 created).

## Fix

Rewrite the Orders backend filter in `src/lib/crm/orders-v2.functions.ts` to use payments instead of the non-existent column:

1. Drop the inner-join on `leads.payment_successful_at`.
2. First query `payments` for distinct `application_id` where `status = 'paid'` (apply the same date window for efficiency).
3. Then query `applications` with `.in('id', paidApplicationIds)` plus all existing filters (fulfillment status, service, assignee, search).
4. Keep the rest of the enrichment (leads, customers, services, staff, payments) unchanged.
5. Remove `payment_successful_at` from the leads enrichment select.

Result: Orders list shows only applications with at least one successful payment, matching the spec, with zero schema changes.

## Verification

- `tsgo --noEmit` passes.
- Hit `/admin/orders` in preview — list loads, only paid-customer orders appear, count reflects filtered total.
- Confirm pagination still works with the new pre-filter.
