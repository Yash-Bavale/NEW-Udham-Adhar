import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import {
  listMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
  type Notification,
} from "@/lib/crm/notifications.functions";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listMyNotifications);
  const markRead = useServerFn(markNotificationRead);
  const markAll = useServerFn(markAllNotificationsRead);
  const del = useServerFn(deleteNotification);

  const { data, refetch, isLoading } = useQuery<{ rows: Notification[] }>({
    queryKey: ["notifications", "all"],
    queryFn: () => fetchList({ data: { limit: 100 } }),
  });

  useRealtimeTable("notifications", () => {
    refetch();
    qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
  });

  const markMut = useMutation({
    mutationFn: (id: string) => markRead({ data: { id } }),
    onSuccess: () => {
      refetch();
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const markAllMut = useMutation({
    mutationFn: () => markAll(),
    onSuccess: () => {
      refetch();
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => refetch(),
  });

  const rows = data?.rows ?? [];
  const unread = rows.filter((r) => !r.read_at).length;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--admin-fg)" }}>
            Notifications
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--admin-fg-muted)" }}>
            {unread > 0 ? `${unread} unread` : "All caught up"} · live updates
          </p>
        </div>
        <button
          onClick={() => markAllMut.mutate()}
          disabled={unread === 0 || markAllMut.isPending}
          className="text-xs flex items-center gap-1.5 rounded-lg border px-3 py-1.5 disabled:opacity-50 hover:bg-[var(--admin-surface-2)] transition-colors"
          style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
        >
          <CheckCheck className="size-3.5" /> Mark all read
        </button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}>
        {isLoading ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--admin-fg-muted)" }}>Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center" style={{ color: "var(--admin-fg-muted)" }}>
            <Bell className="size-6 mx-auto mb-3 opacity-50" />
            <div className="text-sm">No notifications yet.</div>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
            {rows.map((n) => (
              <li key={n.id} className="flex items-start gap-3 px-4 py-3 group" style={{ borderColor: "var(--admin-border)" }}>
                <span
                  className="mt-1.5 size-2 rounded-full shrink-0"
                  style={{ background: n.read_at ? "transparent" : "var(--admin-accent)" }}
                  aria-hidden
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: "var(--admin-surface-2)", color: "var(--admin-fg-muted)" }}>
                      {n.kind}
                    </span>
                    <span className="text-sm font-medium truncate" style={{ color: "var(--admin-fg)" }}>{n.title}</span>
                    <span className="ml-auto text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>{formatRelative(n.created_at)}</span>
                  </div>
                  {n.body && (
                    <p className="text-xs mt-1" style={{ color: "var(--admin-fg-muted)" }}>{n.body}</p>
                  )}
                  {n.href && (
                    <a href={n.href} className="text-xs mt-1 inline-block hover:underline" style={{ color: "var(--admin-accent)" }}>
                      Open →
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.read_at && (
                    <button
                      onClick={() => markMut.mutate(n.id)}
                      className="p-1.5 rounded hover:bg-[var(--admin-surface-2)]"
                      title="Mark read"
                    >
                      <Check className="size-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => delMut.mutate(n.id)}
                    className="p-1.5 rounded hover:bg-[var(--admin-surface-2)]"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}
