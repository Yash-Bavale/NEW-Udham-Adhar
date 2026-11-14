const ASSIGNABLE_ROLES = [
  "super_admin",
  "admin",
  "manager",
  "executive",
  "support",
  "accounts",
  "finance"
];
const ROLE_LABELS = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  executive: "Executive",
  support: "Support",
  accounts: "Accounts",
  finance: "Finance",
  operations: "Operations"
};
const ALL_MODULES = [
  "dashboard",
  "leads",
  "orders",
  "payments",
  "invoices",
  "customers",
  "documents",
  "complaints",
  "tickets",
  "tasks",
  "reports",
  "employees",
  "email_templates",
  "audit_log"
];
function fullAll() {
  return Object.fromEntries(ALL_MODULES.map((m) => [m, "full"]));
}
function onlyModules(map) {
  const base = Object.fromEntries(
    ALL_MODULES.map((m) => [m, "none"])
  );
  for (const [m, a] of Object.entries(map)) {
    if (a) base[m] = a;
  }
  return base;
}
const ACCESS_MATRIX = {
  super_admin: fullAll(),
  admin: fullAll(),
  manager: onlyModules({
    orders: "full"
  }),
  executive: onlyModules({
    orders: "full"
  }),
  support: onlyModules({
    complaints: "full",
    tickets: "full"
  }),
  accounts: onlyModules({
    payments: "full",
    invoices: "full"
  }),
  finance: onlyModules({
    payments: "full",
    invoices: "full",
    reports: "full"
  }),
  operations: onlyModules({
    orders: "full"
  })
};
function bestAccess(roles, module) {
  const order = ["full", "finance_tab", "revenue_only", "read", "assigned", "own", "none"];
  let best = "none";
  for (const r of roles) {
    const a = ACCESS_MATRIX[r]?.[module] ?? "none";
    if (order.indexOf(a) < order.indexOf(best)) best = a;
  }
  return best;
}
function canApproveRefund(roles) {
  return roles.some((r) => r === "super_admin" || r === "admin");
}
function canSeeModule(roles, module) {
  return bestAccess(roles, module) !== "none";
}
const MONEY_ROLES = /* @__PURE__ */ new Set(["super_admin", "admin", "accounts", "finance"]);
function canSeeMoney(roles) {
  return roles.some((r) => MONEY_ROLES.has(r));
}
function hideMoneyFor(roles) {
  return !canSeeMoney(roles);
}
export {
  ASSIGNABLE_ROLES as A,
  ROLE_LABELS as R,
  ALL_MODULES as a,
  bestAccess as b,
  canSeeMoney as c,
  canApproveRefund as d,
  canSeeModule as e,
  hideMoneyFor as h
};
