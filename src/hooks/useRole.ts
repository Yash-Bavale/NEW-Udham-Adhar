import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyStaffRoles } from "@/lib/crm/users-admin.functions";
import { bestAccess, canApproveRefund, canSeeModule, type Module, type Access } from "@/lib/roles";

export function useRole() {
  const fn = useServerFn(getMyStaffRoles);
  const { data, isLoading } = useQuery({
    queryKey: ["my-roles"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
  const roles: string[] = data?.roles ?? [];
  return {
    loading: isLoading,
    roles,
    has: (r: string) => roles.includes(r),
    hasAny: (rs: string[]) => rs.some((r) => roles.includes(r)),
    access: (m: Module): Access => bestAccess(roles, m),
    can: (m: Module) => canSeeModule(roles, m),
    canApproveRefund: () => canApproveRefund(roles),
  };
}
