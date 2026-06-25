Operations/support staff still see money in several places. Apply a single `hideMoney` rule (role in operations/support AND NOT in super_admin/admin/accounts/finance) across the remaining leaks. Sidebar finance section is already role-gated, and order detail already partially gated — extend to the rest.

## Changes

### 1. `src/lib/roles.ts`
Add a small helper `canSeeMoney(roles)` and `hideMoneyFor(roles)` so every surface uses the same rule and we don't repeat the inline check.

### 2. Lead detail — `src/routes/admin.leads.$leadId.tsx`
- Hide the **Finance** tab (`TabsTrigger` + `TabsContent`) when `hideMoney`.
- In the Overview "Service & Pricing" `LeadEditableCard`, drop `base_amount`, `gst_amount`, `total_amount` fields when `hideMoney` (keep only `service`).
- Default tab: if currently `workspace`, leave; no change.

### 3. Lead Workspace — `src/components/admin/LeadWorkspacePanel.tsx`
- Accept role via `useRole()` inside the panel.
- When `hideMoney`: do not render `<PaymentLinkPanel />` (it exposes pricing + creates payment links).
- In `LinkedOrderPanel` (line 658), hide the `Total ₹…` row.

### 4. Orders list — `src/routes/admin.orders.index.tsx`
- When `hideMoney`: remove the **Amount** column header + cell, and remove the **Payment** column (status chip leaks paid/unpaid which the user asked to hide alongside invoices/amounts).

### 5. Order detail — `src/routes/admin.orders.$orderId.tsx`
Already gates `OrderPaymentsPanel`, timeline payments, and header amount. Add:
- Hide the entire `order-workflow` section's payment refs — already clean; no change.
- Pass `hideAmount` to `OrderDocumentsPanel` so it filters out documents whose `doc_type` is `invoice`/`tax_invoice` (covered for customer page; replicate here).

### 6. Documents panel — `src/components/admin/OrderDocumentsPanel.tsx`
Add optional `hideMoney` prop; when true filter out invoice-type documents from the list and download buttons.

### 7. Application detail — `src/routes/admin.applications.$applicationId.tsx` (if it renders amounts/invoice/payment sections)
Apply the same `hideMoney` gating: hide amount fields, payments panel, invoice drawer trigger.

### 8. Verification
- Sign in as an `operations`/`support` user in Playwright, visit `/admin/orders`, `/admin/orders/:id`, `/admin/leads/:id`, confirm no ₹ symbol, no Finance tab, no Payments panel, no invoice documents, no payment status chip.
- Re-check as `admin` to confirm all finance UI still renders.

No business-logic or server-function changes — purely presentation gating. Sidebar Finance section is already restricted to FINANCE_ROLES so no edit needed there.
