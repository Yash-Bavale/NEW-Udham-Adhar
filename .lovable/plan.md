## Order Management Module

Existing assets:
- `src/routes/admin.applications.tsx` — orders list (193 lines)
- `src/routes/admin.applications.$applicationId.tsx` — order detail (568 lines)
- `src/lib/crm/applications.functions.ts`, `orders.functions.ts`
- `src/components/admin/OrderJourney.tsx`

Decision: **Rebuild as `/admin/orders` and `/admin/orders/$orderId`**, matching the Lead Management visual + interaction pattern. Keep `/admin/applications/*` as redirects so existing links don't break.

### 1) Routes

- **New `src/routes/admin.orders.tsx`** — thin `<Outlet/>` layout (same pattern as `admin.leads.tsx`).
- **New `src/routes/admin.orders.index.tsx`** — list page.
- **New `src/routes/admin.orders.$orderId.tsx`** — detail page.
- **Edit `admin.applications.tsx` + `admin.applications.$applicationId.tsx`** → `beforeLoad` redirect to `/admin/orders[...]`.
- **Sidebar** (`AdminSidebar`): point "Orders" item to `/admin/orders`.

### 2) Server functions — `src/lib/crm/orders.functions.ts` (extend)

- `listOrders` — server-paginated (25/page), AND-combined filters: `fulfillmentStatus`, `serviceId`, `assignedTo`, `paymentStatus`, `dateFrom`, `dateTo`, `search` (order code/customer name/mobile). Returns rows joined to `customers`, `services`, latest `payments`, and `leads.lead_status_v2`.
- `getOrderDetail` — returns `application` + `customer` + `service` + `lead` + `payments[]` + `documents[]` (excluding deleted) + `events[]` (from `application_events`) + `workflow_stages` (from `service_workflows`).
- `updateOrderAssignee` — writes `applications.assigned_to`, logs `assignment_change` event (existing trigger already does this; just update).
- `updateFulfillmentStatus` — validates allowed transition, writes `fulfillment_status` (trigger logs `status_change` event automatically). Refuses `completed` unless caller passes `certificateDocumentId`. On completion:
  1. Insert `documents` row already done client-side (upload first, then call this fn with id).
  2. Invoke existing `delete-order-documents` edge fn (`{ application_id, reason: 'completed' }`).
  3. Insert `application_events`: `certificate_delivered`.
  4. Enqueue `order_completed` email via existing `email_queue`.
  5. Update parent `leads.lead_status_v2 = 'closed'` + log `lead_status_change` (trigger does it).
- `uploadOrderDocument` — server fn that takes signed-upload params or accepts already-uploaded storage path; inserts `documents` row (`document_type`, `file_path`, `uploaded_by`). For client-side direct uploads, use existing `documents` bucket signed URL helper if present, else add a tiny `createOrderDocumentSignedUrl` fn.

### 3) UI Components — `src/components/admin/`

- **`OrderListTable`** — columns per spec: Order No · Customer · Service · Fulfillment Status (badge) · Lead Status (smaller badge) · Assigned · Amount · Payment Status · Created · View. Filter bar above. URL-synced via search params (zod).
- **`OrderJourneyStepper`** (rewrite) — full-width horizontal stepper, stages pulled from `service_workflows.stages` for the order's service (fallback to default 6-stage list if missing). Each node shows label, ISO timestamp formatted `dd MMM yyyy, HH:mm`, and `staff_name` from matching `application_events`. Completed = filled navy + check, Current = filled amber + animate-pulse ring, Pending = empty grey ring.
- **`FulfillmentStatusUpdater`** — dropdown + "Update" button. When target = `completed`, opens `CertificateUploadDialog` (file input → upload to `documents` bucket at `orders/<order_id>/certificate-<ts>.<ext>` → call `updateFulfillmentStatus` with `certificateDocumentId`).
- **`OrderDocumentsPanel`** — list non-deleted docs; banner if `documents_deleted_at`; "Upload Document" opens a small dialog (internal-only).
- **`OrderPaymentsPanel`** — table of `payments`. Refund rows (`parent_payment_id IS NOT NULL` AND `amount < 0`) get a red "Refund — ₹X" pill.
- **`OrderSummaryBar`** — top strip in detail: Order No · Customer (link to `/admin/customers/$id` if it exists, else lead) · Service · Created · Assignee (inline editable select) · Total · Payment Status chip · "Linked Lead" button → `/admin/leads/$leadId`.
- Reuse existing `InternalNotesTimeline` filtered by `application_id`.

### 4) Data assumptions (verified against current schema)

- `applications` has `fulfillment_status`, `assigned_to`, `documents_deleted_at`, `application_code`.
- `leads.lead_status_v2` already joined.
- `application_events` has `event_type`, `old_value`, `new_value`, `staff_name`, `staff_role`, `created_at`.
- `service_workflows.stages` (jsonb) used for stepper labels per service.
- `documents` bucket exists (private). Signed-URL download for cert preview.

### 5) Order codes

Display `application_code` as-is. Spec mentions `SMV+digits`; current data uses `AP-YYYY-NNNNNN`. **Question to user:** keep existing prefix or change generator to `SMV` going forward? (Answer not needed to start; default = keep `AP-` and just display.)

### 6) Out of scope (this phase)

- Bulk actions on orders (deferred).
- Workflow editor UI for `service_workflows`.
- New email templates — uses existing `order_completed` template name (already in registry per Phase 1 map).
- Reworking `/admin/customers` linking if route absent.

### Order of work

1. `orders.functions.ts` (list/detail/update fns + workflow stage helper).
2. `OrderJourneyStepper`, `FulfillmentStatusUpdater`, `CertificateUploadDialog`.
3. `admin.orders.tsx` layout + `admin.orders.index.tsx` list.
4. `admin.orders.$orderId.tsx` detail page wiring all panels.
5. Redirect old `/admin/applications/*` routes.
6. Sidebar nav update.
7. Playwright smoke: list filters, open detail, change fulfillment, upload certificate, verify documents-deleted banner + lead closed.
