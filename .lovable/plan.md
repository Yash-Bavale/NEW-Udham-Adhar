## Problem

Executive Dashboard shows **750 unique customers** and **3,540 repeat leads** against 4,290 total leads. Reality (verified via SQL): there are **3,119 unique emails** and **3,073 rows in the `customers` table**.

Root cause is in `src/lib/crm/dashboard.functions.ts`:

```ts
supabase.from("leads").select("email, mobile").limit(10000)
```

is then deduplicated in JS. PostgREST enforces a server-side `max-rows` cap (1000 on this project), so only the first ~1000 lead rows come back regardless of the `.limit(10000)` hint. Those 1000 rows happen to contain ~750 distinct emails → the bogus "750" figure. Same bug silently caps `uniqueMobiles`, `byStatus`, `byService`, and `trendRows` (all use `.limit(5000)`), so the status/service donuts and 30-day trend are also under-counted on any account with >1000 leads.

## Fix

Stop pulling raw rows to the server function just to dedupe / tally them. Push the aggregation into Postgres via a single `SECURITY DEFINER` RPC that returns exact counts and distributions. Keep the existing "recent leads / recent activity" queries as-is (they're already bounded by `.limit(...)` and small).

### 1. New migration — `get_dashboard_metrics()` RPC

```sql
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE result jsonb;
BEGIN
  -- Caller must be staff (any role in user_roles)
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT jsonb_build_object(
    'totalLeads',       (SELECT count(*) FROM leads),
    'todayLeads',       (SELECT count(*) FROM leads WHERE created_at >= date_trunc('day', now())),
    'weekLeads',        (SELECT count(*) FROM leads WHERE created_at >= now() - interval '7 days'),
    'inProgress',       (SELECT count(*) FROM applications WHERE application_status IN ('details_pending','documents_pending','under_review','under_process')),
    'completed',        (SELECT count(*) FROM applications WHERE application_status = 'completed'),
    'pending',          (SELECT count(*) FROM applications WHERE application_status = 'awaiting_payment'),
    'uniqueCustomers',  (SELECT count(*) FROM customers),
    'uniqueEmails',     (SELECT count(DISTINCT lower(email))             FROM leads WHERE email  IS NOT NULL),
    'uniqueMobiles',    (SELECT count(DISTINCT regexp_replace(mobile,'\D','','g')) FROM leads WHERE mobile IS NOT NULL),
    'statusDistribution',  (SELECT coalesce(jsonb_agg(jsonb_build_object('label', status,  'value', c) ORDER BY c DESC), '[]'::jsonb)
                            FROM (SELECT coalesce(status,'unknown')  AS status,  count(*) c FROM leads GROUP BY 1) s),
    'serviceDistribution', (SELECT coalesce(jsonb_agg(jsonb_build_object('label', service, 'value', c) ORDER BY c DESC), '[]'::jsonb)
                            FROM (SELECT coalesce(service,'unknown') AS service, count(*) c FROM leads GROUP BY 1) s),
    'trend',               (SELECT coalesce(jsonb_agg(jsonb_build_object('date', to_char(d,'MM-DD'), 'count', coalesce(c,0)) ORDER BY d), '[]'::jsonb)
                            FROM generate_series(date_trunc('day', now()) - interval '29 days', date_trunc('day', now()), interval '1 day') d
                            LEFT JOIN (SELECT date_trunc('day', created_at) day, count(*) c
                                       FROM leads
                                       WHERE created_at >= now() - interval '30 days'
                                       GROUP BY 1) x ON x.day = d)
  ) INTO result;
  RETURN result;
END $$;

GRANT EXECUTE ON FUNCTION public.get_dashboard_metrics() TO authenticated;
```

Uses `customers` row count as the canonical "Unique Customers" number (it's the deduplicated Customer 360 table already). Keeps `uniqueEmails` / `uniqueMobiles` as raw distinct-on-leads counts for the secondary stat.

### 2. Update `src/lib/crm/dashboard.functions.ts`

Replace the 6 client-side aggregate queries with a single `supabase.rpc('get_dashboard_metrics')` call. Keep the existing `recentLeads`, `recentActivity`, and `myRoles` queries — they're already correctly bounded. Return the same shape the dashboard component already consumes, so no UI changes needed.

### 3. No frontend changes

`src/routes/admin.dashboard.tsx` already computes `repeatCount = totalLeads - uniqueCustomers`. With `uniqueCustomers` now correct (~3,073), the "repeat leads" hint will read ~1,217 instead of 3,540.

## Files

- new migration: `get_dashboard_metrics()` SECURITY DEFINER function + grant
- edited: `src/lib/crm/dashboard.functions.ts` (swap inline aggregation for RPC)

## Verification

After deploy, dashboard should show: Total 4,290 · Unique Customers ~3,073 · repeat hint ~1,217. Status/service donuts and 30-day trend will also reflect all rows, not just the first 1,000.
