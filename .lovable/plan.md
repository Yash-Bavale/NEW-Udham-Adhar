## Phase 4C — Onboarding + Admin + Finance

Skipping customer self-service portal (server cost concern). Splitting into 3 focused turns so each ships clean.

---

### Turn 1 — Onboarding polish

1. **Animated stepper** on `/onboarding/$leadCode` — 4 steps (Personal → Business → Documents → Review), Framer Motion progress indicator, smooth transitions between steps.
2. **Doc upload UX** — drag-and-drop zone, per-file progress, inline preview thumbnails for images/PDFs, size/type validation, remove button. Uses existing `documents` storage bucket.
3. **Autosave** — debounced (1.5s) save of `form_data` JSON to `onboarding_submissions`. "Saved Xs ago" indicator. Resumes from last saved state on revisit.
4. **Completion email** — on submit, set `status='submitted'`, enqueue `onboarding_complete` template to customer + `admin_onboarding_submitted` to admin. Seed both templates.

### Turn 2 — Admin productivity

5. **Bulk actions** on `/admin/leads` — checkbox column, multi-select, bulk: assign, change status, delete (super_admin), export selection.
6. **CSV export** — server fn `exportLeads` / `exportApplications` streaming CSV with current filter applied. Download button on each list page.
7. **Saved filters** — new `admin_saved_filters` table (user_id, name, page, filter_json). Save current filter set, name it, reload from dropdown.
8. **Lead detail timeline** — `/admin/leads/$leadId` page showing: lead info + applications + payments + activity_logs + email_logs + documents + notes, all unified in a vertical timeline ordered by created_at.

### Turn 3 — Finance

9. **Invoice PDF generation** — on `payment.status='paid'`, server fn generates branded PDF via `pdf-lib` (Worker-safe), uploads to `invoices` bucket, stores `pdf_path`. Re-generate button for super_admin. Customer gets `invoice_ready` email with link.
10. **GST report** — `/admin/finance/gst` page: month picker, table of all paid invoices with base/GST/total, GSTIN, customer, summary totals, CSV export for filing.
11. **Settlement reconciliation** — `/admin/finance/settlements`: upload PayU settlement CSV, match each row to internal `payments.transaction_id`, flag mismatches (amount diff, missing, extra), persist into new `settlements` + `settlement_rows` tables.

---

### Technical notes

- All admin pages use existing `AdminShell.tsx` nav.
- PDF generation uses `pdf-lib` (pure JS, Worker-compatible). No native deps.
- Autosave uses a single server fn `saveOnboardingDraft` with optimistic UI.
- Bulk actions use server fns with `requireSupabaseAuth` + role gates.
- CSV export streamed via server route (`/api/admin/export/leads.csv`) with admin auth check; never `/api/public/`.
- Saved filters scoped per-user (RLS: `user_id = auth.uid()`).
- Settlement parser: Zod-validated rows, tolerant of header variations.
- Reuse existing email enqueue (`enqueueFromTemplateInternal`) — no new templates engine.

### Order
Shipping Turn 1 first; confirm before Turn 2; confirm before Turn 3.
