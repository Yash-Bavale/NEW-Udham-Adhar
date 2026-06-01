## 3B — Onboarding + Dynamic Forms + Document Center

After a customer pays, they currently land on a static "thank you" page. We need a guided onboarding flow where they submit the service-specific details we need to actually file their work, then upload supporting documents. Staff sees and verifies everything in the existing admin panel.

### What the customer sees

```text
/payment/UA-...  →  /success/UA-...
                         │
                         ▼  "Continue to onboarding →"
                 /onboarding/UA-...           (Step 1: details form)
                         │
                         ▼
                 /onboarding/UA-.../documents (Step 2: file uploads)
                         │
                         ▼
                 /onboarding/UA-.../done      (Step 3: confirmation)
```

The `lead_code` (e.g. `UA-2026-001010`) acts as the access token — same pattern already used by `/payment/:leadCode`. No login required for the customer.

### Dynamic forms (per service)

Each service gets its own field set. We define schemas in a single file `src/lib/onboarding/schemas.ts`:

- **udyam-registration**: Aadhaar number, PAN, applicant DOB, business name, business type (proprietor/partnership/etc.), commencement date, address, bank A/c + IFSC, NIC activity, mobile (Aadhaar-linked), social category, gender.
- **udyam-update**: existing Udyam number + which field(s) to update + new values.
- **udyam-print / download**: existing Udyam number + registered mobile only.
- **migration udyog→udyam**: old UAM number + Aadhaar + PAN.
- Default fallback: name, mobile, email, free-text "details" textarea.

Each field is `{ key, label, type, required, options?, validate? }`. The renderer turns it into a controlled form using the same input styles as `LeadForm`.

### Document center

Pre-defined doc types per service (e.g. Aadhaar front, Aadhaar back, PAN card, bank passbook, business proof). Customer uploads PDF/JPG/PNG (max 5 MB each) into the private `documents` storage bucket; admin reviews + marks each `verified | rejected` with optional remarks.

### Admin side

The existing `/admin/leads/$leadId` page gets two new sections:
- **Onboarding submission** — read-only JSON pretty-print of what the customer submitted.
- **Documents** — table of uploaded files with preview link (signed URL), status dropdown, remarks field.

When all required docs are `verified` and onboarding is `submitted`, a one-click "Mark ready for processing" button moves the lead to `under_process`.

---

### Technical details

**Migration** (one file):
- `onboarding_submissions` — `lead_id`, `application_id`, `service_code`, `form_data jsonb`, `status` (`draft|submitted`), `submitted_at`. Unique on `lead_id`.
- `documents` — `lead_id`, `application_id`, `doc_type`, `file_path`, `file_name`, `mime_type`, `size_bytes`, `status` (`pending|verified|rejected`), `remarks`, `uploaded_at`, `verified_by`, `verified_at`.
- Storage bucket `documents` (private). RLS: only staff can read/write directly; customer uploads go through a signed-upload-URL server fn that uses `supabaseAdmin`.
- Staff RLS via existing `has_role` / `is_finance_viewer` helpers; service_role full access.

**Server functions** (`src/lib/onboarding/*.functions.ts`):
- `getOnboarding({ leadCode })` — public, returns lead summary + schema + existing submission + uploaded docs.
- `submitOnboarding({ leadCode, data })` — public, Zod-validates against the schema, upserts submission.
- `requestDocumentUpload({ leadCode, docType, fileName, mimeType, sizeBytes })` — public, validates type/size, returns a Supabase signed upload URL.
- `confirmDocumentUpload({ leadCode, docType, filePath, ... })` — public, inserts/updates the `documents` row.
- `listDocumentsAdmin({ leadId })`, `setDocumentStatus({ id, status, remarks })`, `getDocumentSignedUrl({ id })` — staff only.

All public ones use `supabaseAdmin` + `lead_code` lookup (not RLS), exactly like the existing payment flow.

**Routes**:
- `src/routes/onboarding.$leadCode.tsx` — details form.
- `src/routes/onboarding.$leadCode.documents.tsx` — upload center.
- `src/routes/onboarding.$leadCode.done.tsx` — confirmation.
- Update `src/routes/success.$leadCode.tsx` with a "Continue to onboarding" CTA.
- Extend `src/routes/admin.leads.$leadId.tsx` with the two new sections.

**Files involved**
- new: migration, `src/lib/onboarding/schemas.ts`, `src/lib/onboarding/*.functions.ts`, three onboarding routes, `src/components/onboarding/*` (form renderer + uploader).
- edited: `success.$leadCode.tsx`, `admin.leads.$leadId.tsx`.

### Scope guardrails (NOT in this slice)
- No email/SMS notifications (deferred).
- No OCR / Aadhaar verification API calls (deferred).
- No customer login — `lead_code` is the access token, same as `/payment/:leadCode`.
- No re-payment flow if customer needs to upgrade service.

### Order of execution
1. Run migration (creates tables + bucket + RLS) — needs your approval.
2. Define schemas + server fns.
3. Build the 3 customer routes + form/upload components.
4. Wire admin sections.
5. Quick QA against an existing paid lead.

Ready to ship — kicking off with the migration next.
