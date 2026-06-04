## Goal

Treat every form submission as a brand-new application. Never silently reuse a previous lead or its data for the same email/mobile.

## Changes

### 1. `src/lib/leads.functions.ts` (main lead form)
Remove the 30-day dedupe-by-email/mobile block (lines 47–83 and the surrounding `if (existing)` branch). Always `INSERT` a new row in `leads` using exactly the values the user just typed. The downstream `applications` insert already creates a new application row per call — keep it as is.

### 2. `src/routes/api/public/talk-to-expert.ts` (Talk-to-Expert form)
Remove the 60-second dedupe-by-email block (lines 53–69 plus the `if (recent?.id)` branch). Always insert a new lead row with the freshly submitted name / email / mobile / state / language / problem. Activity log + admin email stay the same.

### 3. Leave untouched
- `customers` table aggregation (auto-managed by DB triggers — fine to keep linking the new lead to an existing customer record for CRM reporting; the customer's *contact details on this application* will be whatever they typed this time, because we now write those values directly on the new `leads` row).
- `getApplicationSummary` and the summary page — they already read from the specific lead row, so a new lead = new untouched data.
- Onboarding/payment flow.

## Result

Each submission → a fresh `leads` row + fresh `applications` row, populated only with what the customer entered this time. Nothing is pre-filled or carried over from any earlier submission.
