-- Enable realtime for the leads table so that postgres_changes events are
-- broadcast to subscribed clients (admin dashboard, new-lead notifications).
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;

-- REPLICA IDENTITY FULL ensures UPDATE payloads include old column values
-- (needed to detect assignment changes: old.assigned_to vs new.assigned_to).
ALTER TABLE public.leads REPLICA IDENTITY FULL;
