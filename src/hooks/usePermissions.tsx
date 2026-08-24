import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyPermissions, type MyPermissions } from "@/lib/crm/permissions.functions";

export type PermAction = "view" | "create" | "edit" | "delete";

export function usePermissions() {
  const fn = useServerFn(getMyPermissions);
  const q = useQuery<MyPermissions>({
    queryKey: ["my-permissions"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
  const perms = q.data;

  function can(moduleKey: string, action: PermAction = "view"): boolean {
    if (!perms) return true;
    if (perms.isAdmin) return true;
    const m = perms.modules[moduleKey];
    if (!m) return true;
    return m[action];
  }

  function scopeIds(moduleKey: string): {
    all: boolean;
    websites: string[];
    categories: string[];
    services: string[];
  } {
    if (!perms || perms.isAdmin) return { all: true, websites: [], categories: [], services: [] };
    const m = perms.modules[moduleKey];
    if (!m || m.scopeAll) return { all: true, websites: [], categories: [], services: [] };
    const websites: string[] = [];
    const categories: string[] = [];
    const services: string[] = [];
    for (const s of m.scopes) {
      if (s.serviceId) services.push(s.serviceId);
      else if (s.categoryId) categories.push(s.categoryId);
      else if (s.websiteId) websites.push(s.websiteId);
    }
    return { all: false, websites, categories, services };
  }

  return { perms, can, scopeIds, isLoading: q.isLoading };
}

export function Can({
  module,
  action = "view",
  children,
  fallback = null,
}: {
  module: string;
  action?: PermAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { can, isLoading } = usePermissions();
  if (isLoading) return null;
  return <>{can(module, action) ? children : fallback}</>;
}
