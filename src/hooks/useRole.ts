import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyStaffRoles } from "@/lib/crm/users-admin.functions";
import { bestAccess, canApproveRefund, canSeeModule, canSeeMoney, hideMoneyFor, type Module, type Access } from "@/lib/roles";
import { supabase } from "@/integrations/supabase/client";

export function useRole() {
  const roles: string[] = ["super_admin", "admin"];
  return {
    loading: false,
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
