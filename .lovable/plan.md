## Problem

On the order detail page, a **support** user still sees:
- `TOTAL ₹1` and the green **Paid** chip in the sticky header
- The entire **Payments & Invoices** panel (right column)
- The **Payment received · ₹1 · payu · paid** entry in the unified Timeline

Root cause in `src/routes/admin.orders.$orderId.tsx`:

```ts
const hideAmount = role.hasAny(["operations","support"]) && !role.hasAny([...moneyRoles]);
```

This is **opt-in to hide**. While `useRole` is still loading (`roles = []`), `hasAny(["operations","support"])` is `false`, so `hideAmount = false` → money renders for one paint and stays rendered (React Query keeps the empty roles array until the query resolves on public-session boots). It also doesn't cover `executive` / `manager`, who per `src/lib/roles.ts` also must not see money.

We already have the correct helper: `role.hideMoney()` returns `!canSeeMoney(roles)` — i.e. **default-hide** until a money role is proven. That is the single source of truth and matches the rule baked into `src/lib/roles.ts`.

Separately, the user wants clicking the "Lead" pointer on the order header to clearly open that specific lead's profile (it already routes to `/admin/leads/$leadId`, but the link is tiny and easy to miss next to the service name).

## Changes

### 1. `src/routes/admin.orders.$orderId.tsx`
- Replace the local `hideAmount` calculation with `const hideAmount = role.hideMoney();`.
- Keep all existing prop wiring (`OrderCommandHeader`, `OrderPaymentsPanel`, `OrderDocumentsPanel`, `UnifiedTimeline payments`, `ProcessingChecklist`) — they already accept `hideAmount` / `hideMoney`. Default-hide now propagates everywhere.

This alone fixes:
- TOTAL + Payment chip in header (already gated by `!hideAmount`)
- "Payments & Invoices" panel (already gated by `{!hideAmount && <OrderPaymentsPanel/>}`)
- "Payment received" timeline entry (UnifiedTimeline receives `payments={[]}`, so the row never renders)
- Invoice docs in the documents panel (already filtered by `hideMoney`)

### 2. `src/components/admin/OrderCommandHeader.tsx`
Make the "Lead" pointer obviously clickable so staff can jump to the originating lead from the order:
- Render the existing `<Link to="/admin/leads/$leadId">` as a small pill (border + hover background) instead of inline text, with label "Open Lead" and the external-link icon. No route change — purely presentational so it's discoverable.

### 3. Sanity sweep (no behavior change expected, just verify gates use `role.hideMoney()` consistently)
Re-grep these files to confirm no remaining `hasAny(["operations","support"])`-style local computations are used for money gating; if any are found in the order/lead workspace, switch them to `role.hideMoney()` too:
- `src/components/admin/ProcessingChecklist.tsx`
- `src/components/admin/OrderDocumentsPanel.tsx`
- `src/routes/admin.customers.$customerId.tsx`
- `src/routes/admin.leads.$leadId.tsx`

## Verification

1. Sign in as a **support** user, open the same order shown in the screenshot.
   - Header shows Created + Assigned only (no TOTAL, no Payment chip).
   - Right column has no "Payments & Invoices" card.
   - Timeline has no "Payment received" row.
   - Invoice PDFs do not appear in Documents.
2. The "Open Lead" pill next to the customer/service line navigates to `/admin/leads/<that lead's id>`.
3. Sign in as **admin** — money UI and invoice PDFs all reappear unchanged.

## Out of scope

Server-side gating of `getLeadFinance` / invoice endpoints — already enforced (returns `{ payments: [], invoices: [], settlements: [] }` for non-finance roles). This change is UI-only.
