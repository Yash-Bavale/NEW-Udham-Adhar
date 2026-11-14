import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { j as useServerFn, H as Button } from "./router-QgJicixe.mjs";
import { b as browserPhone } from "./browser-phone-bus-CwJqzKkc.mjs";
import { supabase } from "./client-BX5UfqqR.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { C as CALL_OUTCOMES, O as OUTCOMES_NEEDING_FOLLOW_UP, w as wrapUpInput } from "./wrapup-DFQBFJJL.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { W as PhoneIncoming, ar as User, Q as FileText, P as Phone, Y as PhoneOff, X } from "../_libs/lucide-react.mjs";
import { o as object, s as string, n as number, _ as _enum } from "../_libs/zod.mjs";
const getMyCallState = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("2cc61d44a54b4c0a228fce402431d93f9b394b2ec032281960449c1ebed54cf6"));
const DISPOSITIONS = CALL_OUTCOMES;
const saveCallDisposition = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => wrapUpInput.parse(i)).handler(createSsrRpc("dca6096388aae1648c4deb26f7f6adef2eda764a56c707affc3d1ba5eafe90e2"));
const listLiveCalls = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("88b9a1eb87f0d922651a75fe4060c142246e80829925ae270bda64cf87ade8dd"));
const callHistoryInput = object({
  from: string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: string().regex(/^\d{4}-\d{2}-\d{2}$/),
  direction: _enum(["all", "inbound", "outbound"]).default("all"),
  status: _enum(["all", "answered", "ended", "missed", "no_response", "ringing"]).default("all"),
  page: number().int().min(0).max(1e4).default(0),
  number: string().max(20).optional(),
  employeeId: string().uuid().nullable().optional(),
  disposition: string().max(60).optional()
}).refine((v) => v.from <= v.to, {
  message: "Start date must be on or before end date"
}).refine((v) => (Date.parse(v.to) - Date.parse(v.from)) / 864e5 <= 92, {
  message: "Date range can be at most 92 days"
});
const listCallHistory = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => callHistoryInput.parse(i)).handler(createSsrRpc("127c0747644af17c257c063154528398a994726cffa639514df19d0c60e09ea9"));
function fmtDuration(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
function useCallTimer(call) {
  const [now, setNow] = reactExports.useState(Date.now());
  reactExports.useEffect(() => {
    if (!call || call.status === "ended") return;
    const t = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(t);
  }, [call?.status]);
  if (!call) return 0;
  if (call.durationSeconds != null && call.status !== "answered" && call.status !== "ringing") return call.durationSeconds;
  return (now - new Date(call.answeredAt ?? call.startedAt).getTime()) / 1e3;
}
const NOT_SUPPORTED = "This call has not reached the browser phone yet. Make sure the browser phone shows Ready (FortiClient on, CallerDesk website closed) — otherwise answer it on the CallerDesk phone.";
function TelephonyPanel() {
  const qc = useQueryClient();
  const fetchState = useServerFn(getMyCallState);
  const save = useServerFn(saveCallDisposition);
  const [uid, setUid] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(true);
  const [disp, setDisp] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [nextAction, setNextAction] = reactExports.useState("");
  const [followUp, setFollowUp] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    void supabase.auth.getUser().then(({ data: data2 }) => setUid(data2.user?.id ?? null));
  }, []);
  const { data } = useQuery({ queryKey: ["my-call-state"], queryFn: () => fetchState(), enabled: !!uid, staleTime: 6e4, refetchInterval: false });
  reactExports.useEffect(() => {
    if (!uid) return;
    const ch = supabase.channel(`user:${uid}:telephony`).on("postgres_changes", { event: "*", schema: "public", table: "telephony_calls", filter: `employee_id=eq.${uid}` }, () => {
      setOpen(true);
      qc.invalidateQueries({ queryKey: ["my-call-state"] });
    }).subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [uid, qc]);
  const active = data?.active ?? null;
  const pending = data?.pendingDisposition ?? null;
  const secs = useCallTimer(active);
  async function submit() {
    if (!pending || !disp) return;
    setSaving(true);
    try {
      const r = await save({ data: { id: pending.id, disposition: disp, notes, nextAction: nextAction || void 0, followUpAt: followUp ? new Date(followUp).toISOString() : null } });
      setDisp("");
      setNotes("");
      setNextAction("");
      setFollowUp("");
      toast.success(r.followUpCreated ? "Call outcome saved and follow-up scheduled" : "Call outcome saved");
      qc.invalidateQueries({ queryKey: ["my-call-state"] });
    } catch (e) {
      toast.error((e?.message ?? "Could not save") + " — your notes are kept, press Save again.");
    } finally {
      setSaving(false);
    }
  }
  if (!active && (!pending || !open)) {
    if (!pending) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "underline", onClick: () => setOpen(true), children: "Log last call" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-4 right-4 z-50 w-[340px] rounded-xl border bg-card text-card-foreground shadow-2xl", children: active ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneIncoming, { className: `h-4 w-4 ${active.status === "ringing" ? "animate-pulse text-primary" : "text-primary"}` }),
        active.status === "ringing" ? active.direction === "outbound" ? "Outgoing call" : "Incoming call" : "Active call",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/10 px-2 text-[11px] text-primary", children: active.status === "ringing" ? active.direction === "outbound" ? "Dialling" : "Ringing" : "On Call" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm", children: active.status === "answered" ? fmtDuration(secs) : active.direction === "outbound" ? "Calling…" : "Ringing…" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "grid grid-cols-[90px_1fr] gap-y-1 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Caller" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-mono", children: active.callerNumber ?? "Unknown" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: active.contactName ?? "Not matched" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Order" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: active.orderCode ? `${active.orderCode}${active.serviceName ? ` · ${active.serviceName}` : ""}` : "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Assigned" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: active.employeeName ?? "—" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      active.customerId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/customers/$customerId", params: { customerId: active.customerId }, target: "_blank", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
        "Open Customer"
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", disabled: true, title: "No customer matched", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
        "Open Customer"
      ] }),
      active.applicationId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/orders/$orderId", params: { orderId: active.applicationId }, target: "_blank", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
        "Open Order"
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", disabled: true, title: "No order matched", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
        "Open Order"
      ] })
    ] }),
    active.direction !== "outbound" && active.status === "ringing" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => {
        if (!browserPhone.answer()) toast.error(NOT_SUPPORTED);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
        "Pick Call"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", onClick: () => {
        if (!browserPhone.reject()) toast.error(NOT_SUPPORTED);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneOff, { className: "h-4 w-4" }),
        "Reject"
      ] })
    ] }) : active.status === "answered" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", className: "w-full", onClick: () => {
      if (!browserPhone.hangup()) toast.error("This call is not on the browser phone — end it on the phone that answered it.");
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneOff, { className: "h-4 w-4" }),
      "End Call"
    ] }) : null
  ] }) : pending && open ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
        "Call ended · ",
        fmtDuration(pending.durationSeconds ?? 0)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": "Hide", onClick: () => setOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      pending.contactName ?? pending.callerNumber ?? "Caller",
      pending.orderCode ? ` · ${pending.orderCode}` : ""
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: DISPOSITIONS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: disp === d ? "default" : "outline", onClick: () => setDisp(d), children: d }, d)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "w-full rounded-md border bg-background p-2 text-sm", rows: 2, placeholder: "Notes (optional)", value: notes, onChange: (e) => setNotes(e.target.value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full rounded-md border bg-background px-2 py-1.5 text-sm", placeholder: "Next action (optional)", maxLength: 300, value: nextAction, onChange: (e) => setNextAction(e.target.value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs", children: [
      "Follow-up ",
      OUTCOMES_NEEDING_FOLLOW_UP.has(disp) ? "(required)" : "(optional)",
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", className: "mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm", value: followUp, onChange: (e) => setFollowUp(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", size: "sm", disabled: !disp || saving || OUTCOMES_NEEDING_FOLLOW_UP.has(disp) && !followUp, onClick: submit, children: saving ? "Saving…" : "Save outcome" })
  ] }) : null });
}
export {
  TelephonyPanel as T,
  listCallHistory as a,
  fmtDuration as f,
  listLiveCalls as l
};
