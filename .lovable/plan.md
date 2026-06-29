## Goal

Fix three issues in the admin order workspace:

1. Show customer **State** and **Language** on every order detail
2. Stop the Email History from showing the same email twice
3. Fix empty-variable templates (specifically the "Send Form Link" email — the link is rendered as empty text because variable names don't match)

---

## 1) Show State & Language

**File:** `src/components/admin/workspace/CustomerProfileCard.tsx`

- Split current  State" into rows: **State** (so State is always prominent even when city is missing).
- Add a **Language** field reading `customer.language ?? lead.language ?? "English"` with a `Languages` icon.
- Show both with a clear label so support knows what language to communicate in.

No data-layer changes needed — `customers.language` already exists.

---

## 2) Email History double-row fix

**File:** `src/components/admin/LeadEmailsTab.tsx`

Today the list merges `email_queue` rows AND `email_logs` rows. Every successful send produces one row in each → duplicates.

Fix: deduplicate the merged history. Prefer the `email_logs` row when a matching `queue_id` exists; otherwise keep the `email_queue` row. Use a `Map` keyed by `queue_id || id`, with logs overwriting queue rows.

This removes the visual duplicate without losing the queued/failed rows that don't yet have a log entry.

---

## 3) "Send Form Link" email has no link

**Root cause:** `resendFormLink` in `src/lib/crm/submissions-admin.functions.ts` passes camelCase variables (`name`, `service`, `formLink`) but the `welcome_and_form_link` template uses snake_case placeholders (`{{customer_name}}`, `{{service_name}}`, `{{form_link}}`). `renderTemplate` replaces unknown vars with empty strings → the `<a href="">` link disappears and only static text is sent.

**Fix:** in `resendFormLink`, pass both snake_case keys (matching the template) and keep camelCase as aliases for safety:

```ts
{
  customer_name: lead.name ?? "",
  service_name: lead.service ?? "",
  form_link: formLink,
  order_number: lead.lead_code ?? "",
  // legacy aliases
  name: lead.name ?? "", service: lead.service ?? "", formLink, leadCode: lead.lead_code ?? "",
}
```

Also audit the other camelCase-only call sites against snake_case templates and fix the same way:

- `emails-admin.functions.ts` `sendLeadEmail` → ensure both `customer_name`/`customerName`, `order_number`/`orderNumber`, `form_link`/`formLink` are provided in `finalVars` defaults so any template renders.
- Add a small `withBothCases(vars)` helper in `emails.server.ts` that auto-mirrors snake↔camel keys before render, so future mismatches don't drop variables silently. Wire it into `enqueueFromTemplateInternal` before `renderTemplate`.

---

## Out of scope

- No DB schema or template edits (templates already correct snake_case).
- No changes to the email send pipeline / SMTP layer.
- No UI changes outside the Customer profile card and Emails tab list.