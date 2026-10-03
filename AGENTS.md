# Project Architecture Rules

- Run production and preview builds with a 6 GB Node heap because the combined TanStack Start and Nitro server bundle exceeds Node's default heap limit.
- Generate exact stored-email dispute PDFs in the authorised CRM browser, then upload the finished PDF through an authenticated server function because the deployed server has no HTML layout engine.- Employee Performance historical KPIs come only from the `get_employee_perf_stream` database function (order-level events, validated human actors, IST ranges) aggregated by `src/lib/crm/perf-engine`, because assignment custody and work credit must never be reconstructed from `applications.assigned_to`.
