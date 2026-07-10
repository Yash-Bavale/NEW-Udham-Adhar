## Goal

1. Update the **New Udyam Registration** intake form (and by inheritance the **Correct PAN/Aadhaar — Stage 2** form) to match the field spec you shared: multi-plant support, cascading State→District dropdowns, custom NIC coding (no 3-step drilldown), and every date field in DD/MM/YYYY.
2. Enforce **DD/MM/YYYY** as the input AND display format for every date in the app — customer forms, admin panels, tables, emails and PDFs.

---

## Part A — Form schema changes (`src/lib/onboarding/schemas.ts`)

Extend the schema type system to support two new field kinds and cascading selects:

- New `FieldType`s: `state`, `district`, `plantUnits` (repeatable group).
- `district` field points at a sibling `state` field via `stateFrom: "state"` — dropdown reloads when the state changes.
- `plantUnits` field type renders a repeater with **Add plant / Remove** buttons; each row has: Unit Name (dropdown: Plant / Branch / Warehouse / Head Office / Other), Flat, Premises, Village/Town, Block, Road, City, PIN, State (cascading), District (cascading).

`NEW_UDYAM.fields` gets the following fixes vs. today:

- 14. Address: change `state` and `district` field types from `text` to `state` / `district` (cascading).
- 15. Add new `plants` field (type `plantUnits`) — currently missing entirely.
- 19.1 Major Activity Under Services ◉ Non-Trading ◉ Trading
- Renumber and re-label as per your spec.

`CORRECT_PAN_AADHAAR_STAGE2` already reuses `NEW_UDYAM.fields`, so it inherits all changes automatically.

---

## Part B — DD/MM/YYYY input everywhere

Create a new reusable component `src/components/ui/DateInputDMY.tsx`:

- Single text input masked/validated to `DD/MM/YYYY`.
- Trailing calendar icon opens the existing shadcn `Calendar` popover.
- Value stored as ISO `YYYY-MM-DD` internally so server logic, DB writes, and existing schemas are unchanged; only the visible UI is DD/MM/YYYY.
- Handles paste, keyboard entry, and calendar selection.

Wire it into every `type: "date"` field renderer:

- `src/components/onboarding/OnboardingForm.tsx` (customer form)
- `src/components/admin/LeadFormSubmissionInline.tsx`
- `src/components/admin/FormSubmissionPanel.tsx`
- `src/components/admin/AdminOnboardingPanel.tsx` (admin edit view = the "workspace shell")

Any other `<input type="date">` in admin routes gets swapped to the new component in the same pass (grep list: `admin.complaints*`, `admin.reports.tsx`, `admin.finance.settlements.tsx`, `ExternalDelayDialog`, etc.).

---

## Part C — DD/MM/YYYY display everywhere

`src/lib/datetime.ts` already exports `formatDateDMY`. Two changes:

1. Update `formatIST({ dateOnly: true })` to return `DD/MM/YYYY` (currently returns `29 Jun 2026`). Since this is the app-wide formatter, every admin table, timeline, invoice, email and PDF that already goes through it flips automatically.
2. Sweep the ~30 files using `toLocaleDateString` directly and route them through `formatDateDMY` / `formatIST({ dateOnly: true })`. Files include `admin.invoices.tsx`, `admin.leads.index.tsx`, `admin.orders.index.tsx`, `admin.customers.tsx`, `LeadFinanceTab.tsx`, `OrderPaymentsPanel.tsx`, `InternalNotesTimeline.tsx`, `pdf.server.ts` (invoice PDFs), `crm/invoices.functions.ts`, cron/webhook files, etc.

Time-of-day rendering (e.g. "29/06/2026, 03:42 PM") stays intact — only the date portion is switched to DD/MM/YYYY.

---

## Part D — Admin lead workspace panel (the "workspace shell")

`src/components/admin/AdminOnboardingPanel.tsx` + `FormSubmissionPanel.tsx` already render from the same schema, so the new fields (plants array, cascading state/district, NIC custom entry) show up automatically once the schema is updated and the new field-type renderers are added there too.

Two panel-specific touch-ups:

- Render the `plants` array as a compact list ("Plant 1: &nbsp; — &nbsp;") with expand/edit.
- Show state/district as plain text once saved (no cascading needed in read-only view).

---

## Part E — Verification

After the edits, run `bun run build` and then hit these routes in the preview:

- `/onboarding/<code>` for a New Udyam lead → confirm plants can be added, state/district cascades, NIC 2/4/5 accept custom values, every date field shows DD/MM/YYYY.
- `/admin/leads/<id>` → confirm admin view shows the same fields and dates in DD/MM/YYYY.
- `/admin/invoices` and one invoice PDF → confirm invoice date reads DD/MM/YYYY.

---

## Technical notes

- No DB migration needed — every new field is stored inside the existing `onboarding_submissions.data` JSON blob.
- `plants` is stored as `data.plants: Array<{ unit_name, address_flat, ... }>` — server validation in `onboarding.functions.ts` gets a small addition to iterate the array.
- The internal wire format for date fields stays ISO `YYYY-MM-DD`; only the rendered UI/text becomes DD/MM/YYYY. This keeps existing SQL, PDF templates, and email templates working without data migration.
- `INDIA_DISTRICTS` in `src/lib/onboarding/india-districts.ts` already has every state/UT — used as-is for the cascade.