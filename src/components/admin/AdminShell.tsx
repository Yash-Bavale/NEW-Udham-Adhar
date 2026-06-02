import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Users, FileText, Briefcase, UserCog, Activity, Mail, CreditCard,
  LogOut, Menu, Moon, Sun, ChevronRight, Receipt, Wallet,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminThemeProvider, useAdminTheme } from "@/components/admin/theme";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/leads", label: "Leads", icon: Users },
  { to: "/admin/applications", label: "Applications", icon: FileText },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/gateways", label: "Gateways", icon: CreditCard },
  { to: "/admin/finance/gst", label: "GST Report", icon: Receipt },
  { to: "/admin/finance/settlements", label: "Settlements", icon: Wallet },
  { to: "/admin/emails", label: "Emails", icon: Mail },
  { to: "/admin/users", label: "Users", icon: UserCog },
  { to: "/admin/activity", label: "Activity", icon: Activity },
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
  const { theme, toggle } = useAdminTheme();

  const current = NAV.find((n) => path.startsWith(n.to));

  return (
    <div className="min-h-screen flex" style={{ background: "var(--admin-bg)", color: "var(--admin-fg)" }}>
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="shrink-0 flex flex-col border-r"
        style={{ background: "var(--admin-sidebar)", color: "var(--admin-sidebar-fg)", borderColor: "var(--admin-border)" }}
      >
        <div className="flex items-center gap-2 px-4 py-4 border-b" style={{ borderColor: "color-mix(in oklab, var(--admin-sidebar-fg) 10%, transparent)" }}>
          <div
            className="size-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
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
                <div className="text-sm font-semibold leading-tight">CRM Admin</div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-sidebar-muted)" }}>
                  Business Help
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {NAV.map((n) => {
            const active = path.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors group"
                style={{
                  background: active ? "color-mix(in oklab, var(--admin-accent) 20%, transparent)" : "transparent",
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
        </nav>

        <div className="p-3 border-t space-y-2" style={{ borderColor: "color-mix(in oklab, var(--admin-sidebar-fg) 10%, transparent)" }}>
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
          className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b backdrop-blur-md"
          style={{
            background: "color-mix(in oklab, var(--admin-bg) 80%, transparent)",
            borderColor: "var(--admin-border)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="rounded-lg p-1.5 hover:bg-[var(--admin-surface-2)] transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="size-4" />
            </button>
            <nav className="flex items-center gap-1.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>
              <span>Admin</span>
              {current && (
                <>
                  <ChevronRight className="size-3" />
                  <span style={{ color: "var(--admin-fg)" }} className="font-medium">{current.label}</span>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-2">
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
          <AnimatePresence mode="wait">
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
