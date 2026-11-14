const IST = "Asia/Kolkata";
function formatIST(value, opts = {}) {
  if (value === null || value === void 0 || value === "") return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  if (opts.timeOnly) {
    return d.toLocaleTimeString("en-IN", {
      timeZone: IST,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  }
  if (opts.dateOnly) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: IST,
      day: "2-digit",
      month: "2-digit",
      year: opts.withYear === false ? void 0 : "numeric"
    }).formatToParts(d);
    const get2 = (t) => parts.find((p) => p.type === t)?.value ?? "";
    return opts.withYear === false ? `${get2("day")}/${get2("month")}` : `${get2("day")}/${get2("month")}/${get2("year")}`;
  }
  const time = d.toLocaleTimeString("en-IN", {
    timeZone: IST,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  const dateParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST,
    day: "2-digit",
    month: "2-digit",
    year: opts.withYear === false ? void 0 : "numeric"
  }).formatToParts(d);
  const get = (t) => dateParts.find((p) => p.type === t)?.value ?? "";
  const datePart = opts.withYear === false ? `${get("day")}/${get("month")}` : `${get("day")}/${get("month")}/${get("year")}`;
  return `${datePart}, ${time}`;
}
function istDateKey(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
function istDayLabel(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const key = istDateKey(d);
  const todayKey = istDateKey(/* @__PURE__ */ new Date());
  const yKey = istDateKey(new Date(Date.now() - 864e5));
  const base = d.toLocaleDateString("en-IN", {
    timeZone: IST,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  if (key === todayKey) return `${base} · Today`;
  if (key === yKey) return `${base} · Yesterday`;
  return base;
}
function relativeIST(value) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  const sec = Math.round(diff / 1e3);
  if (sec < 60) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return formatIST(d, { dateOnly: true });
}
function formatDateDMY(value) {
  if (value === null || value === void 0 || value === "") return "—";
  let d = value instanceof Date ? value : new Date(value);
  if (typeof value === "string" && (Number.isNaN(d.getTime()) || d.getUTCFullYear() > 9999 || d.getUTCFullYear() < 1900)) {
    const tail = value.trim().slice(-10);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(tail);
    if (m) d = /* @__PURE__ */ new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00+05:30`);
  }
  if (Number.isNaN(d.getTime())) return typeof value === "string" ? value : "—";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST,
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}/${get("month")}/${get("year")}`;
}
export {
  formatDateDMY as a,
  istDayLabel as b,
  formatIST as f,
  istDateKey as i,
  relativeIST as r
};
