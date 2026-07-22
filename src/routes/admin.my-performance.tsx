import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMyPerformance } from "@/lib/crm/performance.functions";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import { SectionCard, TableSkeleton } from "@/components/admin/ui";
import { formatIST } from "@/lib/datetime";
import { Phone, Mail, MessageCircle, StickyNote } from "lucide-react";

export const Route = createFileRoute("/admin/my-performance")({
  head: () => ({
    meta: [
      { title: "My Performance — Udyam Ops OS" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: MyPerformancePage,
});

const CH_ICON: Record<string, any> = { call: Phone, whatsapp: MessageCircle, email: Mail, note: StickyNote, sms: MessageCircle };

function MyPerformancePage() {
  const now = new Date();
  const [from, setFrom] = useState<Date | undefined>(new Date(now.getTime() - 30 * 24 * 3600 * 1000));
  const [to, setTo] = useState<Date | undefined>(now);
  const fn = useServerFn(getMyPerformance);
  const { data, isLoading } = useQuery({
    queryKey: ["perf.me", from?.toISOString(), to?.toISOString()],
    queryFn: () => fn({ data: { from: from?.toISOString(), to: to?.toISOString() } }),
  });

  const c = data?.counters;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Performance</h1>
          <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
            Your contact activity and conversion attribution.
          </p>
        </div>
        <DateRangePicker from={from} to={to} onChange={(r) => { setFrom(r.from); setTo(r.to); }} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Stat label="Leads assigned" value={c?.leadsAssigned ?? 0} />
        <Stat label="Leads contacted" value={c?.leadsContacted ?? 0} />
        <Stat label="Contact events" value={c?.contactEvents ?? 0} />
        <Stat label="Conversions" value={c?.conversions ?? 0} accent="var(--admin-success)" />
        <Stat label="You handled" value={c?.employeeHandled ?? 0} accent="var(--admin-success)" />
        <Stat label="System paid" value={c?.systemPaid ?? 0} accent="var(--admin-accent)" />
      </div>

      <SectionCard>
        <div className="p-5">
          <div className="text-sm font-medium mb-3">Recent contact events</div>
          {isLoading ? (
            <TableSkeleton rows={6} cols={4} />
          ) : (data?.contacts ?? []).length === 0 ? (
            <div className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
              No contact events yet. Log contacts from the lead workspace.
            </div>
          ) : (
            <ul className="space-y-2">
              {(data?.contacts ?? []).map((c) => {
                const Icon = CH_ICON[c.channel] ?? StickyNote;
                return (
                  <li
                    key={c.id}
                    className="flex items-start gap-3 rounded-md border p-3"
                    style={{ borderColor: "var(--admin-border)" }}
                  >
                    <Icon className="size-4 mt-0.5 opacity-70" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-medium capitalize">{c.channel}</span>
                        <span className="mx-1.5" style={{ color: "var(--admin-fg-muted)" }}>•</span>
                        <span className="capitalize">{c.outcome.replace("_", " ")}</span>
                      </div>
                      {c.notes && <div className="text-xs mt-0.5" style={{ color: "var(--admin-fg-muted)" }}>{c.notes}</div>}
                    </div>
                    <div className="text-[11px] shrink-0" style={{ color: "var(--admin-fg-muted)" }}>
                      {formatIST(c.created_at)}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
    >
      <div className="text-xs uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold" style={{ color: accent ?? "var(--admin-fg)" }}>
        {value}
      </div>
    </div>
  );
}
