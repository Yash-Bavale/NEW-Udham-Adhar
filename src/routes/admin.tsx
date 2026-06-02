import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Business Help Services" }, { name: "robots", content: "noindex,nofollow" }] }),
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin-login" });
  },
  component: AdminLayout,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-red-700">Admin error: {error.message}</div>
  ),
});

function AdminLayout() {
  const [email, setEmail] = useState<string>();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? undefined));
  }, []);
  return (
    <AdminShell email={email}>
      <Outlet />
    </AdminShell>
  );
}
