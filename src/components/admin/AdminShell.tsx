import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  LayoutDashboard, Users, UserCircle2, ShoppingBag, FileText, MessageSquareWarning,
  Briefcase, Receipt, CreditCard, LifeBuoy, ListChecks, BarChart3, UserCog,
  Mail, MessageCircle, Settings as SettingsIcon, LogOut, Bell, Search, Loader2,
  Inbox, Activity, FileCheck2, ClipboardList, Eye, Award,
  Banknote, ShieldCheck, ScrollText, Globe, ShieldAlert, X, ArrowRight, Phone,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminThemeProvider } from "@/components/admin/theme";
import { Menu } from "lucide-react";
import bhsLogo from "@/assets/bhs-logo.png.asset.json";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { useKeyboardShortcuts } from "@/components/admin/KeyboardShortcuts";
import {
  getUnreadNotificationCount,
  getSidebarNotificationCounts,
  listMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
  type SidebarNotificationCounts,
} from "@/lib/crm/notifications.functions";
import { useMutation } from "@tanstack/react-query";
import { globalSearch, type SearchHit } from "@/lib/crm/global-search.functions";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { useRole } from "@/hooks/useRole";
import { useNewLeadsWatcher } from "@/hooks/useNewLeadsWatcher";
import { NotificationsOptIn } from "@/components/admin/NotificationsOptIn";
import type { Module } from "@/lib/roles";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Users;
  module?: Module;
  /** Only show when current user holds this role. */
  requireRole?: string;
  /** Only show when current user holds any of these roles. */
  requireAnyRole?: string[];

};
type NavGroup = { id: string; label: string; items: NavItem[] };

const OPS_ROLES = ["admin", "super_admin", "manager", "operations", "executive"];
const FINANCE_ROLES = ["admin", "super_admin", "finance", "accounts"];
const ADMIN_ROLES = ["admin", "super_admin"];

const NAV: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { to: "/admin/dashboard", label: "Executive Dashboard", icon: LayoutDashboard, module: "dashboard", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/my-work", label: "My Dashboard", icon: Inbox },

      { to: "/admin/activity", label: "Activity", icon: Activity, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/notifications", label: "Notifications", icon: Bell },
      { to: "/admin/my-performance", label: "My Performance", icon: BarChart3, requireAnyRole: ADMIN_ROLES },
    ],
  },
  {
    id: "work",
    label: "Work",
    items: [
      { to: "/admin/leads", label: "Leads", icon: Users, module: "leads", requireAnyRole: OPS_ROLES },
      { to: "/admin/orders", label: "Orders", icon: ShoppingBag, module: "orders", requireAnyRole: OPS_ROLES },
      { to: "/admin/customers", label: "Customers", icon: UserCircle2, module: "customers", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/documents", label: "Documents", icon: FileText, module: "documents", requireAnyRole: OPS_ROLES },
      { to: "/admin/review", label: "Doc Review", icon: Eye, module: "documents", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/tasks", label: "Tasks", icon: ListChecks, module: "tasks" },
    ],
  },
  {
    id: "service",
    label: "Service",
    items: [
      { to: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning, module: "complaints", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/tickets", label: "Support Tickets", icon: LifeBuoy, module: "tickets", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/canned-responses", label: "Canned Responses", icon: LifeBuoy, module: "tickets", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/quarantine", label: "Email Quarantine", icon: Mail, module: "tickets", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/websites", label: "Websites", icon: Globe, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/services", label: "Services", icon: Briefcase, requireAnyRole: ADMIN_ROLES },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      { to: "/admin/invoices", label: "Invoices", icon: Receipt, module: "invoices", requireAnyRole: FINANCE_ROLES },
      { to: "/admin/payments", label: "Payments", icon: CreditCard, module: "payments", requireAnyRole: FINANCE_ROLES },
      { to: "/admin/gateways", label: "Gateways", icon: Banknote, module: "payments", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/finance", label: "Finance (GST)", icon: Banknote, module: "payments", requireAnyRole: FINANCE_ROLES },
      { to: "/admin/refunds", label: "Refund Review", icon: Banknote, requireAnyRole: FINANCE_ROLES },
      { to: "/admin/certificates", label: "Certificates", icon: Award, requireAnyRole: ADMIN_ROLES },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    items: [
      { to: "/admin/reports", label: "Reports", icon: BarChart3, module: "reports", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/performance", label: "Employee Performance", icon: BarChart3, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/audit", label: "Audit Log", icon: ScrollText, module: "audit_log", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/seo", label: "SEO", icon: Globe, requireAnyRole: ADMIN_ROLES },
    ],
  },
  {
    id: "admin",
    label: "System",
    items: [
      { to: "/admin/employees", label: "Employees", icon: UserCog, module: "employees", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/users", label: "Users & Roles", icon: ShieldCheck, module: "employees", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/permissions", label: "Permissions", icon: ShieldCheck, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/emails", label: "Email System", icon: Mail, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/email-templates", label: "Email Templates", icon: Mail, module: "email_templates", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/whatsapp-templates", label: "WhatsApp Templates", icon: MessageCircle, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/super", label: "Super Admin", icon: ShieldAlert, requireRole: "super_admin" },
      { to: "/admin/settings", label: "Settings", icon: SettingsIcon, requireAnyRole: ADMIN_ROLES },
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
    .map((g) => ({
      ...g,
      items: g.items.filter((it) =>
        (!it.module || role.can(it.module)) &&
        (!it.requireRole || role.has(it.requireRole)) &&
        (!it.requireAnyRole || it.requireAnyRole.some((r) => role.has(r))),
      ),
    }))
    .filter((g) => g.items.length > 0);
  const flatVisible = visibleNav.flatMap((g) => g.items);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("bhs.admin.sidebarCollapsed") === "1";
  });
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("bhs.admin.sidebarCollapsed", sidebarCollapsed ? "1" : "0");
  }, [sidebarCollapsed]);
  const { unseen: newLeads } = useNewLeadsWatcher();

  const fetchSidebarCounts = useServerFn(getSidebarNotificationCounts);
  const { data: sidebarCounts } = useQuery<SidebarNotificationCounts>({
    queryKey: ["sidebar-notification-counts"],
    queryFn: () => fetchSidebarCounts(),
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  // Track which module paths have been visited this session —
  // once you navigate to a section, its badge clears until the next page refresh.
  const CLEARABLE_PATHS = useMemo(
    () => [
      "/admin/orders",
      "/admin/review",
      "/admin/tasks",
      "/admin/complaints",
      "/admin/tickets",
      "/admin/quarantine",
      "/admin/refunds",
    ],
    [],
  );
  const currentPath = path ?? "";
  const [visitedPaths, setVisitedPaths] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    if (!currentPath) return;
    const matched = CLEARABLE_PATHS.find(
      (p) => currentPath === p || currentPath.startsWith(p + "/"),
    );
    if (matched) {
      setVisitedPaths((prev) => {
        if (prev.has(matched)) return prev;
        const next = new Set(prev);
        next.add(matched);
        return next;
      });
    }
  }, [currentPath, CLEARABLE_PATHS]);

  const getSidebarBadge = (to: string): number => {
    // Notifications page: always show unread count (never suppressed)
    if (to === "/admin/notifications") return sidebarCounts?.notifications ?? 0;
    // Leads: uses its own watcher — only new-since-last-visit
    if (to === "/admin/leads") return newLeads > 0 ? newLeads : 0;
    // All other clearable sections: suppress once visited
    if (visitedPaths.has(to)) return 0;
    if (!sidebarCounts) return 0;
    if (to === "/admin/orders") return sidebarCounts.orders;
    if (to === "/admin/review") return sidebarCounts.docReview;
    if (to === "/admin/tasks") return sidebarCounts.tasks;
    if (to === "/admin/complaints") return sidebarCounts.complaints;
    if (to === "/admin/tickets") return sidebarCounts.tickets;
    if (to === "/admin/quarantine") return sidebarCounts.quarantine;
    if (to === "/admin/refunds") return sidebarCounts.refunds;
    return 0;
  };

  useKeyboardShortcuts(() => setPaletteOpen(true), () => { });

  const isActive = (to: string) =>
    !!currentPath && (currentPath === to || (to !== "/admin/dashboard" && currentPath.startsWith(to + "/")));

  return (
    <div className="min-h-screen flex" style={{ background: "var(--admin-bg)", color: "var(--admin-fg)" }}>
      {/* Desktop sidebar — collapsible */}
      <aside
        className="hidden md:flex shrink-0 flex-col border-r transition-[width] duration-200"
        style={{
          width: sidebarCollapsed ? 64 : 220,
          background: "var(--admin-sidebar)",
          color: "var(--admin-sidebar-fg)",
          borderColor: "var(--admin-border)",
        }}
      >
        <div
          className="flex items-center gap-2 px-3 h-14 border-b shrink-0"
          style={{ borderColor: "var(--admin-border)" }}
        >
          <button
            type="button"
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="shrink-0 rounded-full p-2 hover:bg-[var(--admin-surface-2)]"
            style={{ color: "var(--admin-sidebar-fg)" }}
          >
            <Menu className="size-5" />
          </button>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <img src={bhsLogo.url} alt="Business Help Services" className="size-8 rounded-md object-contain shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium leading-tight truncate">Business Help</div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-sidebar-muted)" }}>
                  ADMIN
                </div>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {visibleNav.map((group, gi) => (
            <div key={group.id}>
              {gi > 0 && (
                <div className="my-2 mx-2 h-px" style={{ background: "var(--admin-border)" }} />
              )}
              {!sidebarCollapsed && (
                <div
                  className="px-2.5 pt-1 pb-1 text-[10px] uppercase tracking-wider"
                  style={{ color: "var(--admin-sidebar-muted)" }}
                >
                  {group.label}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((n) => {
                  const active = isActive(n.to);
                  const Icon = n.icon;
                  const badge = getSidebarBadge(n.to);
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      title={sidebarCollapsed ? `${n.label}${badge > 0 ? ` (${badge} new)` : ""}` : undefined}
                      className={cn(
                        "relative flex items-center gap-2.5 rounded-md py-1.5 text-[13px] transition-colors",
                        sidebarCollapsed ? "justify-center px-1.5" : "px-2.5",
                      )}
                      style={{
                        background: active ? "var(--admin-accent-soft)" : "transparent",
                        color: active ? "var(--admin-primary)" : "var(--admin-sidebar-fg)",
                        fontWeight: active ? 500 : 400,
                      }}
                    >
                      <div className="relative shrink-0">
                        <Icon className="size-4" />
                        {sidebarCollapsed && badge > 0 && (
                          <span
                            className="absolute -top-1 -right-1 size-2 rounded-full ring-2 ring-[var(--admin-sidebar)]"
                            style={{ background: "var(--admin-danger)" }}
                          />
                        )}
                      </div>
                      {!sidebarCollapsed && <span className="truncate flex-1">{n.label}</span>}
                      {!sidebarCollapsed && badge > 0 && (
                        <span
                          className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold flex items-center justify-center shrink-0"
                          style={{ background: "var(--admin-danger)", color: "#fff" }}
                        >
                          {badge > 99 ? "99+" : badge}
                        </span>
                      )}
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
            title={sidebarCollapsed ? "Logout" : undefined}
            className={cn(
              "w-full flex items-center gap-2.5 rounded-md py-1.5 text-[13px] transition-colors hover:bg-[var(--admin-surface-2)]",
              sidebarCollapsed ? "justify-center px-1.5" : "px-2.5",
            )}
            style={{ color: "var(--admin-sidebar-fg)" }}
          >
            <LogOut className="size-4 shrink-0" />
            {!sidebarCollapsed && <span className="truncate">Logout</span>}
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
            Business Help
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
          <NotificationsOptIn />
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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const search = useServerFn(globalSearch);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  // Filter out any customer hits just in case
  const hits = useMemo(() => (data?.hits ?? []).filter((h) => (h as any).kind !== "customer"), [data]);

  // Reset selected index when hits change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [hits]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!open || hits.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < hits.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : hits.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < hits.length) {
      e.preventDefault();
      const target = hits[selectedIndex];
      if (target) {
        setOpen(false);
        setQ("");
        navigate({ to: target.href });
      }
    }
  };

  // Categorize hits into Orders, Leads, and System
  const appHits = useMemo(() => hits.filter((h) => h.kind === "application"), [hits]);
  const leadHits = useMemo(() => hits.filter((h) => h.kind === "lead"), [hits]);
  const otherHits = useMemo(() => hits.filter((h) => h.kind !== "application" && h.kind !== "lead"), [hits]);

  return (
    <div ref={wrapRef} className="relative w-full max-w-xl">
      {/* Modern Search Input Container */}
      <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3 h-10 shadow-2xs transition-all duration-150 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-3 focus-within:ring-indigo-500/15 hover:border-slate-300">
        <Search className="size-4 shrink-0 text-slate-400 focus-within:text-indigo-600 transition-colors" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => q.length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search orders, leads, mobiles, emails, application codes…"
          className="flex-1 bg-transparent px-2.5 outline-none text-sm text-slate-900 placeholder:text-slate-400 font-medium"
          aria-label="Global search"
        />

        <div className="flex items-center gap-1.5 shrink-0">
          {q && (
            <button
              type="button"
              onClick={() => { setQ(""); setOpen(false); inputRef.current?.focus(); }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            >
              <X className="size-3.5" />
            </button>
          )}

          {isFetching ? (
            <Loader2 className="size-4 animate-spin text-indigo-600" />
          ) : (
            <button
              type="button"
              onClick={onOpenPalette}
              className="hidden sm:inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 shadow-2xs hover:bg-slate-50"
              title="Open command palette"
            >
              <span className="font-mono">⌘K</span>
            </button>
          )}
        </div>
      </div>

      {/* Modern Search Results Dropdown */}
      {open && q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-[500px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {hits.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 space-y-1">
              {isFetching ? (
                <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium">
                  <Loader2 className="size-4 animate-spin" /> Searching workspace…
                </div>
              ) : (
                <>
                  <div className="font-semibold text-slate-700 text-sm">No matching records found</div>
                  <div>Search by Order Code (AP-XXXX), Lead Code (UA-XXXX), Mobile Number or Email</div>
                </>
              )}
            </div>
          ) : (
            <div className="p-2 space-y-3">
              {/* Applications / Orders Section */}
              {appHits.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-900/70 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="size-3 text-indigo-600" /> Orders &amp; Applications
                    </span>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 font-semibold">
                      {appHits.length}
                    </span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {appHits.map((h) => {
                      const globalIdx = hits.indexOf(h);
                      const isSelected = globalIdx === selectedIndex;
                      return (
                        <button
                          key={`app-${h.id}`}
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            setQ("");
                            navigate({ to: h.href });
                          }}
                          className={cn(
                            "w-full text-left p-2.5 rounded-xl transition-all duration-150 flex flex-col gap-1.5 group border",
                            isSelected
                              ? "bg-indigo-50/80 border-indigo-200 shadow-2xs"
                              : "border-transparent hover:bg-slate-50 hover:border-slate-200/80"
                          )}
                        >
                          {/* Top row: Code + Stage Pill */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono font-bold text-xs text-indigo-950 group-hover:text-indigo-600 transition-colors">
                              {h.title}
                            </span>
                            {h.stageLabel && (
                              <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border", h.stageBadgeClass)}>
                                {h.stageLabel}
                              </span>
                            )}
                          </div>

                          {/* Middle row: Customer Name + Mobile + Email */}
                          <div className="flex items-center gap-3 text-xs text-slate-700 flex-wrap">
                            <span className="font-semibold text-slate-900 flex items-center gap-1">
                              <UserCircle2 className="size-3 text-slate-400" />
                              {h.customerName}
                            </span>
                            {h.mobile && (
                              <span className="flex items-center gap-1 text-slate-600 text-[11px] font-mono">
                                <Phone className="size-3 text-emerald-600" />
                                {h.mobile}
                              </span>
                            )}
                            {h.email && (
                              <span className="flex items-center gap-1 text-slate-600 text-[11px] truncate max-w-[200px]">
                                <Mail className="size-3 text-sky-600" />
                                {h.email}
                              </span>
                            )}
                          </div>

                          {/* Bottom row: Service Name */}
                          {h.serviceName && (
                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5 border-t border-slate-100/80">
                              <span className="truncate">{h.serviceName}</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Leads Section */}
              {leadHits.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="size-3 text-slate-500" /> Leads
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-semibold">
                      {leadHits.length}
                    </span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {leadHits.map((h) => {
                      const globalIdx = hits.indexOf(h);
                      const isSelected = globalIdx === selectedIndex;
                      return (
                        <button
                          key={`lead-${h.id}`}
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            setQ("");
                            navigate({ to: h.href });
                          }}
                          className={cn(
                            "w-full text-left p-2.5 rounded-xl transition-all duration-150 flex flex-col gap-1 border",
                            isSelected
                              ? "bg-slate-100 border-slate-300"
                              : "border-transparent hover:bg-slate-50 hover:border-slate-200/80"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-xs text-slate-900">
                              {h.customerName || h.title}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              Lead
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-600 flex-wrap">
                            {h.mobile && (
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="size-3 text-emerald-600" />
                                {h.mobile}
                              </span>
                            )}
                            {h.email && (
                              <span className="flex items-center gap-1 truncate max-w-[220px]">
                                <Mail className="size-3 text-sky-600" />
                                {h.email}
                              </span>
                            )}
                            {h.serviceName && <span className="text-slate-500">· {h.serviceName}</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other Hits Section (Invoices, Certificates, Complaints) */}
              {otherHits.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    System Records
                  </div>
                  <div className="space-y-1 mt-1">
                    {otherHits.map((h) => {
                      const globalIdx = hits.indexOf(h);
                      const isSelected = globalIdx === selectedIndex;
                      return (
                        <button
                          key={`other-${h.id}`}
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            setQ("");
                            navigate({ to: h.href });
                          }}
                          className={cn(
                            "w-full text-left p-2 rounded-lg transition-all duration-150 flex items-center justify-between text-xs border",
                            isSelected
                              ? "bg-slate-100 border-slate-300"
                              : "border-transparent hover:bg-slate-50 hover:border-slate-200/80"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="uppercase text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {h.kind}
                            </span>
                            <span className="font-medium text-slate-900">{h.title}</span>
                          </div>
                          {h.subtitle && <span className="text-slate-500 text-[11px]">{h.subtitle}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const MUTE_KEY = "bhs.notif.muted";
function playChime() {
  try {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(MUTE_KEY) === "1") return;
    const AC: typeof AudioContext | undefined =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
    osc.onended = () => ctx.close().catch(() => { });
  } catch { /* ignore */ }
}

function NotificationsBell() {
  const navigate = useNavigate();
  const fetchCount = useServerFn(getUnreadNotificationCount);
  const qc = useQueryClient();
  const [hasSession, setHasSession] = useState(false);
  const [muted, setMuted] = useState(false);
  const lastCountRef = useRef<number>(0);
  const primedRef = useRef<boolean>(false);
  useEffect(() => {
    if (typeof window !== "undefined") setMuted(localStorage.getItem(MUTE_KEY) === "1");
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setHasSession(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setHasSession(!!session);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  const { data } = useQuery<{ count: number }>({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      try {
        return await fetchCount();
      } catch {
        // Swallow transient 401s during sign-in/out so the bell doesn't blank the page.
        return { count: 0 };
      }
    },
    refetchInterval: 60_000,
    enabled: hasSession,
    retry: false,
  });
  useRealtimeTable("notifications", () => {
    if (!hasSession) return;
    qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
  });
  const count = data?.count ?? 0;

  // Chime on count increase (after initial prime so mount doesn't ring).
  useEffect(() => {
    if (!primedRef.current) {
      primedRef.current = true;
      lastCountRef.current = count;
      return;
    }
    if (count > lastCountRef.current) playChime();
    lastCountRef.current = count;
  }, [count]);

  // Dropdown panel state + recent list
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const fetchList = useServerFn(listMyNotifications);
  const markRead = useServerFn(markNotificationRead);
  const markAll = useServerFn(markAllNotificationsRead);
  const { data: listData, refetch: refetchList } = useQuery<{ rows: Notification[] }>({
    queryKey: ["notifications", "recent"],
    queryFn: () => fetchList({ data: { limit: 20 } }),
    enabled: hasSession && open,
    staleTime: 15_000,
  });
  const rawRecent = listData?.rows ?? [];
  const recent = useMemo(() => {
    const seen = new Set<string>();
    return rawRecent.filter((n) => {
      const key = `${n.title.trim().toLowerCase()}|${(n.body ?? "").trim().toLowerCase()}|${n.href ?? n.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [rawRecent]);

  const markOneMut = useMutation({
    mutationFn: (id: string) => markRead({ data: { id } }),
    onSuccess: () => {
      refetchList();
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
  const markAllMut = useMutation({
    mutationFn: () => markAll(),
    onSuccess: () => {
      refetchList();
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  function relative(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  }

  return (
    <div ref={wrapRef} className="relative flex items-center gap-1">
      <button
        onClick={() => {
          const next = !muted;
          setMuted(next);
          try { localStorage.setItem(MUTE_KEY, next ? "1" : "0"); } catch { }
        }}
        className="rounded-md p-1.5 hover:bg-[var(--admin-surface-2)] transition-colors text-[10px]"
        style={{ color: "var(--admin-fg-muted)" }}
        aria-label={muted ? "Unmute notifications" : "Mute notifications"}
        title={muted ? "Notification sound muted — click to unmute" : "Mute notification sound"}
      >
        {muted ? "🔕" : "🔔"}
      </button>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-md p-2 hover:bg-[var(--admin-surface-2)] transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
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
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-[380px] rounded-lg border shadow-xl z-50 overflow-hidden"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "var(--admin-border)" }}>
            <div className="text-sm font-semibold" style={{ color: "var(--admin-fg)" }}>
              Notifications {count > 0 && <span className="ml-1 text-[11px] font-medium text-indigo-600">({count} new)</span>}
            </div>
            <button
              onClick={() => markAllMut.mutate()}
              disabled={count === 0 || markAllMut.isPending}
              className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-[440px] overflow-y-auto">
            {recent.length === 0 ? (
              <div className="px-4 py-10 text-center text-xs" style={{ color: "var(--admin-fg-muted)" }}>
                You're all caught up.
              </div>
            ) : (
              <ul className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
                {recent.map((n) => {
                  const unread = !n.read_at;
                  return (
                    <li
                      key={n.id}
                      className={`px-3 py-2.5 hover:bg-[var(--admin-surface-2)] transition-colors cursor-pointer ${unread ? "bg-indigo-50/40" : ""}`}
                      onClick={() => {
                        if (unread) markOneMut.mutate(n.id);
                        if (n.href) {
                          setOpen(false);
                          navigate({ to: n.href });
                        }
                      }}
                    >
                      <div className="flex items-start gap-2">
                        {unread && <span className="mt-1.5 size-1.5 rounded-full bg-indigo-500 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <div className="text-[13px] font-medium truncate" style={{ color: "var(--admin-fg)" }}>{n.title}</div>
                            <div className="ml-auto text-[10px] shrink-0" style={{ color: "var(--admin-fg-muted)" }}>{relative(n.created_at)}</div>
                          </div>
                          {n.body && <div className="text-[11px] mt-0.5 line-clamp-2" style={{ color: "var(--admin-fg-muted)" }}>{n.body}</div>}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="px-3 py-2 border-t text-center" style={{ borderColor: "var(--admin-border)" }}>
            <Link
              to="/admin/notifications"
              onClick={() => setOpen(false)}
              className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
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
