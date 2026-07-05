## Goal
Make the order workspace behave as one coherent surface: every quick action, tab, and status hint reads from a single map; every tab shows employees where the order stands; every action fires a toast and refreshes the workspace.

## 1. Single source of truth — `orderActionsMap.ts`

New file: `src/lib/orders/order-actions-map.ts`. Exports:

- `QUICK_ACTIONS` — array of `{ id, label, icon, tint, kind: "contact" | "link" | "system", build(ctx): { href?, onClick?, disabled, disabledReason }, toast: { info?, success? } }` for Call, WhatsApp, Email, Open Lead, Print, Copy Order No.
- `STATUS_ACTIONS: Record<OrderStatus, ActionKey[]>` — the existing per-status button set (moved out of `EmployeeActionPanel`).
- `TAB_AVAILABILITY(status, hasLead, showConsultation)` — the current `tabAvailability()` logic, moved here.
- `NEXT_STEP_HINT: Record<OrderStatus, { headline, hint, primaryActionKey }>` — the one-line "next step" copy per status used by the compact tab header (e.g. `WAITING_CUSTOMER_INFO` → "Waiting for customer info · Send reminder if 24h+ has passed").
- Enum-typed so TS catches any missing status.

`EmployeeActionPanel` and `WorkspaceShell` both import from this file — no more duplicated arrays.

## 2. Compact "Current status + next step" tab header

New file: `src/components/admin/workspace/TabStatusHeader.tsx`. One row, ~48px tall:

```text
[● status pill]  Order BHS-2026-000125  ·  Next: Send form link to customer  ·  in state 4h 12m  →  [primary action btn]
```

- Status pill uses `STAGE_META` tone (same as header card).
- Copy comes from `NEXT_STEP_HINT[orderStatus]`.
- Primary action button (when defined) fires the same handler as the header's Employee Action Panel — reuses the map, no duplicate dialogs; opens the same `ActionDialog` via a shared `useOrderActionDialog()` hook lifted out of `EmployeeActionPanel`.
- Rendered as the first child inside every `TabsContent` (Employee Workflow, Forms & Docs, Emails, Timeline, Support) so employees never lose context when they tab-hop.

## 3. Toasts + auto-refresh for every quick action

Wrap the 5 header quick tiles in a `runQuickAction(actionKey)` helper inside `WorkspaceShell`:

| Action    | Toast on trigger                     | Refresh workspace?           |
|-----------|--------------------------------------|------------------------------|
| Call      | `toast("Opening dialer…")`           | no                           |
| WhatsApp  | `toast("Opening WhatsApp…")`         | no                           |
| Email     | `toast("Opening mail client…")`      | no                           |
| Open Lead | `toast("Opening lead…")`             | no                           |
| Print     | `toast.success("Print dialog opened")`| no                          |
| Copy code | already toasts — unchanged           | no                           |

Disabled tiles show `toast.error(disabledReason)` on click instead of failing silently (e.g. "No mobile on file").

Every server-touching action (Employee Actions, document upload/delete, email send, form-link resend, assignee change, request-docs) already toasts inside its own mutation; add a shared `onChanged` callback so they also call `queryClient.invalidateQueries({ queryKey: ["admin.order", orderId] })`. Threaded via new optional `onChanged?: () => void` props on:
- `OrderDocumentsPanel` (upload, delete)
- `FormSubmissionPanel` (send/resend form link)
- `LeadEmailsTab` (email sent)
- `EmployeeActionPanel` (already invalidates via existing `onDone` — keep, but route through the same helper)

`WorkspaceShell` passes one `invalidate = () => qc.invalidateQueries({ queryKey: ["admin.order", orderId] })` down to all of them.

## 4. Files touched

**New**
- `src/lib/orders/order-actions-map.ts`
- `src/components/admin/workspace/TabStatusHeader.tsx`
- `src/components/admin/workspace/useOrderActionDialog.ts` (extracted from `EmployeeActionPanel`, so both the panel and `TabStatusHeader` open the same dialog)

**Edited**
- `src/components/admin/workspace/WorkspaceShell.tsx` — consume the map, wrap quick tiles with toast helper, mount `TabStatusHeader` inside every `TabsContent`, pass `onChanged` down.
- `src/components/admin/EmployeeActionPanel.tsx` — drop local `ACTIONS_BY_STATUS`, import from map; extract dialog into the shared hook.
- `src/components/admin/OrderDocumentsPanel.tsx`, `src/components/admin/FormSubmissionPanel.tsx`, `src/components/admin/LeadEmailsTab.tsx` — accept `onChanged`, call after success.

**No backend changes.** No new server functions. All existing handlers (`sendFormLink`, `startProcessing`, `queueDocumentReminder`, etc.) stay as-is.

## 5. Acceptance

- Deleting the array in `WorkspaceShell` or `EmployeeActionPanel` no longer breaks anything — both read from `order-actions-map.ts`.
- Switching tabs always shows the current status pill + next-step line at the top.
- Clicking any header tile (including disabled ones) shows a toast within 100 ms.
- After uploading a doc / sending an email / running any status action, the header pill, journey map, and Order Summary update without a page reload.
