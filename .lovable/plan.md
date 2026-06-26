## Goal

On the customer profile (`/admin/customers/$customerId`), surface every lead/form the customer ever submitted — including all repeat & another service submissions — with the actual filled form data viewable inline.

Right now the profile already lists linked leads (because `find_or_create_customer` matches by mobile/email, every repeat submission attaches to the same `customer_id`). What's missing is:

1. A clear "Repeat customer" header with submission count.
2. Each linked lead expandable to show the **onboarding form data they filled** for that submission (currently you can only see form data via the Application route).

## Changes

**1. New server function — `getFormSubmissionForLead**`
File: `src/lib/crm/submissions-admin.functions.ts`

- Mirrors `getFormSubmissionForApplication` but keyed by `leadId`.
- Returns: lead info, onboarding submission row (form_data, status, submitted_at), documents uploaded for that lead, required-doc schema from `service_form_schemas`.
- Uses `supabaseAdmin` with staff-role gate (same pattern as existing fn) so operations/support can view.

**2. New component — `LeadFormSubmissionInline**`
File: `src/components/admin/LeadFormSubmissionInline.tsx`

- Lightweight read-only renderer for a single lead's form data, grouped by section using the same `groupFields` logic from `FormSubmissionPanel`.
- Shows submission status, submitted_at, and uploaded documents with preview/download (reuses `getDocumentSignedUrl`).
- No edit/resend controls — pure view.

**3. Customer profile UI update**
File: `src/routes/admin.customers.$customerId.tsx`

- Replace the flat `Linked leads` list with an expandable list:
  - Section title becomes `Submissions (N)` where N = `data.leads.length`.
  - If N > 1, show a **"Repeat customer · N submissions"** amber badge next to the title.
  - Each row: lead_code, service, date, status badge, amount (gated by `hideMoney`), plus a chevron toggle.
  - Expanding fetches `getFormSubmissionForLead` lazily (TanStack Query keyed by leadId) and renders `LeadFormSubmissionInline`.
- Preserves the existing "Open lead" link as a secondary action.

## Out of scope

- No changes to lead creation, dedup logic, or the leads list page (the REPEAT badge work from the previous turn stays as-is).
- No financial gating changes — `hideMoney` already governs amount visibility.
- No new tables, no migrations.

## Verification

- Open a customer with multiple submissions → confirm count badge, expand each row, confirm form fields + documents render.
- Open a customer with a single submission → no "Repeat" badge, single expandable row works.
- Sign in as operations/support → form data still visible (admin client + staff-role gate).