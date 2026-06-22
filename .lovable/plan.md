## Section A — Lead Auto-Assignment (Round-Robin)

### 1. Database migration
- Create `lead_assignment_config` (service_id nullable, assignment_mode, is_active) + GRANTs + RLS (admin/super_admin manage; staff read).
- Create `assignment_pool` (user_id, service_id nullable, is_active, last_assigned_at, total_assigned, UNIQUE(user_id, service_id)) + GRANTs + RLS.
- `leads`: ensure `assigned_to`, `assigned_at`, `auto_assigned` exist (add if missing).
- `auto_assign_lead()` BEFORE INSERT trigger — only assigns if global config `is_active = true` AND `NEW.assigned_to IS NULL`. Picks next pool member preferring service-specific over global, ordering by `last_assigned_at NULLS FIRST, total_assigned ASC`. Bumps pool counters.
- `log_lead_auto_assignment()` AFTER INSERT trigger — writes `application_events` (event_type `assignment_change`, staff_name, note).
- Extend existing manual-edit lead trigger (or update `lead-status` server fn) to also log `assignment_change` events when `assigned_to` changes via UPDATE.

### 2. Server functions (`src/lib/crm/assignment.functions.ts`)
- `getAssignmentConfig()` / `setAutoAssignEnabled({enabled})` — admin/super_admin only.
- `listAssignmentPool()` — joined with profile name, role, service name.
- `addToPool({userId, serviceId|null})` — validates user has role `executive` or `manager`.
- `removeFromPool({id})`.
- `reassignLead({leadId, userId})` — updates lead, bumps pool counter for new assignee, inserts `application_events` with note "Manually reassigned by …".

### 3. UI
- **New tab in `/admin/employees`** called "Lead Assignment":
  - Master toggle: Auto-Assignment ON/OFF.
  - Pool table: Employee | Role | Service (or "All Services") | Active | Last Assigned (IST DD-MM-YYYY HH:MM AM/PM) | Total Assigned | Remove.
  - "Add to Pool" dialog: employee dropdown (executive/manager only) + service dropdown (with "All Services").
  - Gated to admin/super_admin via `useRole`.
- **Lead Detail (`admin.leads.$leadId.tsx`)**: existing "Assigned To" dropdown wired through `reassignLead`. Show "Auto-assigned" badge when `auto_assigned = true`.
- **Lead List (`admin.leads.index.tsx`)**: "My Leads" quick-filter chip (filters `assigned_to = auth.uid()`). For users whose top role is `executive`, default the filter to "My Leads" on first load.

---

## Section B — Email Template Enable/Disable

### 1. Database migration
- `email_templates`: add `is_enabled BOOLEAN DEFAULT true`, `disabled_reason TEXT`, `last_toggled_by UUID`, `last_toggled_at TIMESTAMPTZ`, `last_sent_at TIMESTAMPTZ`, `total_sent INT DEFAULT 0`.

### 2. Queue worker change (`src/lib/emails/emails.server.ts`)
- In `processQueueInternal`, before sending each row: lookup `is_enabled` by `template_code`. If disabled:
  - Mark queue row status `skipped`, insert `email_logs` with status `skipped_disabled`.
  - Do NOT insert `application_events`.
- On successful send: bump `email_templates.last_sent_at = now(), total_sent = total_sent + 1` (by template_code).

### 3. Server functions (extend `emails-admin.functions.ts`)
- `toggleTemplate({code, enabled, reason?})` — admin/super_admin only; stamps `last_toggled_by`/`last_toggled_at`.
- `previewTemplate({code})` — renders subject + body_html with `previewData` (dummy variables) using existing `renderTemplate`.

### 4. UI (`/admin/email-templates`)
- Add columns: Status (toggle switch — green/grey) | Last Sent (IST) | Sent Count.
- Disabling opens confirm dialog with reason textarea ("Disabling this template means … emails will NOT be sent. Are you sure?"); enabling toggles without confirm.
- "Preview" button opens a modal showing rendered subject + HTML iframe with dummy values.

---

## Rules respected
- All status/assignment changes write to `application_events`.
- IST dates formatted DD-MM-YYYY HH:MM AM/PM in UI.
- No hard deletes; pool uses `is_active` flag for soft disable.
- `supabaseAdmin` only in `.server.ts` / server-fn handlers, never client.
- Role gating via existing `useRole` / `has_role()`; no buttons rendered for users lacking permission.
- New tables include explicit GRANTs + RLS in same migration.
