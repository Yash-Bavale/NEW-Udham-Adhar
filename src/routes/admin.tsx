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
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-red-700">Admin error: {error.message}</div>
  ),
});

function AdminLayout() {
  const [email, setEmail] = useState<string>();
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
