## Execution plan — Final_CRM.md by Parts A→P

Priority: **A + B first, then D (employee dashboards), then C, then E…P serially.** Each phase ends with a build + smoke check before the next begins.

---

### Phase 1 — Part A · Design System & Visual Language

Tokens in `src/styles.css` (navy/gold/cream palette, status colors, typography scale, card/button/sidebar/table/badge/modal classes). Shared primitives: `StatusBadge`, `ConfirmModal`, `CopyButton`. No business-logic changes.
*Verify:* build passes, badges render with new tokens on existing pages.

### Phase 2 — Part B · Layout & Role-Based Access Gate (P0 SECURITY)

- `beforeLoad` role gate on `src/routes/admin.tsx` using `has_any_staff_role` + role lookup.
- `/unauthorized` route.
- Confirm every `*.functions.ts` already calls `assertRole`; add where missing.
- Sidebar/route map matches spec list.
*Verify:* signed-in non-staff redirected; staff admin loads; build passes.

### Phase 3 — Part D · Admin / support / manager Dashboard `/admin/dashboard`

"My Work" queue, 4 stat cards (scoped), Pending Leads panel with **wired** Send-Reminder (Part J #1), recent activity feed. Real DB data only.
*Verify:* reminder queues email row; pending highlight rules apply.

### Phase 4 — Part C · SuperAdmin Dashboard `/admin`

6 KPI strip, System Health panel (queue depths, last cron, PayU mode, failed webhooks), Security Alerts, Employee Activity Feed, Assignment Overview, Revenue chart, SuperAdmin-only actions (**Seed Templates** runs Part I migration RPC, **Process Queue Now** calls `processQueueInternal`).
*Verify:* super_admin sees it, others 403; seed + process buttons work.

### Phase 5 — Part E · Browser Push Notifications

`public/sw.js`, `useNotifications` hook, opt-in banner, sidebar live-count badge via realtime `user:<uid>:leads` channel.
*Verify:* permission flow + test notification.

### Phase 6 — Part F · Leads List

Filters, debounced search, row highlight rules, inline hover actions, bulk actions through `ConfirmModal` (replaces alert/prompt/confirm), empty state.

### Phase 7 — Part G · Lead Detail + Workspace

Two-column layout, FormSubmission "Copy All Details", Documents panel with `**approved**` enum fix (Part J #7 + #6) + reject-reason email, valid-transition status buttons, Notes, Send Reminder/Form-Link/WhatsApp, follow-up scheduler, customer quick card.

### Phase 8 — Part H · Completion Gate (CRITICAL)

`completeApplication` server fn (upload → certificate row → 7-day signed URL → queue `certificate_delivery` → engine transition → sync `lead_status_v2` → set `fulfilled_at` → event log). Resend unblocked. `CompletionGateModal` + `ApplicationSearchCombobox`. Wired into Lead Detail, Order Detail, `/admin/certificates`.

### Phase 9 — Part I · Email Templates Seed

Migration inserting all 12 templates with `ON CONFLICT DO NOTHING`. Triggerable from SuperAdmin button.

### Phase 10 — Part J · Broken/Dead Button Sweep

Items 1-9 (Send Reminder, missing-doc checkboxes, bulk delete modal, role-change save flow, delete-service live-order warning, submission emails, document emails, certificate picker, PayU refund clean-return).

### Phase 11 — Part K · Security Hardening (remaining P0/P1)

Rate limiter, hardcoded Gmail removal (`ADMIN_NOTIFICATION_EMAIL`), `bulkExportLeads` role check, `payments.idempotency_key` UNIQUE, missing indexes, Customer 360 server-side filter, closure cron Bearer auth.

### Phase 12 — Part L · Employee Management

Cards grid, add-employee drawer, reset-password button.

### Phase 13 — Part M · Customer 360 fixes

Certificates tab, merged activity timeline, onboarding submissions tab, invoice PDF download.

### Phase 14 — Part N · Certificates page redesign

Application picker, list with resend, filters.

### Phase 15 — Part O · Reusable Component Audit

Ensure all 10 catalog components exist and are used.

### Phase 16 — Part P · Final wiring checklist verification

Walk the 20-blocker table; each row marked DONE / DEFERRED with evidence.

---

**Deferred (Part P explicitly):** onboarding token auth (#2), ops dashboard DB aggregation (#6), CCAvenue HMAC (#4 — warning banner only).

Approve and I start Phase 1 (Part A) immediately.