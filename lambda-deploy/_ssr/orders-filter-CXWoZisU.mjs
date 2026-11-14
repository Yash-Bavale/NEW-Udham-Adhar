import { i as istDateKey } from "./datetime-DvkGwlJs.mjs";
function getOrdersDateRange(input) {
  let fromIso;
  let toIso;
  let fromKey;
  let toKey;
  if (input.from) {
    if (input.from instanceof Date) {
      fromKey = istDateKey(input.from);
    } else {
      const s = String(input.from).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        fromKey = s;
      } else if (s) {
        fromKey = istDateKey(s) || s.slice(0, 10);
      }
    }
    if (fromKey && /^\d{4}-\d{2}-\d{2}$/.test(fromKey)) {
      fromIso = (/* @__PURE__ */ new Date(`${fromKey}T00:00:00.000+05:30`)).toISOString();
    } else if (input.from) {
      fromIso = new Date(input.from).toISOString();
    }
  }
  if (input.to) {
    if (input.to instanceof Date) {
      toKey = istDateKey(input.to);
    } else {
      const s = String(input.to).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        toKey = s;
      } else if (s) {
        toKey = istDateKey(s) || s.slice(0, 10);
      }
    }
    if (toKey && /^\d{4}-\d{2}-\d{2}$/.test(toKey)) {
      toIso = (/* @__PURE__ */ new Date(`${toKey}T23:59:59.999+05:30`)).toISOString();
    } else if (input.to) {
      toIso = new Date(input.to).toISOString();
    }
  }
  return { fromIso, toIso, fromKey, toKey };
}
function normalizeOrdersFilter(raw) {
  const { fromIso, toIso, fromKey, toKey } = getOrdersDateRange({
    from: raw.dateFrom,
    to: raw.dateTo
  });
  const search = raw.search?.trim() || null;
  const bucket = raw.bucket || "all";
  const stage = raw.stage && raw.stage !== "all" ? raw.stage.trim() : null;
  const actionStatus = raw.actionStatus || "all";
  const serviceId = raw.serviceId && raw.serviceId !== "all" ? raw.serviceId.trim() : null;
  const assignedTo = raw.assignedTo && raw.assignedTo !== "all" ? raw.assignedTo.trim() : null;
  const paymentStatus = raw.paymentStatus && raw.paymentStatus !== "all" ? raw.paymentStatus.trim() : null;
  const fulfillmentStatus = raw.fulfillmentStatus && raw.fulfillmentStatus !== "all" ? raw.fulfillmentStatus.trim() : null;
  const pendingAge = raw.pendingAge && raw.pendingAge !== "any" ? raw.pendingAge.trim() : null;
  const customDays = raw.customDays ? parseInt(raw.customDays, 10) || null : null;
  const sortField = raw.sortField || "created_at";
  const sortOrder = raw.sortOrder || "desc";
  return {
    dateFrom: fromKey || null,
    dateTo: toKey || null,
    fromIso: fromIso || null,
    toIso: toIso || null,
    timezone: "Asia/Kolkata",
    search,
    bucket,
    stage,
    actionStatus,
    serviceId,
    assignedTo,
    paymentStatus,
    fulfillmentStatus,
    pendingAge,
    customDays,
    sortField,
    sortOrder,
    viewMode: raw.viewMode || "self"
  };
}
function getOrdersQueryKey(normalized, page) {
  return [
    "admin.orders.v2",
    page,
    normalized.viewMode,
    normalized.fromIso,
    normalized.toIso,
    normalized.search,
    normalized.bucket,
    normalized.stage,
    normalized.actionStatus,
    normalized.serviceId,
    normalized.assignedTo,
    normalized.paymentStatus,
    normalized.fulfillmentStatus,
    normalized.pendingAge,
    normalized.customDays,
    normalized.sortField,
    normalized.sortOrder
  ];
}
export {
  getOrdersQueryKey as g,
  normalizeOrdersFilter as n
};
