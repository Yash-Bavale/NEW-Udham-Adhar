## Two changes: Migrate form expansion + Admin form editor

### Part 1 — Expand `migrate-udyog-aadhaar-to-udyam` form

Keep the current 4 fields (Applicant Name, UAM Number, Registered Mobile, Registered Email) as **Section 1: "Existing Udyog Aadhaar Details"**.

Add **Section 2: "PAN Details"** with:
- Customer PAN Number (`pan_number`, pattern `^[A-Z]{5}\d{4}[A-Z]$`, required)
- Name As Per PAN Card (`pan_holder_name`, required)
- Date of Birth as per PAN (`pan_dob`, date, required)

Then append **all fields from `NEW_UDYAM`** (organisation type, ITR, GSTIN, WDV, turnover, enterprise name, mobile, email, social/gender, address, plants, bank, activity, NIC, employees, portal preferences, etc.) as further sections in the same single-page form. Customer fills everything at once.

Update in **two places** (single source of truth stays in DB after Part 2 lands):
1. `src/lib/onboarding/schemas.ts` — replace the `MIGRATE` schema with the expanded field list (reuses `NEW_UDYAM.fields` after the PAN section).
2. DB migration — upsert the new schema JSON into `service_form_schemas` for `service_code = 'migrate-udyog-aadhaar-to-udyam'` as a new active version. Older version deactivated.

No renderer changes required — `OnboardingForm.tsx` already handles all needed field types (`section`, `nic`, `plants`, `select`, `date`, etc.).

---

### Part 2 — Admin Form Builder (no more hardcoding)

**Goal:** Admin can create/edit form schemas per service from the admin panel; changes take effect immediately for customers. Hardcoded TS registry stays only as fallback for services never edited in the DB.

**Database (migration):**
- `service_form_schemas` already exists with `service_code, version, is_active, title, description, schema (jsonb), documents (jsonb)`. No structural change needed; just add `updated_by uuid` if missing and ensure RLS allows admin/super_admin write.
- Grants + RLS: SELECT for authenticated (so onboarding still reads); INSERT/UPDATE only for admin/super_admin via `has_role`.
- Versioning: saving creates a new row with `version = max+1`, sets `is_active=true`, deactivates prior versions atomically (SQL function `upsert_service_form_schema(service_code, title, description, schema, documents)`).

**Server functions** (`src/lib/crm/service-forms.functions.ts`, extend existing file):
- `listServiceFormSchemas()` — all services + active version summary
- `getServiceFormSchema(serviceCode)` — active version full JSON (admin edit load)
- `saveServiceFormSchema({ serviceCode, title, description, schema, documents })` — admin-only, calls the upsert SQL function
- `duplicateServiceFormSchema(fromCode, toCode)` — clone helper
- All gated with `requireSupabaseAuth` + admin role check.

**Admin UI — new route** `src/routes/admin.services.forms.$serviceCode.tsx` plus a services-list entry point:
- **Left panel — Palette / Field types**: Text, Email, Tel, Number, Date, Select, Textarea, Section header, NIC picker, Plants repeater.
- **Center canvas — Sections & fields list**: drag-to-reorder (dnd-kit), collapsible sections, inline edit of label, click to open field settings.
- **Right panel — Field settings**: key (auto-slug from label, editable), label, type, required, placeholder, help text, pattern (regex), maxLength, options (for select — one per line), nicDigits/activityFrom (for nic). Validation warnings on save (duplicate keys, invalid regex).
- **Top bar**: Service selector, form title, description, Save (creates new version), Preview (renders `OnboardingForm` with the current draft schema in a modal), Version history dropdown with Restore.
- **Documents tab**: same editor pattern for the `documents` array (key, label, required, help).

**Renderer:** unchanged — `loadServiceSchema()` already reads DB first, falls back to TS. The DB row becomes the source of truth once admin saves.

**Guardrails:**
- Reserved keys used by workflow (e.g. `email`, `aadhaar_mobile`, `pan_number` if wired to KYC) shown with a "system field" badge — editable label but key locked.
- Preview always runs client-side validation so admin catches broken regex before publish.
- Version history retains all prior versions; restoring creates a new version copying old JSON.

---

### Order of implementation

1. DB migration: add upsert function, RLS/grants for admin writes, seed the new expanded `migrate-udyog-aadhaar-to-udyam` schema.
2. Update `MIGRATE` schema in `src/lib/onboarding/schemas.ts` (fallback parity).
3. Server functions for form CRUD.
4. Admin form builder UI (route + components).
5. Link from Services admin page → "Edit Form" button per service.

### Notes / assumptions

- Existing lead submissions for migrate service won't break: renderer tolerates extra fields; validator only checks fields defined in current schema.
- I will NOT change the customer-facing intake form (`LeadForm.tsx`); only the post-payment onboarding form for migrate service expands.
- Form builder is admin/super_admin only. Operations/support roles can view but not edit (configurable later if needed).
