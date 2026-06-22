// Canonical role list and permission matrix.
// One source of truth. Never hardcode role lists elsewhere.

export const ROLES = [
  "super_admin",
  "admin",
  "manager",
  "executive",
  "support",
  "accounts",
  "finance",
  // legacy
  "operations",
] as const;

export type Role = (typeof ROLES)[number];

export const ASSIGNABLE_ROLES: Role[] = [
  "super_admin",
  "admin",
  "manager",
  "executive",
  "support",
  "accounts",
  "finance",
];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  executive: "Executive",
  support: "Support",
  accounts: "Accounts",
  finance: "Finance",
  operations: "Operations",
};

export type Access = "full" | "read" | "assigned" | "own" | "finance_tab" | "revenue_only" | "none";

export type Module =
  | "dashboard" | "leads" | "orders" | "payments" | "invoices" | "customers"
  | "documents" | "complaints" | "tickets" | "tasks" | "reports"
  | "employees" | "email_templates" | "audit_log";

// Per-spec matrix. Cells default to "none".
export const ACCESS_MATRIX: Record<Role, Partial<Record<Module, Access>>> = {
  super_admin: {
    dashboard: "full", leads: "full", orders: "full", payments: "full", invoices: "full",
    customers: "full", documents: "full", complaints: "full", tickets: "full", tasks: "full",
    reports: "full", employees: "full", email_templates: "full", audit_log: "full",
  },
  admin: {
    dashboard: "full", leads: "full", orders: "full", payments: "full", invoices: "full",
    customers: "full", documents: "full", complaints: "full", tickets: "full", tasks: "full",
    reports: "full", employees: "full", email_templates: "full", audit_log: "full",
  },
  manager: {
    dashboard: "full", leads: "full", orders: "full", payments: "read", invoices: "read",
    customers: "full", documents: "full", complaints: "full", tickets: "full", tasks: "full",
    reports: "full", email_templates: "read",
  },
  executive: {
    dashboard: "own", leads: "assigned", orders: "assigned", customers: "assigned",
    documents: "assigned", tasks: "own",
  },
  support: {
    complaints: "full", tickets: "full", tasks: "own",
  },
  accounts: {
    orders: "read", payments: "full", invoices: "full", reports: "finance_tab",
  },
  finance: {
    dashboard: "revenue_only", orders: "read", payments: "full", invoices: "full",
    reports: "finance_tab",
  },
  operations: {
    // legacy alias, treat like manager
    dashboard: "full", leads: "full", orders: "full", customers: "full",
    documents: "full", complaints: "full", tickets: "full", tasks: "full",
  },
};

export function bestAccess(roles: string[], module: Module): Access {
  const order: Access[] = ["full", "finance_tab", "revenue_only", "read", "assigned", "own", "none"];
  let best: Access = "none";
  for (const r of roles) {
    const a = ACCESS_MATRIX[r as Role]?.[module] ?? "none";
    if (order.indexOf(a) < order.indexOf(best)) best = a;
  }
  return best;
}

export function canApproveRefund(roles: string[]): boolean {
  return roles.some((r) => r === "super_admin" || r === "admin" || r === "manager");
}

export function canSeeModule(roles: string[], module: Module): boolean {
  return bestAccess(roles, module) !== "none";
}
