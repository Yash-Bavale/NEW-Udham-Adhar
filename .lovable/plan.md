
# Orders + Workspace + Notifications UI Refresh

Scope is **frontend only** — no schema, no server-fn signature changes. All existing queries (`listOrders`, `getOrderExceptionState`, `OrderWorkflowPanel` actions, notifications feed) stay wired as-is. We rebuild the presentation to match the two reference screenshots (customer journey strip + employee workflow tree).

## 1. Orders list — `/admin/orders` (index)

Replace the current dense table with a two-layer layout:

**Top bar**
- Segmented tabs: `Current` · `Pending` · `Cancelled` · `Closed` · `All` (shadcn `Tabs`, count badges)
- Right side: search input, service filter, assignee filter, date-range, `+ New Order`
- Below tabs: 4 KPI mini-cards (Active, Awaiting Customer, Overdue SLA, Closed today)

**Order rows** — shadcn `Card` list (not a raw table), each row shows:
- Left: order # + copy, customer name, service pill
- Middle: **compact 7-dot journey strip** (Lead → Payment → Consultation → Form → Verification → Govt Portal → Certificate → Completed) with current dot highlighted — reused from reference image #1
- Right: status chip, assignee avatar, "last updated Xh ago", chevron
- Row hover shows quick actions (Open, Call, WhatsApp, Schedule follow-up)

Tab filter maps to existing status buckets:
- Current = active non-exception
- Pending = `WAITING_CUSTOMER_INFO`, `CUSTOMER_HOLD`, `OUR_SIDE_DELAY`
- Cancelled = `CANCELLED` / `REJECTED`
- Closed = `CLOSED` / `COMPLETED`

## 2. Order Workspace — `/admin/orders/$orderId`

Rebuild `WorkspaceShell` layout to mirror reference image #1:

**Header card**
- Back to Orders · Order # (copy) · Payment status chip · Order status chip · Created timestamp + relative
- Contact grid (Name, Email, Language, Selected Service | Mobile, State, Source, Lead Code)
- Right-side quick-action tiles: Call / WhatsApp / Email / Open Lead / Print (icon buttons in soft-tinted squares)
- Top-right primary: `+ Schedule Follow-up`

**Customer Journey strip** (full-width card)
- 8 stages with icon + label, connector lines, current stage pulsing with "Current Stage" pill
- Completed = filled primary, current = ring + pulse, upcoming = muted
- Reuse `CustomerJourneyMap` visuals but restyle to match reference

**Tabs row**: Employee Workflow · Forms & Docs · Emails · Timeline / Activity Log · Internal Help / Support Ticket

**Employee Workflow tab (main redesign — reference image #2)**
Two-column: left = workflow, right = Order Summary + Quick Notes.

Left column — **visual decision tree** (`OrderWorkflowPanel` restyled):
1. Current Status chip + "View Workflow Guide" button (opens `Sheet` with the full flowchart from reference #2)
2. **Next Action** grid — 4 tinted action cards (green/amber/blue/purple) with icon, title, description, arrow:
   - Application Submitted
   - Information Incomplete
   - Service Delay – Our Side
   - Service Delay – Customer Side
3. On click, expand inline into the sub-branch (e.g. Information Incomplete → Reminder Sent → Customer Submitted → Application Submitted / Auto Close) rendered as a vertical mini-stepper so the employee sees exactly where they are and what's next
4. Existing `ExceptionBanner` sits above the action grid when in an exception state (kept, restyled to match tint system)

Right column — sticky `Order Summary` (Total, Paid, Due, Assigned To, Last Updated, Next Follow-up) + `Quick Notes` textarea with inline save.

**Other tabs**: keep current data, just restyle to shadcn cards + consistent spacing.

## 3. Notifications — `/admin/notifications`

Redesign the bell page:
- Header: title + `Mark all as read` + filter tabs (All · Mentions · Assignments · SLA · System)
- Grouped by day (`Today`, `Yesterday`, older date headings)
- Each item = `Card` row: colored dot (severity), icon, title, one-line context, order # link, relative time, action buttons (Open, Snooze, Dismiss)
- Unread rows get subtle left border + tinted background
- Empty state illustration

Bell dropdown (`NotificationsBell`) restyled to match: same grouped list, "See all" footer link.

## 4. Design system touches

- Soft tinted status pills using existing semantic tokens (`--primary`, `--success`, `--warning`, `--destructive`, `--muted`) — no hardcoded hex
- Add utility tokens in `src/styles.css`: `--tint-success`, `--tint-warning`, `--tint-info`, `--tint-danger`, `--tint-purple` (bg + fg pairs) for the workflow action cards and quick-action tiles
- Consistent card radius (`rounded-xl`), 1px border, subtle shadow on hover only
- Icons from `lucide-react` (already used)
- Motion: `framer-motion` fade/slide on tab switch + stage-dot pulse (already installed)

## Files touched

Edited:
- `src/routes/admin.orders.index.tsx` — new tabs + card list + KPI strip
- `src/routes/admin.orders.$orderId.tsx` — new header + journey strip placement
- `src/components/admin/workspace/WorkspaceShell.tsx` — layout rework, tabs
- `src/components/admin/workspace/OrderWorkflowPanel.tsx` — action-card grid + inline sub-stepper + Workflow Guide sheet
- `src/components/admin/workspace/CustomerJourneyMap.tsx` — restyle to reference
- `src/components/admin/workspace/ExceptionBanner.tsx` — tint system alignment
- `src/routes/admin.notifications.tsx` — grouped card list
- `src/components/admin/NotificationsBell.tsx` (if present) — matching dropdown
- `src/styles.css` — tint tokens

New:
- `src/components/admin/orders/OrderRowCard.tsx`
- `src/components/admin/orders/OrdersKpiStrip.tsx`
- `src/components/admin/orders/OrdersTabs.tsx`
- `src/components/admin/workspace/WorkflowActionCard.tsx`
- `src/components/admin/workspace/WorkflowGuideSheet.tsx`
- `src/components/admin/workspace/QuickActionTile.tsx`
- `src/components/admin/notifications/NotificationCard.tsx`

## Out of scope

- No changes to server functions, DB, RLS, or notification/scheduler logic
- No new statuses or workflow transitions — only visualising what's already there
- Other admin routes untouched
