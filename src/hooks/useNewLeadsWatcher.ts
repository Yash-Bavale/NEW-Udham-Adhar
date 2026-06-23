// Subscribes to lead INSERTs for the current user, fires a desktop notification
// and tracks an unseen counter that resets when the user visits /admin/leads.
// (Final_CRM Part E — sidebar live-count badge.)
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/hooks/useNotifications";

export function useNewLeadsWatcher() {
  const [unseen, setUnseen] = useState(0);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { notify } = useNotifications();
  const qc = useQueryClient();

  // Reset counter when user enters the leads section.
  useEffect(() => {
    if (path.startsWith("/admin/leads")) setUnseen(0);
  }, [path]);

  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (!uid || cancelled) return;
      const topic = `user:${uid}:public:leads:inserts:${Math.random().toString(36).slice(2)}`;
      channel = supabase
        .channel(topic)
        .on(
          "postgres_changes" as never,
          { event: "INSERT", schema: "public", table: "leads" },
          (payload: { new?: { id?: string; full_name?: string | null; phone?: string | null; service_slug?: string | null } }) => {
            const lead = payload.new ?? {};
            setUnseen((n) => n + 1);
            qc.invalidateQueries({ queryKey: ["leads"] });
            notify({
              title: "New lead received",
              body: [lead.full_name, lead.service_slug, lead.phone].filter(Boolean).join(" · ") || "Open the leads queue",
              url: lead.id ? `/admin/leads/${lead.id}` : "/admin/leads",
              tag: `lead-${lead.id ?? Date.now()}`,
            });
          },
        )
        .subscribe();
    })();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [notify, qc]);

  return { unseen };
}
