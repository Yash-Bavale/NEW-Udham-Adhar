import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as getEmailDashboard, p as processEmailQueueNow, r as retryFailedEmailsNow, b as getSmtpSettings, c as saveSmtpSettings, d as sendTestEmail, l as listEmailTemplates, a as saveEmailTemplate, e as duplicateEmailTemplate, f as deleteEmailTemplate, h as sendTestTemplateEmail, i as listEmailLogs, j as getMailProviderSetting, k as setMailProviderSetting } from "./emails.functions-Pri3A8op.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./constants-CKRzJJF_.mjs";
import "./createSsrRpc-BO-AEXHh.mjs";
import "./server-BFjd5iLF.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./client.functions-WMvtjq1i.mjs";
import "./customer-access-core-Bd_9lLsD.mjs";
import "./brand-DLB0j9eh.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./datetime-DvkGwlJs.mjs";
import "./orders-filter-CXWoZisU.mjs";
import "./computeOrderStage-D7ejTUnj.mjs";
import "./consultation-asWR5IET.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./roles-CFhgFhhh.mjs";
import "./permissions.functions-DO0h7DgB.mjs";
import "./client-BX5UfqqR.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/lovable.dev__webhooks-js.mjs";
import "../_libs/lovable.dev__email-js.mjs";
import "./registry-DV_lUXjY.mjs";
import "../_libs/react-email__html.mjs";
import "../_libs/react-email__head.mjs";
import "../_libs/react-email__preview.mjs";
import "../_libs/react-email__body.mjs";
import "../_libs/react-email__container.mjs";
import "../_libs/react-email__heading.mjs";
import "../_libs/react-email__text.mjs";
import "../_libs/react-email__section.mjs";
import "../_libs/react-email__button.mjs";
import "../_libs/react-email__hr.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
function ProviderSwitcher() {
  const getFn = useServerFn(getMailProviderSetting);
  const setFn = useServerFn(setMailProviderSetting);
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.emails.provider"],
    queryFn: () => getFn()
  });
  const [busy, setBusy] = reactExports.useState(false);
  const [msg, setMsg] = reactExports.useState(null);
  const choose = async (choice) => {
    setBusy(true);
    setMsg(null);
    try {
      const r = await setFn({
        data: {
          choice
        }
      });
      setMsg(`Saved. Emails now send through ${r.active === "zeptomail" ? "ZeptoMail" : "Zoho Mail API"}.`);
      await qc.invalidateQueries({
        queryKey: ["admin.emails.provider"]
      });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };
  const options = [{
    key: "zeptomail",
    label: "ZeptoMail",
    hint: "Zoho ZeptoMail transactional API"
  }, {
    key: "zoho",
    label: "Zoho Mail API",
    hint: "Regular Zoho mailbox sending"
  }, {
    key: "auto",
    label: "Automatic",
    hint: "ZeptoMail when available, else Zoho"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Sending service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500", children: isLoading ? "Loading…" : `Currently sending via ${data?.active === "zeptomail" ? "ZeptoMail" : "Zoho Mail API"}${data?.senderEmail ? ` from ${data.senderEmail}` : ""}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: options.map((o) => {
        const selected = data?.choice === o.key;
        const disabled = busy || o.key === "zeptomail" && data?.zeptoConfigured === false;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: disabled && o.key === "zeptomail" ? "ZeptoMail token not configured" : o.hint, disabled, onClick: () => choose(o.key), className: `rounded-md border px-3 py-2 text-sm ${selected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 hover:bg-slate-50"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`, children: o.label }, o.key);
      }) })
    ] }),
    msg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-slate-600", children: msg })
  ] });
}
function EmailsPage() {
  const [tab, setTab] = reactExports.useState("dashboard");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Email System" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 border-b", children: ["dashboard", "smtp", "templates", "logs"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t), className: `px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`, children: t === "dashboard" ? "Dashboard" : t === "smtp" ? "SMTP Settings" : t === "templates" ? "Templates" : "Logs" }, t)) }),
    tab === "dashboard" && /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardTab, {}),
    tab === "smtp" && /* @__PURE__ */ jsxRuntimeExports.jsx(SmtpTab, {}),
    tab === "templates" && /* @__PURE__ */ jsxRuntimeExports.jsx(TemplatesTab, {}),
    tab === "logs" && /* @__PURE__ */ jsxRuntimeExports.jsx(LogsTab, {})
  ] });
}
function DashboardTab() {
  const fn = useServerFn(getEmailDashboard);
  const process = useServerFn(processEmailQueueNow);
  const retryFailed = useServerFn(retryFailedEmailsNow);
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.emails.dash"],
    queryFn: () => fn({
      data: {}
    })
  });
  const [busy, setBusy] = reactExports.useState(false);
  const [retryBusy, setRetryBusy] = reactExports.useState(false);
  const [retryMsg, setRetryMsg] = reactExports.useState(null);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500", children: "Loading…" });
  const c = data?.counts;
  const failedRows = data?.failedRows ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderSwitcher, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-4 lg:grid-cols-8 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Queued", value: c?.queued ?? 0, tone: "default" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Sending", value: c?.sending ?? 0, tone: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Failed (retrying)", value: c?.failed ?? 0, tone: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Sent (24h)", value: c?.sent24h ?? 0, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Sent (7d)", value: c?.sent7d ?? 0, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Dead-letter", value: c?.dlq ?? 0, tone: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Queue Unmatched", value: c?.queueUnmatched ?? 0, tone: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Sent Unmatched", value: c?.sentLogsUnmatched ?? 0, tone: "danger" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, onClick: async () => {
        setBusy(true);
        try {
          await process({
            data: {}
          });
          await qc.invalidateQueries({
            queryKey: ["admin.emails.dash"]
          });
        } finally {
          setBusy(false);
        }
      }, className: "rounded bg-slate-900 text-white px-3 py-1.5 text-sm disabled:opacity-60", children: busy ? "Processing…" : "Process queue now" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: retryBusy, onClick: async () => {
        setRetryBusy(true);
        setRetryMsg(null);
        try {
          const r = await retryFailed({
            data: {
              limit: 50
            }
          });
          setRetryMsg(`Tried ${r.processed} held email(s) — ${r.sent} sent, ${r.failed} still failing.`);
          await qc.invalidateQueries({
            queryKey: ["admin.emails.dash"]
          });
        } catch (e) {
          setRetryMsg(e instanceof Error ? e.message : "Retry failed");
        } finally {
          setRetryBusy(false);
        }
      }, className: "rounded border border-red-300 bg-red-50 text-red-700 px-3 py-1.5 text-sm disabled:opacity-60", children: retryBusy ? "Retrying…" : `Retry failed emails (${c?.failed ?? 0})` }),
      retryMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-600", children: retryMsg })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: `Failed queue (${c?.failed ?? 0}) — held, will be retried`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-left text-xs uppercase text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Created" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "To" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Attempts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Next try" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Error" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        failedRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t align-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-xs whitespace-nowrap", children: new Date(r.created_at).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: r.to_email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: r.subject }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2 text-xs", children: [
            r.attempts,
            "/",
            r.max_attempts
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-xs whitespace-nowrap", children: new Date(r.next_attempt_at).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-xs text-red-600 max-w-md break-words", children: r.last_error ?? "" })
        ] }, r.id)),
        failedRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-4 text-center text-slate-400 text-sm", children: "No failed emails." }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Recent send attempts", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-xs text-slate-500", children: [
        "Provider: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-emerald-700", children: "Zoho Mail API" }),
        " · every send is logged in ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "email_send_log" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-left text-xs uppercase text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "When" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "To" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Error" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          (data?.recentLogs ?? []).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-xs", children: new Date(r.sent_at).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: r.to_email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: r.subject }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: r.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-xs text-red-600 truncate max-w-xs", children: r.error_message ?? "" })
          ] }, r.id)),
          (data?.recentLogs ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "p-4 text-center text-slate-400 text-sm", children: "No emails sent yet." }) })
        ] })
      ] }) })
    ] })
  ] });
}
function SmtpTab() {
  const getFn = useServerFn(getSmtpSettings);
  const saveFn = useServerFn(saveSmtpSettings);
  const testFn = useServerFn(sendTestEmail);
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.emails.smtp"],
    queryFn: () => getFn()
  });
  const [form, setForm] = reactExports.useState(null);
  const [testTo, setTestTo] = reactExports.useState("");
  const [msg, setMsg] = reactExports.useState(null);
  const s = data?.settings;
  const eff = form ?? {
    from_email: s?.from_email ?? "",
    from_name: s?.from_name ?? "Business Help Services",
    reply_to: s?.reply_to ?? "",
    daily_quota: s?.daily_quota ?? 2e3,
    is_enabled: s?.is_enabled ?? false,
    notes: s?.notes ?? ""
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500", children: "Loading…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Provider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-700", children: [
      "Emails are now sent via ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Zoho Mail API" }),
      " from ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "mx-1 font-mono", children: "help@busiesshelpservices.com" }),
      "using the connected Zoho OAuth mailbox. Update Zoho OAuth secrets only if the mailbox authorization changes. The fields below only control the visible ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "From name" }),
      " and ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "Reply-To" }),
      " on outgoing mail."
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Sender Settings", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "From Email", value: eff.from_email, onChange: (v) => setForm({
          ...eff,
          from_email: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "From Name", value: eff.from_name, onChange: (v) => setForm({
          ...eff,
          from_name: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Reply-To", value: eff.reply_to, onChange: (v) => setForm({
            ...eff,
            reply_to: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] text-slate-500", children: [
            "Must be the mailbox connected to the Zoho poller (e.g. ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "help@businesshelpservices.com" }),
            ") — replies here become support tickets automatically."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Daily Quota", type: "number", value: String(eff.daily_quota), onChange: (v) => setForm({
          ...eff,
          daily_quota: Number(v)
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: eff.is_enabled, onChange: (e) => setForm({
            ...eff,
            is_enabled: e.target.checked
          }) }),
          "Enable email sending"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-600 mb-1", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 2, value: eff.notes, onChange: (e) => setForm({
            ...eff,
            notes: e.target.value
          }), className: "w-full rounded border border-slate-300 px-3 py-2 text-sm" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
        setMsg(null);
        try {
          await saveFn({
            data: {
              from_email: eff.from_email.trim(),
              from_name: eff.from_name.trim(),
              reply_to: eff.reply_to ? eff.reply_to.trim() : null,
              daily_quota: eff.daily_quota,
              is_enabled: eff.is_enabled,
              notes: eff.notes || null
            }
          });
          await qc.invalidateQueries({
            queryKey: ["admin.emails.smtp"]
          });
          setForm(null);
          setMsg("Saved.");
        } catch (e) {
          setMsg(e.message);
        }
      }, className: "rounded bg-slate-900 text-white px-3 py-1.5 text-sm", children: "Save settings" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Send a Test Email", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "To", value: testTo, onChange: setTestTo }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          setMsg(null);
          try {
            const r = await testFn({
              data: {
                toEmail: testTo
              }
            });
            setMsg(`Queued — sent ${r.sent}, failed ${r.failed}.`);
            await qc.invalidateQueries({
              queryKey: ["admin.emails.dash"]
            });
          } catch (e) {
            setMsg(e.message);
          }
        }, className: "rounded bg-emerald-600 text-white px-3 py-1.5 text-sm h-9", children: "Send test" })
      ] }),
      msg && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-slate-600", children: msg })
    ] })
  ] });
}
const emptyTpl = () => ({
  code: "",
  name: "",
  subject: "",
  body_html: "",
  body_text: "",
  description: "",
  variables: "",
  is_enabled: true
});
function TemplatesTab() {
  const listFn = useServerFn(listEmailTemplates);
  const saveFn = useServerFn(saveEmailTemplate);
  const dupFn = useServerFn(duplicateEmailTemplate);
  const delFn = useServerFn(deleteEmailTemplate);
  const testTplFn = useServerFn(sendTestTemplateEmail);
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.emails.templates"],
    queryFn: () => listFn()
  });
  const [form, setForm] = reactExports.useState(null);
  const [err, setErr] = reactExports.useState(null);
  const [testCode, setTestCode] = reactExports.useState("");
  const [testTo, setTestTo] = reactExports.useState("");
  const [testVars, setTestVars] = reactExports.useState("");
  const [testMsg, setTestMsg] = reactExports.useState(null);
  const [testBusy, setTestBusy] = reactExports.useState(false);
  const [rowBusy, setRowBusy] = reactExports.useState(null);
  const [rowMsg, setRowMsg] = reactExports.useState(null);
  const runTest = async (code, to, varsJson) => {
    setTestMsg(null);
    const r = await testTplFn({
      data: {
        code,
        toEmail: to,
        variablesJson: varsJson
      }
    });
    return `Template "${r.template}" — sent ${r.sent}, failed ${r.failed}.`;
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500", children: "Loading…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Send test by template (end-to-end verify)", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mb-2", children: "Sends a sample of the selected template via Zoho Mail API using auto-generated sample variables (override any with JSON). Disabled templates are still sent for testing and prefixed with [TEST]." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-600 mb-1", children: "Template" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: testCode, onChange: (e) => setTestCode(e.target.value), className: "w-full rounded border border-slate-300 px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select template —" }),
            (data?.rows ?? []).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: t.code, children: [
              t.name,
              " (",
              t.code,
              ")",
              t.is_enabled ? "" : " — disabled"
            ] }, t.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Recipient", value: testTo, onChange: setTestTo }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-600 mb-1", children: "Variables override (JSON, optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: testVars, onChange: (e) => setTestVars(e.target.value), placeholder: '{"customer_name":"Asha"}', className: "w-full rounded border border-slate-300 px-3 py-2 text-xs font-mono" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: testBusy || !testCode || !testTo, onClick: async () => {
          setTestBusy(true);
          try {
            const m = await runTest(testCode, testTo, testVars || void 0);
            setTestMsg(m);
            await qc.invalidateQueries({
              queryKey: ["admin.emails.logs"]
            });
            await qc.invalidateQueries({
              queryKey: ["admin.emails.dash"]
            });
          } catch (e) {
            setTestMsg(e.message);
          } finally {
            setTestBusy(false);
          }
        }, className: "rounded bg-emerald-600 text-white px-3 py-1.5 text-sm disabled:opacity-40", children: testBusy ? "Sending…" : "Send test" }),
        testMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-600", children: testMsg })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
      setForm(emptyTpl());
      setErr(null);
    }, className: "rounded bg-slate-900 text-white px-3 py-1.5 text-sm", children: "+ New Template" }) }),
    form && /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: form.id ? "Edit template" : "New template", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Code (lowercase, _)", value: form.code, onChange: (v) => setForm({
          ...form,
          code: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Name", value: form.name, onChange: (v) => setForm({
          ...form,
          name: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Subject (use {{var}})", value: form.subject, onChange: (v) => setForm({
          ...form,
          subject: v
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-600 mb-1", children: "HTML body" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 8, value: form.body_html, onChange: (e) => setForm({
            ...form,
            body_html: e.target.value
          }), className: "w-full rounded border border-slate-300 px-3 py-2 text-xs font-mono" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-600 mb-1", children: "Plain-text body (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, value: form.body_text, onChange: (e) => setForm({
            ...form,
            body_text: e.target.value
          }), className: "w-full rounded border border-slate-300 px-3 py-2 text-xs font-mono" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Variables (comma-separated)", value: form.variables, onChange: (v) => setForm({
          ...form,
          variables: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Description", value: form.description, onChange: (v) => setForm({
          ...form,
          description: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: form.is_enabled, onChange: (e) => setForm({
            ...form,
            is_enabled: e.target.checked
          }) }),
          "Enabled"
        ] })
      ] }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-red-600", children: err }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          setErr(null);
          try {
            await saveFn({
              data: {
                id: form.id,
                code: form.code.trim(),
                name: form.name.trim(),
                subject: form.subject,
                body_html: form.body_html,
                body_text: form.body_text || null,
                description: form.description || null,
                variables: form.variables.split(",").map((s) => s.trim()).filter(Boolean),
                is_enabled: form.is_enabled
              }
            });
            await qc.invalidateQueries({
              queryKey: ["admin.emails.templates"]
            });
            setForm(null);
          } catch (e) {
            setErr(e.message);
          }
        }, className: "rounded bg-slate-900 text-white px-3 py-1.5 text-sm", children: "Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm(null), className: "rounded border px-3 py-1.5 text-sm", children: "Cancel" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Templates", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-left text-xs uppercase text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2 w-44", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: (data?.rows ?? []).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2 font-medium", children: [
            t.name,
            " ",
            t.is_system && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[10px] text-slate-400", children: "SYSTEM" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-xs font-mono", children: t.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-xs", children: t.subject }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded ${t.is_enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`, children: t.is_enabled ? "Enabled" : "Disabled" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm({
              id: t.id,
              code: t.code,
              name: t.name,
              subject: t.subject,
              body_html: t.body_html,
              body_text: t.body_text ?? "",
              description: t.description ?? "",
              variables: (t.variables ?? []).join(", "),
              is_enabled: t.is_enabled
            }), className: "text-xs text-blue-600 hover:underline", children: "Edit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
              await dupFn({
                data: {
                  id: t.id
                }
              });
              await qc.invalidateQueries({
                queryKey: ["admin.emails.templates"]
              });
            }, className: "text-xs text-slate-600 hover:underline", children: "Duplicate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: rowBusy === t.code, onClick: async () => {
              const to = window.prompt(`Send a test of "${t.name}" to which email?`, testTo || "");
              if (!to) return;
              setRowBusy(t.code);
              setRowMsg(null);
              try {
                const m = await runTest(t.code, to);
                setRowMsg(`✓ ${m}`);
                setTestTo(to);
                await qc.invalidateQueries({
                  queryKey: ["admin.emails.logs"]
                });
                await qc.invalidateQueries({
                  queryKey: ["admin.emails.dash"]
                });
              } catch (e) {
                setRowMsg(`✗ ${t.code}: ${e.message}`);
              } finally {
                setRowBusy(null);
              }
            }, className: "text-xs text-emerald-700 hover:underline disabled:opacity-40", children: rowBusy === t.code ? "Sending…" : "Send test" }),
            !t.is_system && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
              if (!confirm(`Delete template "${t.name}"?`)) return;
              await delFn({
                data: {
                  id: t.id
                }
              });
              await qc.invalidateQueries({
                queryKey: ["admin.emails.templates"]
              });
            }, className: "text-xs text-red-600 hover:underline", children: "Delete" })
          ] }) })
        ] }, t.id)) })
      ] }) }),
      rowMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-slate-600", children: rowMsg })
    ] })
  ] });
}
function LogsTab() {
  const fn = useServerFn(listEmailLogs);
  const [search, setSearch] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.emails.logs", search, status, page],
    queryFn: () => fn({
      data: {
        search: search || void 0,
        status: status || void 0,
        page,
        pageSize: 50
      }
    })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => {
        setSearch(e.target.value);
        setPage(1);
      }, placeholder: "Search by email or subject", className: "flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: status, onChange: (e) => {
        setStatus(e.target.value);
        setPage(1);
      }, className: "rounded border border-slate-300 px-3 py-1.5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All statuses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sent", children: "Sent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "failed", children: "Failed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "bounced", children: "Bounced" })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500", children: "Loading…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: `Logs (${data?.total ?? 0})`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-left text-xs uppercase text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "When" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "To" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Template" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Attempt" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Error" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          (data?.rows ?? []).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-xs", children: new Date(r.sent_at).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: r.to_email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-xs font-mono", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.template_code ?? "NO_TEMPLATE" }),
              r.template_exists === false && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 border border-rose-200", children: "unmatched" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-xs", children: r.subject }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: r.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-xs", children: r.attempt }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-xs text-red-600 truncate max-w-xs", children: r.error_message ?? "" })
          ] }, r.id)),
          (data?.rows ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "p-4 text-center text-slate-400 text-sm", children: "No log entries." }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-between items-center text-xs text-slate-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Page ",
          page
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: page === 1, onClick: () => setPage(page - 1), className: "rounded border px-2 py-1 disabled:opacity-40", children: "Prev" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: (data?.rows ?? []).length < 50, onClick: () => setPage(page + 1), className: "rounded border px-2 py-1 disabled:opacity-40", children: "Next" })
        ] })
      ] })
    ] })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-700", children: title }),
    children
  ] });
}
function Input({
  label,
  value,
  onChange,
  type = "text"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-600 mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), className: "w-full rounded border border-slate-300 px-3 py-2 text-sm" })
  ] });
}
function Stat({
  label,
  value,
  tone
}) {
  const toneClass = tone === "success" ? "text-emerald-700 bg-emerald-50" : tone === "danger" ? "text-red-700 bg-red-50" : tone === "info" ? "text-blue-700 bg-blue-50" : "text-slate-700 bg-slate-50";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-lg p-4 ${toneClass}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wide opacity-70", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold mt-1", children: value.toLocaleString() })
  ] });
}
function StatusBadge({
  status
}) {
  const cls = status === "sent" ? "bg-emerald-100 text-emerald-700" : status === "failed" || status === "bounced" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded ${cls}`, children: status });
}
export {
  EmailsPage as component
};
