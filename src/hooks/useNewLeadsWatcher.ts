// Subscribes to lead INSERTs, lead assignment UPDATEs for the current user,
// and backend notifications. Fires desktop notifications and popup toasts.
// (Final_CRM Part E & employee lead assignment popups.)
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications, playLeadRingSound } from "@/hooks/useNotifications";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";

export function useNewLeadsWatcher() {
  const [unseen, setUnseen] = useState(0);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { notify } = useNotifications();
  const qc = useQueryClient();
  const role = useRole();
  const isAdmin = role.hasAny(["admin", "super_admin"]);

  // Reset counter when user enters the leads section.
  useEffect(() => {
    if (path.startsWith("/admin/leads")) setUnseen(0);
  }, [path]);

  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const invalidateLeadsData = () => {
      qc.invalidateQueries({ queryKey: ["admin.leads"] });
      qc.invalidateQueries({ queryKey: ["admin.leadCounts"] });
      qc.invalidateQueries({ queryKey: ["my-work"] });
    };

    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (!uid || cancelled) return;
      const topic = `user:${uid}:public:leads:watcher:${Math.random().toString(36).slice(2)}`;
      channel = supabase
        .channel(topic)
        .on(
          "postgres_changes" as never,
          { event: "*", schema: "public", table: "leads" },
          () => {
            invalidateLeadsData();
          }
        )
        .on(
          "postgres_changes" as never,
          { event: "INSERT", schema: "public", table: "leads" },
          (payload: { new?: { id?: string; name?: string | null; full_name?: string | null; phone?: string | null; service_slug?: string | null; assigned_to?: string | null } }) => {
            const lead = payload.new ?? {};
            if (!isAdmin && lead.assigned_to !== uid) return;
            
            setUnseen((n) => n + 1);
            invalidateLeadsData();
            playLeadRingSound();

            const title = "🔔 New lead received!";
            const body = [lead.name || lead.full_name, lead.service_slug, lead.phone].filter(Boolean).join(" · ") || "Open the leads queue";
            const url = lead.id ? `/admin/leads/${lead.id}` : "/admin/leads";
            
            notify({
              title,
              body,
              url,
              tag: `lead-${lead.id ?? Date.now()}`,
            });
            toast.info(title, {
              description: body,
              duration: 6000,
              action: { label: "View Lead", onClick: () => { window.location.href = url; } },
            });
          },
        )
        .on(
          "postgres_changes" as never,
          { event: "UPDATE", schema: "public", table: "leads" },
          (payload: { old?: { assigned_to?: string | null }; new?: { id?: string; name?: string | null; full_name?: string | null; lead_code?: string | null; assigned_to?: string | null } }) => {
            const newLead = payload.new ?? {};
            const oldLead = payload.old ?? {};
            
            invalidateLeadsData();

            if (newLead.assigned_to === uid && oldLead.assigned_to !== uid) {
              setUnseen((n) => n + 1);
              qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
              playLeadRingSound();

              const title = "🎯 Lead Assigned to You";
              const body = `Lead ${newLead.name || newLead.full_name || newLead.lead_code || ""} is now assigned to your queue.`;
              const url = newLead.id ? `/admin/leads/${newLead.id}` : "/admin/leads";
              
              notify({
                title,
                body,
                url,
                tag: `lead-assigned-${newLead.id ?? Date.now()}`,
              });
              toast.info(title, {
                description: body,
                duration: 7000,
                action: { label: "Open Lead", onClick: () => { window.location.href = url; } },
              });
            }
          },
        )
        .on(
          "postgres_changes" as never,
          { event: "*", schema: "public", table: "onboarding_submissions" },
          () => {
            invalidateLeadsData();
          }
        )
        .on(
          "postgres_changes" as never,
          { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${uid}` },
          (payload: { new?: { id?: string; title?: string | null; body?: string | null; href?: string | null; kind?: string | null } }) => {
            const notif = payload.new ?? {};
            qc.invalidateQueries({ queryKey: ["notifications"] });
            setUnseen((n) => n + 1);
            invalidateLeadsData();
            qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
            playLeadRingSound();

            const title = notif.title || "🔔 New CRM Notification";
            const body = notif.body || "A new update or task has arrived in your queue.";
            const url = notif.href || "/admin/leads";
            
            notify({ title, body, url, tag: `notif-${notif.id ?? Date.now()}` });
            toast.info(title, {
              description: body,
              duration: 7000,
              action: { label: "View Details", onClick: () => { window.location.href = url; } },
            });
          },
        )
        .subscribe();
    })();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [notify, qc, isAdmin]);

  return { unseen };
}


