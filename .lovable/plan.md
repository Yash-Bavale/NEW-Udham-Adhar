## Goal

When staff changes the service on an order (pre form-submission), send a dedicated **Service Changed** email instead of reusing the E001 order confirmation, and handle three pricing scenarios with clear UI + payment-adjustment logic.

## The three scenarios

Let `paidSum` = total successful payments so far, `newTotal` = new service price, `delta = newTotal − paidSum`.


| Case                           | Condition      | Money action                                                               | Email content                                                                                                             | Form link                                  |
| ------------------------------ | -------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **A. Same price**              | `|delta| ≤ ₹1` | None                                                                       | "Your service was updated as {service name}"                                                                              | New service form link                      |
| **B. Downgrade** (new cheaper) | `delta < −₹1`  | No refund (per existing policy). Mark order as fully paid for new service. | "Your service was updated as {service name}"                                                                              | New service form link                      |
| **C. Upgrade** (new costlier)  | `delta > ₹1`   | Create a **top-up payment link** for exactly `delta`.                      | Adjustment table: Previous service + amount paid, New service + new total, Balance due = delta, CTA button → top-up link. | Form link shown only after top-up is paid. |


## Deliverables

### 1. New email template `service-changed.tsx` (code `E011`)

Location: `src/lib/email-templates/service-changed.tsx`, registered in `registry.ts` and also seeded into `email_templates` DB table as `service_changed` so `enqueueFromTemplateInternal` can resolve it.

Matches existing template theme (same header, container, brand button, footer used by client-info-request / order_confirmation). Variants driven by a single `mode: "same" | "downgrade" | "upgrade"` prop:

- Common header: "Your service has been updated"
- Summary block: Previous service → New service, Order #
- Adjustment table (only for upgrade):
  - Amount already paid
  - New service total
  - Balance due (upgrade)
- CTA:
  - Upgrade → "Pay balance ₹X" 
  - Same/Downgrade → "Continue to form" → onboarding link
- Support line + signature identical to other templates.

### 2. Update `changeOrderService` in `src/lib/crm/orders-v2.functions.ts`

- Compute `mode` from delta.
- **Upgrade**: keep current top-up `payment_links` creation; pass `top_up_url` (points to `/payment/<leadCode>` which already handles balance) + `balance_due` into vars. Do NOT regenerate invoice yet (invoice regenerates after top-up payment webhook fires).
- **Same price**: skip invoice regeneration (nothing changed financially).
- **Downgrade**: skip invoice regeneration (nothing changed financially).
- Replace `enqueueFromTemplateInternal("order_confirmation", ...)` call with `"service_changed"`, passing `mode` and appropriate vars. Drop invoice attachment for upgrade case (final invoice comes after balance paid).
- Return shape gains `mode` and `topUpUrl` for the dialog.

### 3. Update `ChangeServiceDialog.tsx`

Before submit, show a **preview panel** once a new service is picked:

```
Current paid:   ₹1,180
New total:      ₹1,770
─────────────────────
Balance due:    ₹590   [Upgrade badge]
```

Three colored states (emerald=same, amber=upgrade, slate=downgrade) with plain-English explanation of what will happen (email + payment link / no action / no refund). Submit button label adapts: "Change & send balance link" / "Change service" / "Change (no refund)".

Success toast summarises mode + whether the top-up link + email were sent; existing cache invalidations kept.

## Technical notes

- Top-up link already reuses `/payment/<leadCode>`; the payment page reads the current lead `total_amount` (now the new service price) and the payments table dedupes against `paidSum`, so the customer pays exactly the delta — no changes needed there.
- `email_templates` seed row for `service_changed` added via a small migration so DB-driven template resolution works alongside the React component in `TEMPLATES`.
- No changes to `payments`, `invoices`, or webhook code. Existing invoice regeneration flow post-payment already fires E001 with the new amount for upgrades.
- No schema changes beyond the one `email_templates` insert.

## Out of scope

- Actual refund automation for downgrades (policy remains "no refund").
- Changing service after form is submitted (still blocked by existing guard).