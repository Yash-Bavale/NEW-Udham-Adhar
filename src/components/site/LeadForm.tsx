import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { createLead } from "@/lib/leads.functions";
import { getCaptchaSiteKey, verifyCaptcha } from "@/lib/captcha.functions";
import { SERVICES, INDIAN_STATES, LANGUAGES } from "@/lib/constants";
import { INDIA_DISTRICTS } from "@/lib/onboarding/india-districts";
import { trackEvent } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


declare global {
  interface Window {
    grecaptcha?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback?: (t: string) => void; "expired-callback"?: () => void }) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
    };
  }
}

export function LeadForm({ title = "Fill application" }: { title?: string } = {}) {
  const navigate = useNavigate();
  const submitLead = useServerFn(createLead);
  const baseId = useId();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const startedRef = useRef(false);

  // UI-only state for the new decorative fields
  const [selectedState, setSelectedState] = useState("");
  const [dob, setDob] = useState<Date | undefined>();
  const [dobOpen, setDobOpen] = useState(false);

  // reCAPTCHA widget
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    function tryRender() {
      if (cancelled) return;
      if (!captchaRef.current) return;
      if (widgetIdRef.current !== null) return;
      if (!window.grecaptcha || typeof window.grecaptcha.render !== "function") {
        setTimeout(tryRender, 200);
        return;
      }
      try {
        widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
        });
      } catch {
        // Already rendered — ignore.
      }
    }
    tryRender();
    return () => {
      cancelled = true;
    };
  }, []);

  const districts = useMemo(
    () => (selectedState ? INDIA_DISTRICTS[selectedState] ?? [] : []),
    [selectedState],
  );

  function onFirstInteract() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("form_started");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);

    // Captcha gate — client-side only
    const token =
      window.grecaptcha && widgetIdRef.current !== null
        ? window.grecaptcha.getResponse(widgetIdRef.current)
        : "";
    if (!token) {
      setErr("Please verify you're human by completing the captcha.");
      return;
    }

    setBusy(true);

    const fd = new FormData(e.currentTarget);
    const sourcePage =
      typeof window !== "undefined"
        ? (window.location.pathname + window.location.search).slice(0, 240)
        : undefined;
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      mobile: String(fd.get("mobile") ?? "").trim(),
      state: String(fd.get("state") ?? ""),
      language: String(fd.get("language") ?? ""),
      service: String(fd.get("service") ?? ""),
      consent: fd.get("consent") === "on",
      source_page: sourcePage,
    };

    trackEvent("form_submitted", { service: payload.service, state: payload.state });

    if (typeof window !== "undefined" && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion();
    }

    try {
      const lead = await submitLead({ data: payload as never });
      trackEvent("lead_created", { service: payload.service }, { lead_id: lead.leadId ?? null });
      navigate({
        to: "/processing/$leadCode",
        params: { leadCode: lead.leadCode },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      setErr(msg);
      try {
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
      } catch {}
      setBusy(false);
    }
  }

  const inputCls =
    "w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="bg-form-header text-white text-center py-4 px-3">
        <h2 className="text-xl font-bold font-display leading-tight">{title}</h2>
      </div>

      <form onSubmit={onSubmit} onFocus={onFirstInteract} className="p-6 md:p-8 space-y-5">
        {/* ─── Contact details (captured) ─── */}
        <Field id={`${baseId}-name`} label="Applicant Name / आवेदक का नाम">
          <input id={`${baseId}-name`} name="name" required className={inputCls} placeholder="Enter Applicant Name" />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id={`${baseId}-email`} label="Email / ईमेल">
            <input id={`${baseId}-email`} name="email" type="email" required className={inputCls} placeholder="Enter your email" />
          </Field>

          <Field id={`${baseId}-mobile`} label="Mobile No / मोबाइल नंबर">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-foreground/80 font-medium">
                +91
              </span>
              <input
                id={`${baseId}-mobile`}
                name="mobile" required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10}
                className={`${inputCls} pl-14`} placeholder="Enter 10-digit mobile number"
              />
            </div>
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id={`${baseId}-service`} label="Reason for Help (Assistance) / सहायता का कारण">
            <select id={`${baseId}-service`} name="service" required defaultValue="" className={inputCls}>
              <option value="" disabled>Select Reason</option>
              {SERVICES.map((s) => <option key={s.slug} value={s.label}>{s.label}</option>)}
            </select>
          </Field>

          <Field id={`${baseId}-language`} label="Language of Assistance / सहायता की भाषा">
            <select id={`${baseId}-language`} name="language" required defaultValue="" className={inputCls}>
              <option value="" disabled>Select Language</option>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
        </div>

        {/* ─── Applicant Details divider ─── */}
        <Divider>Applicant Details</Divider>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id={`${baseId}-state`} label="State / राज्य">
            <select
              id={`${baseId}-state`} name="state" required defaultValue=""
              className={inputCls}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="" disabled>Select Your State</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          <Field id={`${baseId}-district`} label="District / जिला">
            <select
              id={`${baseId}-district`} name="district_display" required defaultValue=""
              disabled={!selectedState}
              className={cn(inputCls, !selectedState && "opacity-60 cursor-not-allowed")}
            >
              <option value="" disabled>{selectedState ? "Select Your District" : "Select State First"}</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
        </div>

        <Field id={`${baseId}-pincode`} label="Pincode / पिन कोड">
          <input
            id={`${baseId}-pincode`} name="pincode_display" required
            inputMode="numeric" pattern="[1-9][0-9]{5}" maxLength={6}
            className={inputCls} placeholder="6-digit Pincode"
          />
        </Field>

        {/* ─── KYC Details divider ─── */}
        <Divider>KYC Details</Divider>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id={`${baseId}-aadhaar`} label="Aadhaar Number / आधार नंबर">
            <input
              id={`${baseId}-aadhaar`} name="aadhaar_display" required
              inputMode="numeric" pattern="[0-9]{12}" maxLength={12}
              className={inputCls} placeholder="12-digit Aadhaar"
              autoComplete="off"
            />
          </Field>

          <Field id={`${baseId}-pan`} label="PAN Card Number / पैन कार्ड नंबर">
            <input
              id={`${baseId}-pan`} name="pan_display" required
              pattern="[A-Z]{5}[0-9]{4}[A-Z]" maxLength={10}
              className={`${inputCls} uppercase`} placeholder="ABCDE1234F"
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); }}
              autoComplete="off"
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id={`${baseId}-dob`} label="Date of Birth / जन्म तिथि">
            <Popover open={dobOpen} onOpenChange={setDobOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start rounded-full border-border bg-background px-4 py-3 h-auto text-sm font-normal",
                    !dob && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dob ? format(dob, "dd/MM/yyyy") : <span>Select date of birth</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dob}
                  onSelect={(d) => { setDob(d); setDobOpen(false); }}
                  disabled={(d) => d > new Date()}
                  captionLayout="dropdown"
                  fromYear={1930}
                  toYear={new Date().getFullYear()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {/* hidden required proxy so browser enforces selection */}
            <input
              tabIndex={-1}
              aria-hidden
              required
              value={dob ? format(dob, "yyyy-MM-dd") : ""}
              onChange={() => {}}
              className="sr-only"
            />
          </Field>

          <Field id={`${baseId}-gender`} label="Gender / लिंग">
            <select
              id={`${baseId}-gender`} name="gender_display" required defaultValue=""
              className={inputCls}
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </Field>
        </div>

        <Field id={`${baseId}-social`} label="Social Category / सामाजिक श्रेणी">
          <div className="flex flex-wrap gap-4 pt-1">
            {["General", "SC", "ST", "OBC"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-foreground/90 cursor-pointer">
                <input
                  type="radio" name="social_category_display" value={opt} required
                  className="h-4 w-4 accent-brand-navy-deep cursor-pointer"
                  style={{ accentColor: "#0a1f44" }}
                />
                {opt}
              </label>
            ))}
          </div>
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id={`${baseId}-abled`} label="Specially Abled / दिव्यांग">
            <select
              id={`${baseId}-abled`} name="specially_abled_display" required defaultValue=""
              className={inputCls}
            >
              <option value="" disabled>Select</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </Field>

          <Field id={`${baseId}-activity`} label="Major Activity / प्रमुख गतिविधि">
            <div className="flex flex-wrap gap-4 pt-2">
              {["Manufacturing", "Services", "Trading"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-foreground/90 cursor-pointer">
                  <input
                    type="radio" name="major_activity_display" value={opt} required
                    className="h-4 w-4 accent-brand-navy-deep cursor-pointer"
                    style={{ accentColor: "#0a1f44" }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </Field>
        </div>

        {/* ─── Consent ─── */}
        <label htmlFor={`${baseId}-consent`} className="flex gap-3 items-start text-xs text-foreground/80 leading-relaxed">
          <input id={`${baseId}-consent`} type="checkbox" name="consent" required className="mt-1 h-5 w-5 shrink-0 accent-brand-navy-deep border-2 border-brand-navy-deep rounded-sm cursor-pointer" style={{ accentColor: '#0a1f44' }} />
          <span>
            I confirm that I have read and agreed to all applicable{" "}
            <a href="/terms-conditions" className="text-brand-navy underline">Terms &amp; Conditions</a>,{" "}
            <a href="/privacy-policy" className="text-brand-navy underline">Privacy Policy</a>,{" "}
            <a href="/refund-cancellation-policy" className="text-brand-navy underline">Refund &amp; Cancellation Policy</a>,{" "}
            <a href="/disclaimer" className="text-brand-navy underline">Disclaimer</a>,{" "}
            <a href="/pricing-transparency" className="text-brand-navy underline">Pricing Transparency</a>,{" "}
            <a href="/consent-acknowledgment" className="text-brand-navy underline">Consents and Acknowledgements</a>{" "}
            and related service policies of this website.
          </span>
        </label>

        {/* ─── reCAPTCHA ─── */}
        <div className="flex justify-center">
          <div ref={captchaRef} />
        </div>

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
          {"\n\u200B"}
        </p>
      </form>
    </div>
  );
}

function Field({ id, label, children }: { id?: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="h-px flex-1 bg-border" />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
