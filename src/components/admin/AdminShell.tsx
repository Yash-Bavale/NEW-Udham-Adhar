import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Users, FileText, Briefcase, UserCog, Activity, Mail, CreditCard,
  LogOut, Menu, Moon, Sun, ChevronRight, Receipt, MessageSquareWarning,
  Award, ShieldCheck, Search, Settings as SettingsIcon,
  Sparkles, Inbox, KanbanSquare, ListChecks, Bell, Wallet, FileCheck2, Building2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminThemeProvider, useAdminTheme } from "@/components/admin/theme";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { useKeyboardShortcuts } from "@/components/admin/KeyboardShortcuts";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

type NavItem = { to: string; label: string; icon: typeof Users; group: string };

const NAV: NavItem[] = [
  // Home
  { to: "/admin/my-work", label: "My Work", icon: Inbox, group: "Home" },
  { to: "/admin/dashboard", label: "Executive Dashboard", icon: LayoutDashboard, group: "Home" },
  { to: "/admin/notifications", label: "Notifications", icon: Bell, group: "Home" },
  // Customers
  { to: "/admin/customers", label: "Customer Directory", icon: Users, group: "Customers" },
  { to: "/admin/leads", label: "Leads", icon: Sparkles, group: "Customers" },
  // Applications
  { to: "/admin/pipeline", label: "Application Pipeline", icon: KanbanSquare, group: "Applications" },
  { to: "/admin/applications", label: "Application Queue", icon: FileText, group: "Applications" },
  { to: "/admin/review", label: "Document Review", icon: FileCheck2, group: "Applications" },
  { to: "/admin/submissions", label: "Submissions", icon: FileText, group: "Applications" },
  // Operations
  { to: "/admin/tasks", label: "Tasks", icon: ListChecks, group: "Operations" },
  { to: "/admin/certificates", label: "Certificates", icon: Award, group: "Operations" },
  { to: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning, group: "Operations" },
  // Communications
  { to: "/admin/emails", label: "Email Center", icon: Mail, group: "Communications" },
  // Finance
  { to: "/admin/finance", label: "Revenue Dashboard", icon: Wallet, group: "Finance" },
  { to: "/admin/finance/gst", label: "GST Reports", icon: Receipt, group: "Finance" },
  { to: "/admin/finance/settlements", label: "Settlements", icon: CreditCard, group: "Finance" },
  // Services
  { to: "/admin/services", label: "Service Catalog", icon: Briefcase, group: "Services" },
  // People
  { to: "/admin/employees", label: "Employees", icon: UserCog, group: "People" },
  // System
  { to: "/admin/activity", label: "Activity Logs", icon: Activity, group: "System" },
  { to: "/admin/audit", label: "Audit Logs", icon: ShieldCheck, group: "System" },
  { to: "/admin/gateways", label: "Payment Gateways", icon: Building2, group: "System" },
  { to: "/admin/seo", label: "SEO Pages", icon: SettingsIcon, group: "System" },
];

const GROUP_ORDER = [
  "Home", "Customers", "Applications", "Operations", "Communications", "Finance", "Services", "People", "System",
] as const;

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
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { theme, toggle } = useAdminTheme();

  useKeyboardShortcuts(() => setPaletteOpen(true), () => setHelpOpen(true));

  const groups = NAV.reduce<Record<string, NavItem[]>>((acc, n) => {
    (acc[n.group] ||= []).push(n);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex" style={{ background: "var(--admin-bg)", color: "var(--admin-fg)" }}>
      <motion.aside
        animate={{ width: collapsed ? 72 : 248 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="shrink-0 flex flex-col border-r relative z-30"
        style={{ background: "var(--admin-sidebar)", color: "var(--admin-sidebar-fg)", borderColor: "var(--admin-border)" }}
      >
        <div className="flex items-center gap-2 px-4 py-4 border-b shrink-0" style={{ borderColor: "color-mix(in oklab, var(--admin-sidebar-fg) 10%, transparent)" }}>
          <div
            className="size-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-lg"
            style={{ background: "var(--gradient-admin)" }}
          >
            BH
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                className="min-w-0"
              >
                <div className="text-sm font-semibold leading-tight">CRM Workspace</div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-sidebar-muted)" }}>
                  Business Help · v2
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="space-y-0.5">
              {!collapsed && (
                <div className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--admin-sidebar-muted)" }}>
                  {group}
                </div>
              )}
              {items.map((n) => {
                const active = path === n.to || (n.to !== "/admin/dashboard" && path.startsWith(n.to));
                const Icon = n.icon;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors group"
                    style={{
                      background: active ? "color-mix(in oklab, var(--admin-accent) 22%, transparent)" : "transparent",
                      color: active ? "white" : "var(--admin-sidebar-muted)",
                    }}
                  >
                    {active && (
                      <motion.span
                        layoutId="admin-nav-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r"
                        style={{ background: "var(--admin-accent)" }}
                        transition={{ duration: 0.25 }}
                      />
                    )}
                    <Icon className="size-4 shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="truncate"
                        >
                          {n.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t space-y-2 shrink-0" style={{ borderColor: "color-mix(in oklab, var(--admin-sidebar-fg) 10%, transparent)" }}>
          {!collapsed && email && (
            <div className="px-2 text-[11px] truncate" title={email} style={{ color: "var(--admin-sidebar-muted)" }}>
              {email}
            </div>
          )}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/admin-login" });
            }}
            className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium hover:bg-white/10 transition-colors"
            style={{ color: "var(--admin-sidebar-fg)" }}
          >
            <LogOut className="size-3.5" />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b glass-panel"
          style={{ borderColor: "var(--admin-border)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="rounded-lg p-1.5 hover:bg-[var(--admin-surface-2)] transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="size-4" />
            </button>
            <Breadcrumbs path={path} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs text-[var(--admin-fg-muted)] hover:bg-[var(--admin-surface-2)] transition-colors min-w-[260px]"
              style={{ borderColor: "var(--admin-border)" }}
            >
              <Search className="size-3.5" />
              <span className="flex-1 text-left">Search anything…</span>
              <kbd className="rounded border px-1.5 py-0.5 text-[10px] font-mono" style={{ borderColor: "var(--admin-border)" }}>
                ⌘K
              </kbd>
            </button>
            <button
              onClick={toggle}
              className="rounded-lg p-2 hover:bg-[var(--admin-surface-2)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </header>

        <div className="flex-1 px-5 py-6 max-w-[1400px] w-full mx-auto">
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <KeyboardHelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}

function Breadcrumbs({ path }: { path: string }) {
  const current = NAV.find((n) => path === n.to || (n.to !== "/admin/dashboard" && path.startsWith(n.to)));
  return (
    <nav className="flex items-center gap-1.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>
      <span>Admin</span>
      {current && (
        <>
          <ChevronRight className="size-3" />
          <span style={{ color: "var(--admin-fg)" }} className="font-medium">{current.label}</span>
        </>
      )}
    </nav>
  );
}

function KeyboardHelpDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const rows: [string, string][] = [
    ["⌘ K  /  Ctrl K", "Open command palette · global search"],
    ["g d", "Go to Dashboard"],
    ["g c", "Go to Customers"],
    ["g l", "Go to Leads"],
    ["g a", "Go to Applications"],
    ["g s", "Go to Services"],
    ["g e", "Go to Employees"],
    ["g f", "Go to Finance"],
    ["g t", "Go to Complaints"],
    ["?", "Show this help"],
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <div className="text-sm space-y-1.5">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 border-b py-1.5" style={{ borderColor: "var(--admin-border)" }}>
              <kbd className="rounded border px-1.5 py-0.5 text-[11px] font-mono" style={{ borderColor: "var(--admin-border)" }}>{k}</kbd>
              <span className="text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
