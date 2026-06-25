## Goal

Two scoped changes for the staff console:

1. **Show Aadhaar in full** — stop masking the 12‑digit number / bank account anywhere staff view it.
2. **Hide payments and invoices from employees** — operations and support roles should not see any monetary information, payment status, or invoice artifacts. Admin, super_admin, accounts, and finance keep full visibility.

## Scope of "employee"

Same definition already used by the order workspace:
```
hideMoney = role.hasAny(["operations","support"]) && !role.hasAny(["super_admin","admin","accounts","finance"])
```
This is the rule that will gate every payment/invoice surface listed below.

## Changes

### 1. Unmask Aadhaar (and related sensitive numbers)

- `src/components/admin/FormSubmissionPanel.tsx` — `MASKED_FIELDS` is emptied; `mask()` becomes a plain string formatter so Aadhaar, bank account, etc. render in full.
- `src/lib/crm/formDisplayConfig.ts` — `maskValue()` returns the raw value; `Reveal` flow becomes a no‑op (value always shown). Field configs keep their `mask` metadata so future reversal is one‑line.
- `src/routes/admin.customers.$customerId.tsx` — drop `maskAadhaar` wrapping on notes and document names (it was incidentally redacting any string with 12 digits).
- `src/lib/crm/mask.ts` — kept but marked deprecated (other callers can be removed later); no behavior change required this turn beyond the call sites above.

No DB or server function changes — masking was purely presentational.

### 2. Hide payments & invoices from operations/support

Order workspace (`src/routes/admin.orders.$orderId.tsx`):
- Already hides ₹ total, OrderPaymentsPanel, payments in UnifiedTimeline, and the "Payment received" checklist row.
- Add: hide the **Payment status chip** in `OrderCommandHeader` when `hideAmount` is true (pass through and gate the `<Meta label="Payment">` block).
- `OrderDocumentsPanel` — when `hideAmount`, suppress any document row whose `doc_type` is `invoice` / `tax_invoice` (defensive — invoices are usually stored in the invoices table, not documents, but the panel renders whatever is attached).

Customer profile (`src/routes/admin.customers.$customerId.tsx`):
- Read `useRole()`, compute the same `hideMoney` flag.
- When `hideMoney`:
  - Skip the "Invoices" stat card in the KPI row.
  - Skip the entire "Invoices (n)" section.
  - Hide any amount columns on the Payments section (or hide the whole Payments section — see Question below).

My Work (`src/routes/admin.my-work.tsx`) and any operations list views:
- Audit for ₹ / invoice columns; gate the same way. (Spot check confirmed no direct invoice rendering today, but the audit closes the loop.)

Sidebar (`src/components/admin/AdminShell.tsx`):
- Already gated by `FINANCE_ROLES`; no change.

### Verification

- Sign in as a `support` user → open `/admin/orders/<id>` and `/admin/customers/<id>`: no ₹, no payment chip, no invoice section.
- Sign in as `admin` → same pages show payment chip, totals, invoice section, and full Aadhaar.
- Spot‑check `FormSubmissionPanel`: Aadhaar field renders as `1234 5678 9012`, not `XXXX XXXX 9012`.

## Question

For operations/support on the customer profile, should the **Payments section** be:
- (A) hidden entirely, or
- (B) shown with amount columns blanked (so they can still see "a payment exists" and its date/status)?

Default if you don't answer: **(A) hidden entirely** — matches how the order page hides `OrderPaymentsPanel` outright.
