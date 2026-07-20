
## 1. Enable "My Dashboard" for employees + make KPI cards clickable

- `src/components/admin/AdminShell.tsx`: ensure the "My Dashboard" (My Work) sidebar item is visible for every staff role (executive, manager, support, accounts, finance, operations), not just admin.
- `src/routes/admin.my-work.tsx`:
  - Wrap each KPI card in a `<Link>` with a targeted route + filter:
    - Assigned applications → `/admin/applications?assignee=me`
    - Order received (act now) → `/admin/orders?stage=order_received&assignee=me`
    - My active leads → `/admin/leads?assignee=me`
    - Unread notifications → `/admin/notifications`
    - SLA risk → `/admin/orders?sla=risk&assignee=me`
    - Documents to review → `/admin/review`
  - Add hover state (border/shadow) so cards read as interactive.

## 2. Fix "Contacted" status not persisting

Investigate `src/lib/crm/lead-transitions.ts` `markContacted` — likely writing to a column not shown in the leads list, or transition guard rejects `new_lead → contacted`. Concrete fix:
- Ensure the server fn updates `leads.status = 'contacted'` (and `contacted_at`) with `supabaseAdmin` and returns fresh row.
- After the mutation in `LeadWorkspacePanel`, invalidate `["admin.leads"]`, `["admin.lead", leadId]`, `["my-work"]`, and `["admin.dashboard"]`.
- Verify RLS grants let assignee update `status`; if not, use admin client already used elsewhere.

## 3. Remove "Form" column in Leads list

- `src/routes/admin.leads.index.tsx`: drop the `FORM` `<th>` and matching `<td>` (form_submitted pill).

## 4. Richer lead source (page path)

- `src/components/site/LeadForm.tsx`: at submit, include `source_page: window.location.pathname` (and `referrer`) into the lead insert payload / lead capture server fn.
- `src/lib/leads.functions.ts` (capture): persist `lead_source_page` column (add via migration if missing) and set `lead_source` to `"Website · <path>"` when a page is provided.
- Leads list + Customer card display `lead.lead_source_page` when present, else fall back to `lead_source`.
- Migration: `alter table public.leads add column if not exists lead_source_page text;`

## 5. Redesign Customer Details card

- `src/components/admin/LeadWorkspacePanel.tsx` `CustomerQuickCard`:
  - Two-tone header with avatar bubble, lead code + status pill, three big action buttons (Call primary, WhatsApp, Email) full-width on mobile.
  - Info grid: label muted micro-caps, value bold; mobile = 1 col, sm = 2 col.
  - Copy chips (mobile / email) as small pill-buttons next to values, not detached icons.
  - Subtle gradient border + soft shadow; sticky on desktop within its column.

## 6. Follow-up notifications fire at scheduled time

- Table `lead_followups` already exists (used by `FollowUpScheduler`). Add a pg_cron minute job that:
  - Selects due follow-ups (`due_at <= now()`, `notified_at is null`).
  - Inserts a row in `notifications` for the assignee (`type='followup_due'`, links to `/admin/leads/{id}`).
  - Sets `notified_at = now()`.
- SQL only — implemented in a single migration using `pg_cron` (Option 1 pattern). No new endpoint required.

## 7. Two SLAs: Lead and Order — action-required at 1h and 3h

New unified rule: any Lead or Order that is not yet "contacted / action taken" gets flagged.

- Migration adds two enum values or a small `sla_config` table with:
  - lead SLA: warn 1h, breach 3h since `created_at` while `status in ('new_lead','lead_created')`.
  - order SLA: warn 1h, breach 3h since `created_at` while `fulfillment_status = 'order_received'` and no action recorded.
- pg_cron minute job writes to a new `sla_alerts` table (or reuses `notifications`) at warn+breach thresholds, addressed to the assignee (fallback: all admins if unassigned).
- `getMyWorkSummary`:
  - `counters.slaRisk` = count of SLA rows for me currently in warn/breach.
  - Split into `slaLead` / `slaOrder` on the card group so employee sees both.
- Leads / Orders list rows show an amber "Take action (1h)" or red "Overdue (3h)" pill when the row is in warn/breach, driven by the same server-side computation returned in the list payload (no need to poll SLA table on the client).
- Update "SLA risk (>48h idle)" copy on the My Work card to "SLA — action needed (1h / 3h)".

## Verification

- `tsgo --noEmit` after edits.
- Manual: create a new lead, wait for cron tick locally (or call the SQL function directly), confirm notification appears and My Work counter increments; click "Contacted" and confirm the leads list badge changes to `contacted` and SLA pill clears.

## Out of scope (flagging)

- Redesigning the Orders SLA badge across every table variant — only the leads/orders index and My Work card get the new pill this pass.
- Rewriting the notifications delivery channel (email/WhatsApp push) for follow-ups — DB notification only for now; ask if you also want an email/WhatsApp ping when due.
