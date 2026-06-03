# Admin Panel UI completion + Phase D Status Engine

Last pass added the new lead-detail tabs/components, but several admin pages referenced by links/nav were never created and several modules from the "Deep Pass" plan are still missing. This pass finishes the UI and then ships the Phase D status workflow engine.

## Part 1 — Finish Admin Panel UI

### A. Missing detail pages (currently 404 / type errors)

1. `src/routes/admin.applications.$applicationId.tsx`
   - Loads `getApplicationDetail` (already exists in `applications.functions.ts`).
   - Header: application_code, status badge, linked lead summary card with link to `/admin/leads/$leadId`.
   - Status workflow buttons (Next / Hold / Reject) — wired to `updateApplication` with `assertRole(["super_admin","operations"])`.
   - Tabs: Overview · Onboarding (embeds `AdminOnboardingPanel`) · Documents · Finance (embeds `LeadFinanceTab` scoped via lead_id) · Certificates · Activity (embeds `LeadTimeline` filtered to application).

2. `src/routes/admin.complaints.$complaintId.tsx`
   - New server fn `getComplaintDetail` in `complaints.functions.ts`.
   - Header: complaint code, status, severity, linked lead/application chips.
   - Status workflow (open → in_progress → resolved → closed) via existing `updateComplaintStatus`.
   - Sections: Customer message, Internal notes (reuses notes pattern), Linked entities, Resolution log.

### B. New modules

3. `src/routes/admin.certificates.tsx` + supporting server fns
   - New file `src/lib/crm/certificates.functions.ts`:
     - `listCertificates` (filters: status, service, date range)
     - `uploadCertificate` — upload PDF to `documents` bucket at `certificates/<application_id>/<filename>`, insert row in `certificates` table.
     - `deliverCertificate` — set `delivered_at`, transition application to `completed`, enqueue email via existing `email_queue` using `client-info-request` registry (new template variant `certificate-delivered`) with signed URL.
   - Page: table of all certificates, upload dialog, "Deliver" action button.
   - Storage bucket guard: create `documents` bucket if absent (private) via migration.

4. `src/routes/admin.audit.tsx` + `src/lib/crm/audit.functions.ts`
   - `listAuditLogs` server fn: filters by entity_type, entity_id, actor, date range. `super_admin` only.
   - Table view: timestamp, actor, entity, action, old → new diff (JSON viewer collapsible).

### C. AdminShell nav additions

5. `src/components/admin/AdminShell.tsx`
   - Add nav items: Certificates (`Award` icon), Audit (`ShieldCheck` icon, only visible if user has `super_admin`).
   - Add small role badge near user menu.

### D. Editable onboarding answers + doc re-upload

6. `src/lib/crm/onboarding-admin.functions.ts` (new)
   - `adminUpdateOnboardingField` — merges into `onboarding_submissions.form_data` jsonb, writes audit log.
   - `requestDocumentReupload` — sets doc row `status='re_upload_requested'`, enqueues email.
7. Enhance `AdminOnboardingPanel.tsx` so each field row has inline edit (super_admin + operations) and each document row gets a "Request re-upload" button.

### E. Payments tooling on Finance tab

8. Enhance `LeadFinanceTab.tsx`:
   - Collapsible JSON viewer per webhook payload.
   - `resyncPayment` button (super_admin) → new server fn in `payments.functions.ts` that re-queries gateway and updates `payments` row.
   - `Record offline payment` dialog (super_admin).

## Part 2 — Phase D: Status Workflow Engine

### F. Centralised state machine

9. `src/lib/crm/status-engine.ts` (pure, client-safe — no Supabase imports)
   - Defines transition graphs for `lead_status`, `application_status`, `complaint_status`, `certificate_status`.
   - `getAllowedTransitions(current, role)` → returns allowed next states by role.
   - `validateTransition(from, to, role)` → throws on invalid.

10. `src/lib/crm/status-engine.server.ts`
    - `transitionLead`, `transitionApplication`, `transitionComplaint`, `transitionCertificate` server fns that:
      a. validate transition via shared rules,
      b. apply DB update,
      c. write `audit_logs`,
      d. enqueue side-effect emails (e.g. application → `in_progress` sends "Work started" email; → `completed` sends certificate delivery).

11. Replace ad-hoc status `<select>` dropdowns in lead/application/complaint detail pages with a shared `<StatusTransition>` component that reads allowed transitions and renders action buttons (e.g. "Move to In Progress", "Mark Completed", "Put on Hold").

### G. Side-effect side-table

12. New table `status_transitions` migration:
    - columns: `id`, `entity_type`, `entity_id`, `from_status`, `to_status`, `actor_id`, `note`, `created_at`.
    - GRANTs + RLS (super_admin/operations select, server-side insert via service role).
    - Backfill insert from existing audit rows is out of scope — start fresh.

13. Timeline component reads from `status_transitions` in addition to current sources for a unified chronological view.

## Technical Notes

- All new server fns use `requireSupabaseAuth` middleware + `assertRole` from `src/lib/audit.ts`.
- Email side-effects use the existing `email_queue` insert pattern (already done by `sendLeadEmail`) so no worker changes are needed.
- Storage bucket `documents` must exist; migration creates it if missing with `private` access. Signed URLs generated server-side (1 hour TTL) for certificate delivery emails.
- No changes to client.ts, auth-middleware.ts, types.ts (auto-gen).

## Resume order after this pass

→ Phase E (tokenized magic links for client form access)
→ Phase F (PDF invoice/certificate redesign)
