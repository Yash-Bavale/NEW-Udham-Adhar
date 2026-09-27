import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  // Auth check needs browser localStorage (Supabase stores the session there),
  // so the admin subtree opts out of SSR. Without this, any hard refresh on
  // /admin/* runs beforeLoad on the server with no session → redirects to
  // /admin-login → which bounces back to /admin/dashboard, making deep links
  // and refreshes always land on the dashboard.
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Business Help Services" }, { name: "robots", content: "noindex,nofollow" }] }),
  beforeLoad: async () => {
    // 1) Must be signed in. Imported lazily so the auth SDK ships with the
    //    admin chunk instead of the bundle every public visitor downloads.
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin-login" });

    // 2) P0 SECURITY (Final_CRM Part B / audit C-1) — must hold a staff role.
    //    Uses the SECURITY DEFINER RPC `has_any_staff_role` which checks
    //    public.user_roles for any of: super_admin, admin, manager, executive,
    //    support, accounts, finance, operations.
    const { data: isStaff, error: roleErr } = await supabase.rpc("has_any_staff_role", {
      _user_id: data.user.id,
    });
    if (roleErr || isStaff !== true) {
      throw redirect({ to: "/unauthorized" });
    }
  },
  component: AdminLayout,
  pendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-slate-500 tracking-wide">Opening Admin Portal…</span>
      </div>
    </div>
  ),
  errorComponent: ({ error }: any) => (
    <div className="p-8 text-sm text-red-700">Admin error: {error.message}</div>
  ),
});

import { useEmployeePresence } from "@/hooks/useEmployeePresence";

function AdminLayout() {
  const [email, setEmail] = useState<string>();
  
  // Background presence and heartbeat tracking
  useEmployeePresence();

  // Microsoft Clarity Analytics for /admin
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).clarity) return;
    (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      if (y && y.parentNode) {
        y.parentNode.insertBefore(t, y);
      } else {
        l.head.appendChild(t);
      }
    })(window, document, "clarity", "script", "yntk765ksf");
  }, []);

  useEffect(() => {
    void import("@/integrations/supabase/client").then(({ supabase }) =>
      supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? undefined)),
    );
  }, []);
  return (
    <AdminShell email={email}>
      <Outlet />
    </AdminShell>
  );
}
