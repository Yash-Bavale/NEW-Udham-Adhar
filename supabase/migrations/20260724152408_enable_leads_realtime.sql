-- Enable realtime for the leads table so that postgres_changes events are
-- broadcast to subscribed clients (admin dashboard, new-lead notifications).
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
