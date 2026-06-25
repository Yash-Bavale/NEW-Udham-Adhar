import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useEffect, useState } from "react";
import { Inbox, FileCheck2, Sparkles, Bell, AlertTriangle, ArrowRight } from "lucide-react";
import { getMyWorkSummary, type MyWorkSummary } from "@/lib/crm/my-work.functions";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/my-work")({
  head: () => ({ meta: [{ title: "My Work — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: MyWorkPage,
});

function MyWorkPage() {
  const fetchSummary = useServerFn(getMyWorkSummary);
  const [hasSession, setHasSession] = useState(false);
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => { if (active) setHasSession(!!data.session); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setHasSession(!!session));
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);
  const { data, isLoading, refetch } = useQuery<MyWorkSummary>({
    queryKey: ["my-work"],
    queryFn: () => fetchSummary(),
    enabled: hasSession,
  });

  useRealtimeTable("notifications", () => refetch());
  useRealtimeTable("applications", () => refetch());
  useRealtimeTable("documents", () => refetch());

  const counters = data?.counters;

  const cards = useMemo(
    () => [
      { label: "Assigned applications", value: counters?.assignedApps ?? 0, icon: Inbox, accent: "var(--admin-accent)" },
      { label: "Documents to review", value: counters?.pendingDocs ?? 0, icon: FileCheck2, accent: "var(--admin-warn)" },
      { label: "My active leads", value: counters?.assignedLeads ?? 0, icon: Sparkles, accent: "var(--admin-success)" },
      { label: "Unread notifications", value: counters?.unreadNotifications ?? 0, icon: Bell, accent: "var(--admin-accent)" },
      { label: "SLA risk (>48h idle)", value: counters?.slaRisk ?? 0, icon: AlertTriangle, accent: "var(--admin-danger)" },
    ],
    [counters],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--admin-fg)" }}>My Work</h1>
          <p className="text-sm mt-1" style={{ color: "var(--admin-fg-muted)" }}>
            Your personal queue — assignments, document reviews, leads, and live alerts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
                {c.label}
              </span>
              <c.icon className="size-4" style={{ color: c.accent }} />
            </div>
            <div className="text-2xl font-semibold mt-1" style={{ color: "var(--admin-fg)" }}>
              {isLoading ? "—" : c.value}
            </div>
          </div>
        ))}
      </div>

      <Section
        title="Next-best actions"
        subtitle="Your assigned applications, oldest first"
        empty="No assigned applications — you're clear."
        href="/admin/applications"
      >
        {(data?.assignedApplications ?? []).slice(0, 8).map((a) => (
          <Link
            key={a.id}
            to="/admin/applications/$applicationId"
            params={{ applicationId: a.id }}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--admin-surface-2)] transition-colors text-sm"
          >
            <code className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: "var(--admin-surface-2)", color: "var(--admin-fg-muted)" }}>
              {a.application_code ?? a.id.slice(0, 8)}
            </code>
            <span className="font-medium truncate flex-1" style={{ color: "var(--admin-fg)" }}>
              {a.lead?.name ?? "Unknown"}
            </span>
            <StatusPill status={a.application_status} />
            <span className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
              {formatRelative(a.updated_at)}
            </span>
            <ArrowRight className="size-3.5" style={{ color: "var(--admin-fg-subtle)" }} />
          </Link>
        ))}
      </Section>

      <Section
        title="Documents pending review"
        subtitle="Oldest uploads first"
        empty="No pending documents."
        href="/admin/review"
      >
        {(data?.pendingDocuments ?? []).slice(0, 8).map((d) => (
          <Link
            key={d.id}
            to="/admin/review"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--admin-surface-2)] transition-colors text-sm"
          >
            <FileCheck2 className="size-4" style={{ color: "var(--admin-warn)" }} />
            <span className="font-medium truncate flex-1" style={{ color: "var(--admin-fg)" }}>
              {d.doc_type}
            </span>
            <span className="text-xs truncate max-w-[260px]" style={{ color: "var(--admin-fg-muted)" }}>
              {d.file_name}
            </span>
            <span className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
              {formatRelative(d.uploaded_at)}
            </span>
          </Link>
        ))}
      </Section>

      <Section
        title="My active leads"
        subtitle="Leads currently assigned to you"
        empty="No leads assigned."
        href="/admin/leads"
      >
        {(data?.assignedLeads ?? []).slice(0, 8).map((l) => (
          <Link
            key={l.id}
            to="/admin/leads/$leadId"
            params={{ leadId: l.id }}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--admin-surface-2)] transition-colors text-sm"
          >
            <code className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: "var(--admin-surface-2)", color: "var(--admin-fg-muted)" }}>
              {l.lead_code ?? l.id.slice(0, 8)}
            </code>
            <span className="font-medium truncate flex-1" style={{ color: "var(--admin-fg)" }}>{l.name}</span>
            <span className="text-xs truncate max-w-[200px]" style={{ color: "var(--admin-fg-muted)" }}>{l.service}</span>
            <StatusPill status={l.status} />
          </Link>
        ))}
      </Section>
    </div>
  );
}

function Section({
  title, subtitle, children, empty, href,
}: { title: string; subtitle?: string; children: React.ReactNode; empty: string; href: string }) {
  const arr = Array.isArray(children) ? children : [children];
  const hasContent = arr.filter(Boolean).length > 0;
  return (
    <section
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}
    >
      <header className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--admin-border)" }}>
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "var(--admin-fg)" }}>{title}</h2>
          {subtitle && <p className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>{subtitle}</p>}
        </div>
        <Link to={href} className="text-xs flex items-center gap-1 hover:underline" style={{ color: "var(--admin-accent)" }}>
          View all <ArrowRight className="size-3" />
        </Link>
      </header>
      <div className="p-2">
        {hasContent ? (
          <div className="space-y-0.5">{children}</div>
        ) : (
          <div className="px-3 py-6 text-center text-xs" style={{ color: "var(--admin-fg-muted)" }}>{empty}</div>
        )}
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border"
      style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)", background: "var(--admin-surface-2)" }}
    >
      {status.replace(/_/g, " ")}
    </span>
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
