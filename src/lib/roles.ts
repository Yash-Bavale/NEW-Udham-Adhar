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

const ALL_MODULES: Module[] = [
  "dashboard", "leads", "orders", "payments", "invoices", "customers",
  "documents", "complaints", "tickets", "tasks", "reports",
  "employees", "email_templates", "audit_log",
];

function fullAll(): Partial<Record<Module, Access>> {
  return Object.fromEntries(ALL_MODULES.map((m) => [m, "full" as Access])) as Partial<Record<Module, Access>>;
}

// Start from `read` on every module, then upgrade specific modules to `full`.
function readWithFull(...fullModules: Module[]): Partial<Record<Module, Access>> {
  const base: Record<Module, Access> = Object.fromEntries(
    ALL_MODULES.map((m) => [m, "read" as Access]),
  ) as Record<Module, Access>;
  for (const m of fullModules) base[m] = "full";
  return base;
}

// Every staff role now sees every module (at least read). Per-action
// authorisation (refunds, role grants, password reset, super-admin overview)
// still runs inside the relevant handlers.
export const ACCESS_MATRIX: Record<Role, Partial<Record<Module, Access>>> = {
  super_admin: fullAll(),
  admin: fullAll(),
  manager: readWithFull(
    "dashboard", "leads", "orders", "customers", "documents",
    "complaints", "tickets", "tasks", "reports",
  ),
  executive: readWithFull(
    "leads", "orders", "customers", "documents", "tasks",
  ),
  support: readWithFull(
    "complaints", "tickets", "tasks",
  ),
  accounts: readWithFull(
    "payments", "invoices",
  ),
  finance: readWithFull(
    "payments", "invoices", "reports",
  ),
  operations: readWithFull(
    "dashboard", "leads", "orders", "customers",
    "documents", "complaints", "tickets", "tasks",
  ),
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
