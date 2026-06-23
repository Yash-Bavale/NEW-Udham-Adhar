import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  LayoutDashboard, Users, UserCircle2, ShoppingBag, FileText, MessageSquareWarning,
  Briefcase, Receipt, CreditCard, LifeBuoy, ListChecks, BarChart3, UserCog,
  Mail, MessageCircle, Settings as SettingsIcon, LogOut, Bell, Search, Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminThemeProvider } from "@/components/admin/theme";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { useKeyboardShortcuts } from "@/components/admin/KeyboardShortcuts";
import { getUnreadNotificationCount } from "@/lib/crm/notifications.functions";
import { globalSearch, type SearchHit } from "@/lib/crm/global-search.functions";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { useRole } from "@/hooks/useRole";
import { useNewLeadsWatcher } from "@/hooks/useNewLeadsWatcher";
import { NotificationsOptIn } from "@/components/admin/NotificationsOptIn";
import type { Module } from "@/lib/roles";

type NavItem = { to: string; label: string; icon: typeof Users; module?: Module };
type NavGroup = { id: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    id: "g1",
    items: [{ to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, module: "dashboard" }],
  },
  {
    id: "g2",
    items: [
      { to: "/admin/leads", label: "Leads", icon: Users, module: "leads" },
      { to: "/admin/customers", label: "Customers", icon: UserCircle2, module: "customers" },
      { to: "/admin/orders", label: "Orders", icon: ShoppingBag, module: "orders" },
      { to: "/admin/documents", label: "Documents", icon: FileText, module: "documents" },
    ],
  },
  {
    id: "g3",
    items: [
      { to: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning, module: "complaints" },
      { to: "/admin/services", label: "Services", icon: Briefcase },
      { to: "/admin/invoices", label: "Invoices", icon: Receipt, module: "invoices" },
      { to: "/admin/payments", label: "Payments", icon: CreditCard, module: "payments" },
    ],
  },
  {
    id: "g4",
    items: [
      { to: "/admin/tickets", label: "Support Tickets", icon: LifeBuoy, module: "tickets" },
      { to: "/admin/tasks", label: "Tasks", icon: ListChecks, module: "tasks" },
      { to: "/admin/reports", label: "Reports", icon: BarChart3, module: "reports" },
    ],
  },
  {
    id: "g5",
    items: [
      { to: "/admin/employees", label: "Employees", icon: UserCog, module: "employees" },
      { to: "/admin/emails", label: "Email System", icon: Mail },
      { to: "/admin/email-templates", label: "Email Templates", icon: Mail, module: "email_templates" },
      { to: "/admin/whatsapp-templates", label: "WhatsApp Templates", icon: MessageCircle },
      { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

const FLAT_NAV: NavItem[] = NAV.flatMap((g) => g.items);

export function AdminShell({ children, email }: { children: ReactNode; email?: string }) {
  return (
    <AdminThemeProvider>
      <Shell email={email}>{children}</Shell>
    </AdminThemeProvider>
  );
}

function Shell({ children, email }: { children: ReactNode; email?: string }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const role = useRole();
  const visibleNav: NavGroup[] = NAV
    .map((g) => ({ ...g, items: g.items.filter((it) => !it.module || role.can(it.module)) }))
    .filter((g) => g.items.length > 0);
  const flatVisible = visibleNav.flatMap((g) => g.items);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { unseen: newLeads } = useNewLeadsWatcher();

  useKeyboardShortcuts(() => setPaletteOpen(true), () => {});

  const isActive = (to: string) =>
    path === to || (to !== "/admin/dashboard" && path.startsWith(to + "/"));

  return (
    <div className="min-h-screen flex" style={{ background: "var(--admin-bg)", color: "var(--admin-fg)" }}>
      {/* Desktop sidebar — fixed 220px */}
      <aside
        className="hidden md:flex shrink-0 flex-col border-r"
        style={{
          width: 220,
          background: "var(--admin-sidebar)",
          color: "var(--admin-sidebar-fg)",
          borderColor: "var(--admin-border)",
        }}
      >
        <div
          className="flex items-center gap-2 px-4 h-14 border-b shrink-0"
          style={{ borderColor: "var(--admin-border)" }}
        >
          <div
            className="size-8 rounded-md flex items-center justify-center font-semibold text-sm shrink-0"
            style={{ background: "var(--admin-primary)", color: "#fff" }}
          >
            UA
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium leading-tight">Udyam Ops OS</div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-sidebar-muted)" }}>
              Admin
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {visibleNav.map((group, gi) => (
            <div key={group.id}>
              {gi > 0 && (
                <div className="my-2 mx-2 h-px" style={{ background: "var(--admin-border)" }} />
              )}
              <div className="space-y-0.5">
                {group.items.map((n) => {
                  const active = isActive(n.to);
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors"
                      style={{
                        background: active ? "var(--admin-accent-soft)" : "transparent",
                        color: active ? "var(--admin-primary)" : "var(--admin-sidebar-fg)",
                        fontWeight: active ? 500 : 400,
                      }}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{n.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="my-2 mx-2 h-px" style={{ background: "var(--admin-border)" }} />
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/admin-login" });
            }}
            className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors hover:bg-[var(--admin-surface-2)]"
            style={{ color: "var(--admin-sidebar-fg)" }}
          >
            <LogOut className="size-4 shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center gap-3 px-4 md:px-6 h-14 border-b"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
        >
          <div className="md:hidden font-medium text-sm" style={{ color: "var(--admin-primary)" }}>
            Udyam Ops OS
          </div>
          <div className="flex-1 max-w-2xl">
            <GlobalSearchInput onOpenPalette={() => setPaletteOpen(true)} />
          </div>
          <div className="flex items-center gap-1">
            <NotificationsBell />
            <UserMenu email={email} onSignOut={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/admin-login" });
            }} />
          </div>
        </header>

        <div className="flex-1 p-6 pb-24 md:pb-6 w-full max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav — icons only, shows primary destinations */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t flex items-stretch justify-around"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
      >
        {flatVisible.slice(0, 6).map((n) => {
          const active = isActive(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              className="flex-1 flex items-center justify-center py-2.5"
              style={{
                color: active ? "var(--admin-primary)" : "var(--admin-fg-muted)",
                background: active ? "var(--admin-accent-soft)" : "transparent",
              }}
              aria-label={n.label}
            >
              <Icon className="size-5" />
            </Link>
          );
        })}
      </nav>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}

function GlobalSearchInput({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const search = useServerFn(globalSearch);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data, isFetching } = useQuery<{ hits: SearchHit[] }>({
    queryKey: ["global-search", q],
    queryFn: () => search({ data: { q } }),
    enabled: q.trim().length >= 2,
    staleTime: 5_000,
  });

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const hits = data?.hits ?? [];

  return (
    <div ref={wrapRef} className="relative">
      <div
        className="flex items-center gap-2 rounded-md border px-3 h-9"
        style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}
      >
        <Search className="size-4 shrink-0" style={{ color: "var(--admin-fg-muted)" }} />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => q.length >= 2 && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setOpen(false); (e.target as HTMLInputElement).blur(); }
          }}
          placeholder="Search orders, customers, mobiles, complaints, Udyam no…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--admin-fg-subtle)]"
          aria-label="Global search"
        />
        {isFetching && <Loader2 className="size-3.5 animate-spin" style={{ color: "var(--admin-fg-muted)" }} />}
        <button
          onClick={onOpenPalette}
          className="hidden sm:inline-flex rounded border px-1.5 py-0.5 text-[10px] font-mono"
          style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}
          aria-label="Open command palette"
        >
          ⌘K
        </button>
      </div>

      {open && q.trim().length >= 2 && (
        <div
          className="absolute left-0 right-0 mt-1 rounded-md border max-h-[420px] overflow-y-auto z-40"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
        >
          {hits.length === 0 ? (
            <div className="px-3 py-4 text-xs" style={{ color: "var(--admin-fg-muted)" }}>
              {isFetching ? "Searching…" : "No matches."}
            </div>
          ) : (
            <ul className="py-1">
              {hits.map((h) => (
                <li key={`${h.kind}-${h.id}`}>
                  <button
                    onClick={() => {
                      setOpen(false);
                      setQ("");
                      navigate({ to: h.href });
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[var(--admin-surface-2)] flex items-start gap-2"
                  >
                    <span
                      className="shrink-0 mt-0.5 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide font-medium"
                      style={{ background: "var(--admin-surface-2)", color: "var(--admin-fg-muted)" }}
                    >
                      {h.kind}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm truncate" style={{ color: "var(--admin-fg)" }}>{h.title}</span>
                      {h.subtitle && (
                        <span className="block text-[11px] truncate" style={{ color: "var(--admin-fg-muted)" }}>{h.subtitle}</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationsBell() {
  const fetchCount = useServerFn(getUnreadNotificationCount);
  const qc = useQueryClient();
  const { data } = useQuery<{ count: number }>({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => fetchCount(),
    refetchInterval: 60_000,
  });
  useRealtimeTable("notifications", () => {
    qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
  });
  const count = data?.count ?? 0;
  return (
    <Link
      to="/admin/notifications"
      className="relative rounded-md p-2 hover:bg-[var(--admin-surface-2)] transition-colors"
      aria-label="Notifications"
    >
      <Bell className="size-4" />
      {count > 0 && (
        <span
          className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-semibold flex items-center justify-center"
          style={{ background: "var(--admin-danger)", color: "white" }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function UserMenu({ email, onSignOut }: { email?: string; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const initial = (email ?? "U").slice(0, 1).toUpperCase();
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="size-8 rounded-full flex items-center justify-center text-xs font-medium"
        style={{ background: "var(--admin-primary)", color: "#fff" }}
        aria-label="Account menu"
      >
        {initial}
      </button>
      {open && (
        <div
          className="absolute right-0 mt-1 w-56 rounded-md border z-40"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
        >
          {email && (
            <div className="px-3 py-2 border-b text-xs truncate" style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}>
              {email}
            </div>
          )}
          <button
            onClick={onSignOut}
            className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--admin-surface-2)] flex items-center gap-2"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
