import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/leads", label: "Leads" },
  { to: "/admin/applications", label: "Applications" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/activity", label: "Activity" },
] as const;

export function AdminShell({ children, email }: { children: ReactNode; email?: string }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <aside className="w-60 shrink-0 bg-slate-900 text-slate-100 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="text-sm font-semibold">CRM Admin</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Business Help Services</div>
        </div>
        <nav className="flex-1 py-3">
          {NAV.map((n) => {
            const active = path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`block px-5 py-2 text-sm transition-colors ${
                  active ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs space-y-2">
          {email && <div className="text-slate-400 truncate" title={email}>{email}</div>}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/admin-login" });
            }}
            className="w-full rounded bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-slate-200"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="px-6 py-5 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
