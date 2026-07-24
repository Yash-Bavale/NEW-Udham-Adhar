// Subscribes to lead INSERTs, lead assignment UPDATEs for the current user,
// and backend notifications. Fires desktop notifications and popup toasts.
// (Final_CRM Part E & employee lead assignment popups.)
import { useEffect, useRef, useState } from "react";
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

  // Deduplication cache: key -> timestamp (ms) to avoid duplicate toasts & sounds for same event
  const notifiedKeysRef = useRef<Map<string, number>>(new Map());

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

    const triggerNotification = (dedupeKey: string, title: string, body: string, url: string) => {
      const now = Date.now();
      const lastTime = notifiedKeysRef.current.get(dedupeKey) ?? 0;
      if (now - lastTime < 10000) return; // Skip if notified within last 10s
      notifiedKeysRef.current.set(dedupeKey, now);

      // Clean up old keys
      for (const [k, t] of notifiedKeysRef.current.entries()) {
        if (now - t > 60000) notifiedKeysRef.current.delete(k);
      }

      setUnseen((n) => n + 1);
      invalidateLeadsData();
      playLeadRingSound();

      notify({ title, body, url, tag: dedupeKey });
      toast.info(title, {
        description: body,
        duration: 6000,
        action: { label: "View Details", onClick: () => { window.location.href = url; } },
      });
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

            const dedupeKey = lead.id ? `lead-${lead.id}` : `lead-${lead.name}-${lead.phone}`;
            const title = "🔔 New lead received!";
            const body = [lead.name || lead.full_name, lead.service_slug, lead.phone].filter(Boolean).join(" · ") || "Open the leads queue";
            const url = lead.id ? `/admin/leads/${lead.id}` : "/admin/leads";

            triggerNotification(dedupeKey, title, body, url);
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
              qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });

              const dedupeKey = newLead.id ? `lead-assigned-${newLead.id}` : `lead-assigned-${Date.now()}`;
              const title = "🎯 Lead Assigned to You";
              const body = `Lead ${newLead.name || newLead.full_name || newLead.lead_code || ""} is now assigned to your queue.`;
              const url = newLead.id ? `/admin/leads/${newLead.id}` : "/admin/leads";

              triggerNotification(dedupeKey, title, body, url);
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
          (payload: { new?: { id?: string; title?: string | null; body?: string | null; href?: string | null; kind?: string | null; entity_id?: string | null } }) => {
            const notif = payload.new ?? {};
            qc.invalidateQueries({ queryKey: ["notifications"] });
            qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });

            // Only ring loudly for lead-assignment notifications; other CRM
            // notifications (form_submitted, delay flags, status changes) go
            // to the notifications tray silently to avoid alert fatigue.
            if (notif.kind !== "order_assigned") return;

            const dedupeKey = notif.entity_id ? `lead-${notif.entity_id}` : `notif-${notif.id}`;
            const title = notif.title || "🔔 New CRM Notification";
            const body = notif.body || "A new update or task has arrived in your queue.";
            const url = notif.href || "/admin/leads";

            triggerNotification(dedupeKey, title, body, url);
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


