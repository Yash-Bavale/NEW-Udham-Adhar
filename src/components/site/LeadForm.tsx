import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { createLead } from "@/lib/leads.functions";
import { SERVICES, INDIAN_STATES, LANGUAGES } from "@/lib/constants";


export function LeadForm({ title = "Fill application" }: { title?: string } = {}) {
  const navigate = useNavigate();
  const submitLead = useServerFn(createLead);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setBusy(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      mobile: String(fd.get("mobile") ?? "").trim(),
      state: String(fd.get("state") ?? ""),
      language: String(fd.get("language") ?? ""),
      service: String(fd.get("service") ?? ""),
      consent: fd.get("consent") === "on",
    };

    try {
      const lead = await submitLead({ data: payload as never });
      navigate({
        to: "/processing/$leadCode",
        params: { leadCode: lead.leadCode },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      setErr(msg);
      setBusy(false);
    }
  }

  const inputCls =
    "w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="bg-form-header text-white text-center py-4">
        <h2 className="text-xl font-bold font-display">{title}</h2>
      </div>

      <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-5">
        <Field label="Applicant Name / आवेदक का नाम">
          <input name="name" required className={inputCls} placeholder="Enter Applicant Name" />
        </Field>

        <Field label="Email / ईमेल">
          <input name="email" type="email" required className={inputCls} placeholder="Enter your email" />
        </Field>

        <Field label="Mobile No / मोबाइल नंबर">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-foreground/80 font-medium">
              +91
            </span>
            <input
              name="mobile" required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10}
              className={`${inputCls} pl-14`} placeholder="Enter 10-digit mobile number"
            />
          </div>
        </Field>


        <Field label="State / राज्य">
          <select name="state" required defaultValue="" className={inputCls}>
            <option value="" disabled>Select Your State</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="Language / भाषा">
          <select name="language" required defaultValue="" className={inputCls}>
            <option value="" disabled>Select Language</option>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>

        <Field label="Reason for Help (Assistance) / सहायता का कारण">
          <select name="service" required defaultValue="" className={inputCls}>
            <option value="" disabled>Select Reason</option>
            {SERVICES.map((s) => <option key={s.slug} value={s.label}>{s.label}</option>)}
          </select>
        </Field>

        <label className="flex gap-3 items-start text-xs text-foreground/80 leading-relaxed">
          <input type="checkbox" name="consent" required className="mt-1 h-5 w-5 shrink-0 accent-brand-navy-deep border-2 border-brand-navy-deep rounded-sm cursor-pointer" style={{ accentColor: '#0a1f44' }} />
          <span>
            I confirm that I have read and agreed to all applicable{" "}
            <a href="/terms-conditions" className="text-brand-navy underline">Terms &amp; Conditions</a>,{" "}
            <a href="/privacy-policy" className="text-brand-navy underline">Privacy Policy</a>,{" "}
            <a href="/refund-cancellation-policy" className="text-brand-navy underline">Refund &amp; Cancellation Policy</a>,{" "}
            <a href="/disclaimer" className="text-brand-navy underline">Disclaimer</a>,{" "}
            <a href="/pricing-transparency" className="text-brand-navy underline">Pricing Transparency</a>,{" "}
            <a href="/consent-acknowledgment" className="text-brand-navy underline">Consents and Acknowledgements</a>{" "}
            and related service policies of this website, and I understand that Business Help Services is a private
            consultancy providing paid consultancy and assistance services only.
          </span>
        </label>

        {err && (
          <div className="rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm px-3 py-2">
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold py-3 transition-colors disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Submit"}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          {"\u200B"}
        </p>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
