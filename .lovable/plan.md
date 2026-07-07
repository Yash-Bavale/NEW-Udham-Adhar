## Scope

Only Section #1 — **After Open Order → Employee Section** (`/admin/orders/$orderId`).
Sections #2–#7 (super-admin order view, dashboards, sidebars, support dashboard) are deferred to later turns.

**Rule**: keep existing data/logic ("delta"), but rearrange sections and visual layout to match the spec ("override for visual layout"). Every button gets a **1-line hover tooltip**.

## Current vs Spec (delta)

The workspace already has: back link, header meta grid, quick actions (call/wa/email/open-lead/print/copy), customer journey map, 5 tabs (Workflow / Forms & Docs / Emails / Timeline / Support), Add-Task button, refund dialog, workflow status buttons.

Gaps against the spec:


| Spec item                                                                                                     | Status                         | Action                                                                                                                                                | &nbsp; | &nbsp; | &nbsp; |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------ | ------ |
| KPI Card 1 (header) fields & order                                                                            | ✅ present                      | Reorder Payment Status ↔ Order Status; add "day count" pill (already have relativeIST) — keep                                                         | &nbsp; | &nbsp; | &nbsp; |
| KPI Card 2 (quick actions attached to Card 1)                                                                 | ✅ present                      | Visually attach (remove gap, share border)                                                                                                            | &nbsp; | &nbsp; | &nbsp; |
| KPI Card 3 (Customer Journey)                                                                                 | ✅ present                      | Keep                                                                                                                                                  | &nbsp; | &nbsp; | &nbsp; |
| KPI Card 4 (5 tabs)                                                                                           | ✅ present                      | Keep names; rename "Employee Workflow" → "Employee Task", "Timeline" → "Timeline / Activity Log", "Support Ticket" → "Internal Help / Support Ticket" | &nbsp; | &nbsp; | &nbsp; |
| Tooltips on every button                                                                                      | ⚠️ partial                     | Add `Tooltip` wrapper on all quick actions, tab triggers, action-rail buttons, refund/task/print/copy                                                 | &nbsp; | &nbsp; | &nbsp; |
| Forms & Docs: remove copy on Subject/Applicant Name; color-code subject; number sections; date separator `/`  | ❌ missing                      | Update `FormSubmissionPanel` rendering                                                                                                                | &nbsp; | &nbsp; | &nbsp; |
| Emails tab: subject only, status pill (sent/failed/queue), no body access                                     | ⚠️ present but shows more      | Trim `LeadEmailsTab` row to subject + status pill                                                                                                     | &nbsp; | &nbsp; | &nbsp; |
| Support tab: 3 explicit ticket categories (Technical / Order-related / Suggestion-to-Owner) with image attach | ❌ current is generic           | Extend `AddTicketDialog` with category selector + image upload; add "Ticket Follow-up Schedule" button top-right of Support tab                       | &nbsp; | &nbsp; | &nbsp; |
| Top-right "Add Task" button                                                                                   | ✅ present (Schedule Follow-up) | Rename to "Add Task", keep Schedule Follow-up as its label variant                                                                                    | &nbsp; | &nbsp; | &nbsp; |
| Refund button — "Refund Request Received from Customer" + other selected order details                        | ⚠️ dialog exists               | Surface Refund button in header rail with tooltip; show sibling orders of same customer inside dialog                                                 | &nbsp; | &nbsp; | &nbsp; |
| Government / Work Completion link                                                                             | ❌ missing                      | this is a button where we add link of dadicated service wise government portal link                                                                   | &nbsp; | &nbsp; | &nbsp; |


## Files to change

1. `**src/components/admin/workspace/WorkspaceShell.tsx**`
  - Merge header meta card + quick-actions card into one continuous panel (remove gap).
  - Wrap every quick tile, tab trigger, and top-right button in `Tooltip` with 1-line description.
  - Rename tab labels per spec.
  - Add "Refund" and "Govt/Completion" buttons to the top-right group next to Add Task.
2. `**src/lib/orders/order-actions-map.ts**`
  - Add `tooltip: string` to each `QuickActionSpec` (1 line each).
  - Add `WorkspaceTabId` labels/tooltips map.
3. `**src/components/admin/workspace/OrderActionRail.tsx**`
  - Wrap each status action button in `Tooltip` sourced from `STATUS_ACTION_META` (add `tooltip` field there).
4. `**src/components/admin/FormSubmissionPanel.tsx**`
  - Remove copy icon from Subject / Applicant Name rows.
  - Style Subject label with distinct accent color.
  - Group answers by numbered sections; ensure date fields render as `DD / MM / YYYY`.
  - Add "Govt / Work Completion Link" editable field (persists to `applications.govt_completion_url` — new column; migration below).
5. `**src/components/admin/LeadEmailsTab.tsx**`
  - When rendered inside order workspace, hide body preview; show only Subject + status pill (`Sent` / `Failed` / `Queue`).
  - Keep "Send Incomplete Information Mail" quick button (already exists via BulkEmailDialog or add here).
6. `**src/components/admin/AddTicketDialog.tsx**`
  - Add required `category` select: `technical` | `order_related` | `suggestion_to_owner`.
  - Add optional image attachment (single file, uploads to existing storage bucket used for docs).
  - Order-related category auto-fills order detail.
7. **New: `src/components/admin/workspace/OrderTicketsPanel.tsx**` (currently inline in Shell)
  - Extract, add "Ticket Follow-up Schedule" button top-right, add category badges on each ticket row.
8. **Migration** — `supabase/migrations/<ts>_order_workspace_extras.sql`
  - `ALTER TABLE public.applications ADD COLUMN govt_completion_url text;`
  - `ALTER TABLE public.support_tickets ADD COLUMN category text CHECK (category IN ('technical','order_related','suggestion_to_owner'));`
  - `ALTER TABLE public.support_tickets ADD COLUMN attachment_url text;`
  - No new GRANTs needed (existing table grants cover new columns).

## Out of scope this turn

- Super-admin order additions (email deep-check, payment section, full ticket close flows with templates) — Section #2.
- Dashboards, sidebars, support dashboard — Sections #3–#7.
- Rich hover popovers with formulas (user chose simple 1-line tooltips).

## Verification

- After build, open a real order; hover every button and confirm tooltip appears.
- Confirm renamed tabs, attached KPI cards, Refund + Govt link buttons visible.
- Confirm ticket dialog shows category + image attach.
- Typecheck passes.