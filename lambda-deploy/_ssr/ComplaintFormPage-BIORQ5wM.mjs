import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as INDIAN_STATES, L as LANGUAGES } from "./constants-CKRzJJF_.mjs";
import { b as trackEvent } from "./router-QgJicixe.mjs";
import { f as formatIST } from "./datetime-DvkGwlJs.mjs";
import html from "./grievance-redressal-policy-BcgzKdgN.mjs";
import { e as ShieldAlert, C as Clock, a as Mail, P as Phone, c as MapPin } from "../_libs/lucide-react.mjs";
function ComplaintFormPage() {
  const [submitted, setSubmitted] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [now, setNow] = reactExports.useState(() => /* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const timer = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  const inputCls = "w-full rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 shadow-sm transition-colors";
  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      mobile: String(fd.get("mobile") ?? "").trim(),
      state: String(fd.get("state") ?? "").trim(),
      language: String(fd.get("language") ?? "").trim(),
      application_ref: String(fd.get("application_ref") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim()
    };
    try {
      const res = await fetch("/api/public/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `Could not submit (status ${res.status}). Please try again.`);
      }
      setSubmitted({
        complaintNumber: json.complaintNumber || "submitted",
        submittedAt: json.submittedAt || (/* @__PURE__ */ new Date()).toISOString()
      });
      toast.success("Complaint recorded. We'll review it shortly.");
      trackEvent("complaint_form_submitted", { state: payload.state });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error. Please check your connection and try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-8 md:py-12 grid gap-8 lg:grid-cols-2 items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 text-slate-800 dark:text-slate-200 text-base leading-relaxed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-brand-navy/10 dark:bg-brand-navy/30 px-4 py-1.5 text-sm font-bold text-brand-navy dark:text-sky-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-4" }),
        " Official Grievance Portal"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight", children: "File a Complaint — Business Help Services" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-700 dark:text-slate-300", children: "Welcome to the Business Help Services Complaint & Grievance Redressal Desk." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We take user feedback, operational difficulties, and service complaints with utmost seriousness. Our team is dedicated to providing transparent, fair, and prompt resolution for any concern regarding your application or consultancy services." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "If you are facing any delays, verification issues, or service dissatisfaction, please fill out the complaint form below or reach our team directly using the details provided." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border-2 border-slate-200 bg-slate-50 dark:bg-slate-900/60 dark:border-slate-800 p-5 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-brand-navy dark:text-sky-400 font-bold text-sm sm:text-base", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-brand-navy shrink-0 animate-pulse" }),
            "Current IST Time:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm sm:text-base bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold shadow-xs", children: [
            formatIST(now, { timeOnly: true }),
            " IST"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold pt-2 border-t border-slate-200 dark:border-slate-800 gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Working Hours: 10:00 AM to 05:00 PM (IST)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300 self-start sm:self-auto", children: "Desk Active" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-4 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-brand-navy mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-800 dark:text-slate-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-slate-900 dark:text-white font-bold", children: "Working Hours:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10:00 AM to 05:00 PM (IST) (Sunday & Public Holidays off)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-5 h-5 text-brand-navy mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:help@businesshelpservices.com", className: "text-brand-navy dark:text-sky-400 font-bold hover:underline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Email:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "help@businesshelpservices.com" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-5 h-5 text-brand-navy mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "tel:+919767870331", className: "text-brand-navy dark:text-sky-400 font-bold hover:underline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Phone:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "+91-9767870331" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-5 h-5 text-brand-navy mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-800 dark:text-slate-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-slate-900 dark:text-white font-bold", children: "Address:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Koregaon Bk, Khed, Pune, Maharashtra – 410505, India" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-card shadow-md overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-brand-navy text-white text-center py-4 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl md:text-2xl font-bold font-display tracking-wide", children: "Complaint Form" }) }),
      submitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 text-center space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold", children: "✓" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-extrabold text-slate-900 dark:text-white", children: "Complaint Recorded!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-slate-700 dark:text-slate-300", children: "Your complaint reference ticket number:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-mono font-extrabold text-brand-navy dark:text-sky-400 tracking-wider bg-slate-100 dark:bg-slate-800 py-2.5 px-5 rounded-xl border border-slate-300 dark:border-slate-700 inline-block shadow-xs", children: submitted.complaintNumber }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "block pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-700 px-5 py-3 text-sm sm:text-base font-mono font-bold text-emerald-950 dark:text-emerald-200 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" }),
          "Submitted Time: ",
          formatIST(submitted.submittedAt)
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium", children: "A confirmation email has been sent to you. Our grievance team will review your case and respond within working hours." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "p-6 md:p-8 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Applicant Name / आवेदक का नाम", htmlFor: "complaint-name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "complaint-name",
            name: "name",
            required: true,
            maxLength: 120,
            className: inputCls,
            placeholder: "Enter Applicant Name"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email / ईमेल", htmlFor: "complaint-email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "complaint-email",
            name: "email",
            type: "email",
            required: true,
            maxLength: 160,
            className: inputCls,
            placeholder: "Enter your email address"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mobile No / मोबाइल नंबर", htmlFor: "complaint-mobile", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base text-slate-900 font-bold", children: "+91" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "complaint-mobile",
              name: "mobile",
              required: true,
              inputMode: "numeric",
              pattern: "[6-9][0-9]{9}",
              maxLength: 10,
              className: `${inputCls} pl-14`,
              placeholder: "Enter 10-digit mobile number"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "State / राज्य", htmlFor: "complaint-state", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "complaint-state", name: "state", required: true, defaultValue: "", className: inputCls, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select Your State" }),
          INDIAN_STATES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Language / भाषा", htmlFor: "complaint-language", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "complaint-language", name: "language", required: true, defaultValue: "", className: inputCls, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select Language" }),
          LANGUAGES.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: l, children: l }, l))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Application / Order Reference (Optional)", htmlFor: "complaint-ref", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "complaint-ref",
            name: "application_ref",
            maxLength: 80,
            className: inputCls,
            placeholder: "e.g. APP-2026-12345 (if any)"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Complaint / तक्रार", htmlFor: "complaint-message", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            id: "complaint-message",
            name: "message",
            required: true,
            rows: 5,
            minLength: 10,
            maxLength: 2e3,
            className: "w-full rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 shadow-sm",
            placeholder: "Please describe your complaint or grievance in detail…"
          }
        ) }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-red-600 -mt-2", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: busy,
            className: "w-full rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-bold text-base py-3.5 transition-colors disabled:opacity-60 shadow-md",
            children: busy ? "Submitting…" : "SUBMIT COMPLAINT"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-10 mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Grievance Handling & Resolution", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Every complaint received is assigned a unique reference ticket ID for transparent tracking." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Our internal compliance officer reviews grievance details within 24 to 48 working hours." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Official responses or clarification requests will be sent to your registered email address and mobile number." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Support is available in Marathi, Hindi, and English." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Resolution timelines depend on application stage, government portal responsiveness, and external dependencies." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoBlock, { title: "Before Filing a Complaint", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "To help us resolve your issue swiftly, please keep the following details ready when submitting your grievance:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Applicant Full Name (matching Aadhaar / Order)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Registered Mobile Number & Email Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Order Number / Application Reference ID (if applicable)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Payment Reference Number (if applicable)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Clear description of the issue or grievance faced" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(InfoBlock, { title: "Important Disclaimer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Business Help Services is a private consultancy and assistance service provider." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "We are an independent consultancy and not affiliated with any government authority or official department." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Services provided through this Platform are consultancy and documentation assistance services." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Users may also file complaints directly with respective statutory authorities wherever applicable." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-card p-6 md:p-8 text-center shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white", children: "For urgent grievance support, contact our compliance desk directly." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-brand-navy dark:text-sky-400 font-bold text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "tel:+919767870331", className: "inline-flex items-center gap-2 hover:underline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-5 h-5" }),
            " +91-9767870331"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:help@businesshelpservices.com", className: "inline-flex items-center gap-2 hover:underline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-5 h-5" }),
            " help@businesshelpservices.com"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-card shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-brand-navy to-brand-navy-deep text-white px-6 md:px-10 py-8 md:py-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-3.5" }),
            " Grievance Policy"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-bold font-display", children: "Grievance Redressal Policy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm md:text-base text-white/80 max-w-2xl", children: "How Business Help Services receives, reviews, and resolves user complaints and grievances — fairly, transparently, and professionally." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "article",
          {
            className: "policy-prose px-6 md:px-10 py-8 md:py-10 prose prose-sm md:prose-base max-w-none\n              prose-headings:font-display prose-headings:text-foreground\n              prose-h2:hidden\n              prose-h3:text-xl prose-h3:mt-0 prose-h3:mb-6 prose-h3:text-brand-navy\n              prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3 prose-h4:pl-4 prose-h4:border-l-4 prose-h4:border-brand-navy prose-h4:text-foreground prose-h4:font-bold\n              prose-p:text-muted-foreground prose-p:leading-relaxed\n              prose-li:text-muted-foreground prose-li:marker:text-brand-navy\n              prose-strong:text-foreground\n              prose-a:text-brand-navy prose-a:no-underline hover:prose-a:underline\n              prose-ul:my-4 prose-ol:my-4",
            dangerouslySetInnerHTML: { __html: html }
          }
        )
      ] })
    ] })
  ] });
}
function InfoBlock({ title, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-card shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-brand-navy text-white px-6 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold font-display tracking-wide uppercase", children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 md:p-8 space-y-3 text-slate-800 dark:text-slate-200 text-base leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_p]:my-2 font-normal", children })
  ] });
}
function Field({ label, htmlFor, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor, className: "block text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5", children: label }),
    children
  ] });
}
export {
  ComplaintFormPage as C
};
