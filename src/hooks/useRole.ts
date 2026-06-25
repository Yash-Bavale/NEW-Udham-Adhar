import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyStaffRoles } from "@/lib/crm/users-admin.functions";
import { bestAccess, canApproveRefund, canSeeModule, canSeeMoney, hideMoneyFor, type Module, type Access } from "@/lib/roles";
import { supabase } from "@/integrations/supabase/client";

export function useRole() {
  const fn = useServerFn(getMyStaffRoles);
  // Only call the protected server fn when a Supabase session exists.
  // Public routes (e.g. /admin-login) must not trigger an Unauthorized 401.
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setHasSession(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setHasSession(!!session);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["my-roles"],
    queryFn: () => fn(),
    staleTime: 60_000,
    enabled: hasSession === true,
  });
  const roles: string[] = data?.roles ?? [];
  return {
    loading: hasSession === null || (hasSession && isLoading),
    roles,
    has: (r: string) => roles.includes(r),
    hasAny: (rs: string[]) => rs.some((r) => roles.includes(r)),
    access: (m: Module): Access => bestAccess(roles, m),
    can: (m: Module) => canSeeModule(roles, m),
    canApproveRefund: () => canApproveRefund(roles),
    canSeeMoney: () => canSeeMoney(roles),
    hideMoney: () => hideMoneyFor(roles),
  };
}
