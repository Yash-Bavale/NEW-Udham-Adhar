
## Goal
Make the admin form builder more powerful and remove hardcoding, so admins can fully configure each service's onboarding form and helper resources without dev work.

## 1. Copy sections from another service
- Add "Copy from service…" button in the builder toolbar (`src/routes/admin.services.forms.$serviceCode.tsx`).
- Dialog: pick source service → load its active schema → checkboxes for each section + documents → radio "Append" or "Replace entire form".
- New server fn `copyFromService` in `src/lib/crm/form-builder.functions.ts` returns the source schema for preview; actual merge happens client-side, then existing `saveBuilderSchema` persists as a new version.
- Auto-dedupe field keys on Append (suffix `_2`, `_3`) and warn the admin.

## 2. State & District field types
- Add two new field types `state` and `district` to `FIELD_TYPES` in `form-builder.functions.ts` and to the palette.
- Renderer (`OnboardingForm.tsx`) uses the existing `src/lib/onboarding/india-districts.ts` data:
  - `state`: select of all Indian states/UTs.
  - `district`: independent select of all districts (flat list) — not linked to state, per your choice.
- Both support required/placeholder/help like other selects.

## 3. Sample form download (one PDF per service)
- New column `services.sample_form_url text` (migration + GRANTs unchanged, RLS already permissive).
- In service edit page, add "Sample form PDF" uploader → uploads to a new **public** storage bucket `service-samples` via `supabase--storage_create_bucket` + `storage.objects` RLS (admins write, anyone read).
- On `/onboarding/$leadCode`, when `sample_form_url` exists, show a prominent "Download sample form" button in `OnboardingShell` header.

## 4. Admin-uploaded resources beside document fields
- Extend `DocSchema` in `form-builder.functions.ts` with optional `sample_url: string` and `sample_label: string`.
- Builder Documents tab: per-document row, add "Upload sample/template" (uploads to same `service-samples` bucket under `{service_code}/docs/{doc_key}/…`).
- `DocumentUploader.tsx` renders a "Download template" link next to the upload input when `sample_url` is set.

## 5. Additional improvements found during analysis
- **Default value** per field: add optional `default` string to `FieldSchema`; renderer prefills when submission is empty.
- **Field-level visibility rule** (simple): optional `showIf: { key, equals }` so e.g. "Other business type" only appears when `business_type == "Other"`.
- **Section description**: optional `description` on `SectionSchema`, rendered under the section title.
- **Reorder** sections/fields via up/down buttons in the canvas (drag-free, keyboard accessible).
- **Duplicate field/section** buttons in the canvas.
- **Publish vs Draft**: existing save creates a new active version; add "Save as draft" that inserts with `is_active=false` so admins can iterate without exposing to customers. History drawer already lists versions — add "Activate" button per row.
- **Field key auto-generation** from label (slugify) with manual override, to prevent the "invalid key" foot-gun.
- **Live preview** already exists; ensure new field types (state/district, showIf, default) render there too.

## 6. Schema/data changes
- Migration:
  - `alter table public.services add column sample_form_url text;`
  - Create bucket `service-samples` (public) via tool; add `storage.objects` policies: admins insert/update/delete, anyone select.
- No changes to `service_form_schemas` table — new field/doc keys live inside existing `schema` / `documents` JSON.

## Technical touch points
- Server fns: `src/lib/crm/form-builder.functions.ts`, `src/lib/crm/services-admin.functions.ts`.
- Loader: `src/lib/forms/schema-loader.server.ts` — pass through new doc `sample_url` and field `default`/`showIf`.
- UI: `src/routes/admin.services.forms.$serviceCode.tsx`, `src/routes/admin.services.$serviceCode.tsx` (sample PDF upload), `src/components/onboarding/OnboardingForm.tsx`, `src/components/onboarding/OnboardingShell.tsx`, `src/components/onboarding/DocumentUploader.tsx`.

## Out of scope
- Multi-file sample uploads (chose single PDF).
- Linked state→district cascade (chose independent dropdowns).
- Per-field sample attachments on non-document fields.
