## Goal

Split the single "Pause order — mark delay" dialog into two dedicated dialogs with the right controls for each delay type.

## Current state (verified)

- `src/components/admin/ExternalDelayDialog.tsx` handles both delays with a top toggle (Customer-side / Our-side).
- Both variants currently show the same Expected Review Date + Priority controls, even though customer delay doesn't need an internal reminder.
- Dialog is opened from `WorkspaceShell.tsx` and `CustomerJourneyMap.tsx` using `{ kind: "customer_delay" | "technical_delay" }`.

## Plan

### 1. New `CustomerDelayDialog.tsx`

Purpose: pause the order and email the customer (E003). No self-reminder.

- Header: "Customer-side delay — notify customer"
- Reason picker (customer reasons only, unchanged from current customer tab)
- Internal note (team-only)
- Customer-visible note (optional, appended to email)
- Info panel: "Customer receives E003 now. Order auto-closes after {app_settings.customer_delay_autoclose_minutes} if no reply. Resume anytime."
- No Expected Review Date, no Priority.
- Primary button: "Save & notify customer".

### 2. New `TechnicalDelayDialog.tsx`

Purpose: pause the order internally and set our own follow-up reminder. customer email also sent & then internal reminder.

- Header: "Our-side (technical) delay — internal follow-up"
- Reason picker (internal reasons only)
- Follow-up reminder — replaces Expected Review Date:
  - Preset chips: `1h`, `2h`, `3h`, `6h`, `1d`, `3d`, `7d` (single-select, default `2h`)
  - "Custom…" chip → reveals a small HH:MM / minutes input (min 15 min, max 30 days) reusing the same validation as `armTimer`.
  - Shown value drives `reminderMinutes` passed to `startTechnicalHold` (already supports this).
- Priority (Low / Normal / High / Urgent) — kept, used for the internal reminder.
- Internal note (team-only). No customer-visible note field.
- Info panel: "Email is sent to customer regarding technical delay & Assignee gets a reminder in {selected duration}, repeating until you Resume."
- Primary button: "Save & notify assignee".

### 3. Wire the new dialogs

- `WorkspaceShell.tsx` (lines ~706–715) and `CustomerJourneyMap.tsx` (lines ~544–553): replace the two `<ExternalDelayDialog>` instances with `<CustomerDelayDialog>` and `<TechnicalDelayDialog>`, keeping the existing `{ kind: … }` state and success handlers (invalidations, toast) exactly as they are.
- Keep `ExternalDelayDialog.tsx` file for now but stop importing it (safe to delete in a follow-up; not doing it here to avoid touching unrelated call sites).

### 4. Server functions

No changes. `startTechnicalHold` already accepts `reminderMinutes` + `remarks` + `reasonId`, and `customerSideDelay` already handles the customer flow with the app-settings timer.

## Out of scope

- Reason library edits, email template edits, journey highlight rules — untouched.
- No DB migrations.

## Files touched

- `src/components/admin/workspace/CustomerDelayDialog.tsx` (new)
- `src/components/admin/workspace/TechnicalDelayDialog.tsx` (new)
- `src/components/admin/workspace/WorkspaceShell.tsx` (swap imports/usages)
- `src/components/admin/workspace/CustomerJourneyMap.tsx` (swap imports/usages)