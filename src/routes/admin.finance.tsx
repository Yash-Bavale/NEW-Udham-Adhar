import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/finance")({
  head: () => ({ meta: [{ title: "Finance — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: FinanceLayout,
});

function FinanceLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const tabs = [
    { to: "/admin/finance", label: "Overview", exact: true },
    { to: "/admin/finance/gst", label: "GST Reports" },
    { to: "/admin/finance/settlements", label: "Settlements" },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 border-b" style={{ borderColor: "var(--admin-border)" }}>
        {tabs.map((t) => {
          const active = t.exact ? path === t.to : path.startsWith(t.to);
          return (
            <Link
              key={t.to}
              to={t.to}
              className="px-3 py-2 text-sm -mb-px border-b-2 transition-colors"
              style={{
                borderColor: active ? "var(--admin-accent)" : "transparent",
                color: active ? "var(--admin-fg)" : "var(--admin-fg-muted)",
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      {path === "/admin/finance" ? (
        <ComingSoon
          title="Revenue Dashboard"
          subtitle="Today / MTD revenue, pending, failed, refunds, service revenue, gateway performance, GST and settlement analytics."
          phase="5.5g"
          fallbackHref="/admin/finance/gst"
          fallbackLabel="the existing GST report"
        />
      ) : (
        <Outlet />
      )}
    </div>
  );
}
