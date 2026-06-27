## Goal
Make the Super Admin dashboard the single executive dashboard for admin + super_admin, with a professional shadcn UI and a global IST date-range filter (Today / Yesterday / 7d / 30d / This month / Custom). All KPIs, trends, top services, workflow, email queue and activity recompute against the selected range. New day rolls over at 00:00 IST.

## Scope
- Route: `/admin/dashboard` (executive) becomes the new UI. `/admin/super` keeps the same component (super-admin gate). Landing in `admin.index.tsx` for `admin` continues to go to `/admin/dashboard`; super_admin to `/admin/super`. Same component, role-gated wrapper.
- Old `admin.dashboard.tsx` (759 lines, ops-style cards) is replaced.

## Backend (`src/lib/crm/super-admin.functions.ts`)
1. Convert `getSuperAdminOverview` to accept an input range:
   `{ preset: "today"|"yesterday"|"7d"|"30d"|"mtd"|"custom"; fromIso?: string; toIso?: string }`.
2. Add `istDayBoundaries(preset, from, to)` helper that computes `[startUtc, endUtc]` from IST midnights (using `Asia/Kolkata` offset, no deps). All Supabase queries use these bounds instead of `Date.now()-N*86_400_000`.
3. Rewrite KPIs against the range:
   - `leadsInRange`, `leadsPrevRange` (for delta), `paymentsInRange`, `paymentsPrevRange`, `revenueInRange`.
   - `openApplications`, `documentsPending`, `certificatesInRange`, `emailQueueDepth`, `totalCustomers`, `activeStaff`, `repeatedLeads`, `conversionRateInRange`.
   - Workflow counts (externalDelay, onHold, refundPending, remindersDue, closedInRange).
3. Trend series: bucket per IST day across the range (1d buckets if ≤62 days, weekly buckets if longer). Return `days` as `YYYY-MM-DD` IST keys.
4. Allow admin OR super_admin (relax `requireSuper` to `requireAdminOrSuper`) so executive dashboard works for both. Sensitive admin actions (`processEmailQueueNow`, `seedMissingEmailTemplates`) stay super_admin only.

## Frontend (new `src/routes/admin.super.tsx`, lighter rewrite, then re-use)
1. Replace dark gradient theme with a clean shadcn light/dark surface: `Card`, `Tabs`, `Button`, `Badge`, `Select`, `Popover`, `Calendar`, `Skeleton`, `ScrollArea`, `Separator`. Keep recharts.
2. Header row: title + live IST clock + `DateRangePicker` (shadcn Popover + Calendar `mode="range"`) + preset Tabs (Today / Yesterday / 7d / 30d / MTD / Custom). State is URL-synced via `validateSearch` (preset, from, to).
3. 12 KPI cards in a responsive grid with sparkline + delta vs previous equal-length window.
4. Sections: Revenue & Leads trend (combined Bar+Line), Top Services, Workflow Health, Email Queue status, Recent Activity (ScrollArea), System Alerts. All consume range data.
5. All dates rendered via existing `formatIST` from `@/lib/datetime`. Live clock ticks every 60s.
6. Replace `admin.dashboard.tsx` body to render the same `<SuperAdminDashboard range={...} />` component (extracted to `src/components/admin/SuperAdminDashboard.tsx`). Super-admin route adds the override actions panel; admin route hides it.

## Files
- edit `src/lib/crm/super-admin.functions.ts` — range input, IST bucketing, gate change
- add `src/components/admin/SuperAdminDashboard.tsx` — shared shadcn UI
- add `src/components/admin/DateRangePicker.tsx` — shadcn popover+calendar
- rewrite `src/routes/admin.super.tsx` — thin wrapper (super_admin gate + admin actions)
- rewrite `src/routes/admin.dashboard.tsx` — thin wrapper (admin/super_admin gate, no admin actions)
- keep `src/routes/admin.index.tsx` landing logic unchanged

## IST rules
- Day boundary: `00:00 Asia/Kolkata` → equivalent UTC via fixed +05:30 offset.
- "Today" = current IST day; "Yesterday" = previous IST day; "7d/30d" = trailing N IST days including today; "MTD" = 1st IST of current month → now.
- All chart x-axis labels and tooltips use `formatIST`.

## Out of scope
No data-model changes, no new tables, no role changes. Email queue actions and existing super-admin overrides keep current behavior.
