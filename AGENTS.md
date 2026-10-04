# Project Architecture Rules

- Run production and preview builds with a 6 GB Node heap because the combined TanStack Start and Nitro server bundle exceeds Node's default heap limit.
- Generate exact stored-email dispute PDFs in the authorised CRM browser, then upload the finished PDF through an authenticated server function because the deployed server has no HTML layout engine.- Employee Performance historical KPIs come only from the `get_employee_perf_stream` database function (order-level events, validated human actors, IST ranges) aggregated by `src/lib/crm/perf-engine`, because assignment custody and work credit must never be reconstructed from `applications.assigned_to`.
- Order ownership changes go through the `assign_application` database function (row-locked, compare-and-set, server-only) so the ownership update and its `application_events` history row commit atomically with an explicit actor type.
- Customer Document Merge reuses the shared browser pdf-lib merge in src/lib/disputes/dispute-browser-pdf.ts (appendFileToPdf) and saves through the existing order document upload, so there is one PDF engine and one document store.
- Keep the first NIC activity in the existing nic_2_digit/nic_4_digit/nic_5_digit form answers and store additional activities in nic_activities in the same submission, so older forms and order views remain compatible.
