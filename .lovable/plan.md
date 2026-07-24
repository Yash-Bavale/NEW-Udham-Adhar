
## Goal

Fix Executive Dashboard: correct KPI logic (Unique Leads, Orders, Order Alerts, Support Tickets, Active Staff, Orders Not Contacted), tighten card layout (icon inline with value + inline delta), and make every KPI clickable — both the whole card and each sub-chip — deep-linking to the right list with the right filter.

## 1. Correct the metric logic (`src/lib/crm/super-admin.functions.ts`)

- **Unique Leads → Not Contacted / Contacted / Converted (from `leads.status`, not `lead_attribution`)**
  Current code counts "not contacted" as `uniqueLeads − leadsWithFirstContact`, so it stays at 23 even after employees change the lead status. Switch to counting directly from `leads.status` within the range (`is_duplicate = false`):
  - `notContacted`: `status in ('new_lead','lead_created')`
  - `contacted`: `status = 'contacted'`
  - `converted`: `status in ('payment_successful','under_process','completed','details_pending','documents_pending','under_review')`
  Show all three as sub-chips on the card.

- **Rename "Paid Orders" → "Orders"**
  Keep the same underlying paid-payments count (an order = payment successful). Only the label and internal key rename.

- **Order Alerts (payment-successful only)**
  Current query counts any application older than 3d/7d that isn't completed/closed — includes unpaid leads, producing the 7,322 figure. Restrict to applications tied to a successful payment. Use `applications` filtered by `id in (select application_id from payments where status='paid')` and same age buckets. Result should be small realistic numbers.

- **Support Tickets Raised — show live active count**
  Add `ticketsActive` = tickets whose `status not in ('closed','resolved')` (not date-bounded), display that as the headline value. Keep `Closed` and `Pending 3+d` as sub-chips. `ticketsRaised` in range stays as delta baseline.

- **Active Staff (signed in today IST)**
  Fix `auth.users.last_sign_in_at` access — the `admin.schema("auth")` call needs verification; if it returns 0 rows, fall back to querying `auth.users` via `supabaseAdmin.auth.admin.listUsers()` and filter `last_sign_in_at >= todayStartIso` intersected with staff role ids. Also expose `staffSignedInToday` explicitly.

- **Orders Not Contacted (payment successful only)**
  Current query uses `fulfillment_status='order_received'` — matches unpaid orders too, hence 999+. Restrict to applications where a paid payment exists AND no `lead_contact_events` after payment. Buckets: 3+ hrs, 5+ hrs.

## 2. Compact card layout (`src/components/admin/SuperAdminDashboard.tsx` → `ModernKpi`)

Current: icon top-left, delta top-right, then label, then a large value, then chips → tall card, uneven heights.

New layout inside each card:
```
[icon]  LABEL                        [▲/▼ delta]
[icon]  VALUE (2xl, inline with icon on same row)
[chip] [chip] [chip]
```
- Move icon inline with the value (icon size 5, chip background) so the value row is icon + number.
- Keep the tiny delta pill anchored top-right on the same row as the label.
- Reduce padding `p-4 → p-3`, `rounded-2xl → rounded-xl`, `size-9 → size-8` for icon chip.
- Force uniform height with `min-h-[112px]` and `grid-auto-rows`; drop the third-line footer to a subtle 10-px muted line only when present.

## 3. Make KPIs click-through

Wrap `ModernKpi` in a `<Link>` (or `useNavigate`) driven by two new props: `href` for the whole card and `subs` items that carry their own `href`. `StatChip` accepts an optional `href` and renders as a link when set. Clicking a chip stops propagation so it doesn't fire the card link.

Targets:
| KPI | Card click | Sub-chip clicks |
|---|---|---|
| Unique Leads | `/admin/leads` | Not Contacted → `?filter=not_contacted`; Contacted → `?status=contacted`; Converted → `?filter=converted` |
| Orders | `/admin/orders` | Pending → `?filter=pending`; Closed → `?filter=closed` |
| Technical Delay | `/admin/orders?filter=technical_delay` | Customer Delay → `?filter=customer_delay`; Form Not Submitted → `?filter=form_not_submitted` |
| Order Alerts | `/admin/orders?filter=delayed_3d` | 3+ Days / 7+ Days |
| Support Tickets Raised | `/admin/support/tickets` | Closed / Pending 3+d → same list with status filter |
| Refund Requests | `/admin/refunds` | Accepted / Rejected → status tab |
| Email Delivery | `/admin/help/email-matrix` | Sent / Queued / Failed |
| Active Staff | `/admin/performance` | Total / Inactive |
| Orders Not Contacted | `/admin/orders?filter=not_contacted` | 3+ hrs / 5+ hrs |
| Revenue | `/admin/finance` (or existing revenue page) | — |
| Conversion % | `/admin/leads?filter=converted` | — |
| Webhook Errors | `/admin/help/webhooks` (existing) | — |
| Gateway Status | `/admin/settings/payments` | — |

## 4. Wire the filters at the destinations

- `src/routes/admin.leads.index.tsx`: add `validateSearch` with `status` and `filter` (`not_contacted | contacted | converted`); on mount, hydrate the existing local `status`/`search` state from URL so the pre-filter shows immediately.
- `src/routes/admin.orders.index.tsx`: add `validateSearch` for `filter` (`pending | closed | technical_delay | customer_delay | form_not_submitted | delayed_3d | delayed_7d | not_contacted`) and translate each into the existing filter/where clauses on the page.
- Support tickets / refunds routes already accept status tabs — pass through via search param.

## 5. Types

Update `SuperAdminOverview.metrics` to add `leadsContacted`, `leadsConverted` (from `leads.status`), rename `paidOrders*` remains internally but UI label changes, add `ticketsActive`, `staffSignedInToday` (alias). Adjust `KpiGrid` reads accordingly.

## Out of scope

- No changes to charts, alerts, activity, top-services cards.
- No design-token rewrite — keep existing tone palette.
- No new backend tables.

## Technical notes

- Leads status enum values come from `src/lib/crm/types.ts` (`LEAD_STATUSES`); use those exact strings in filters.
- For the "Orders" (paid-only) subqueries, add a pre-fetched `Set<paidAppIds>` once per handler and reuse — avoid N round-trips.
- `admin.auth.admin.listUsers()` supports pagination; page through until `< perPage` returned, then filter by role ids. Cache result inside the single request.
