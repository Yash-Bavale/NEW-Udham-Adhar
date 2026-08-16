import { useState } from "react";
import { toast } from "sonner";
import { INDIAN_STATES, LANGUAGES } from "@/lib/constants";
import { Mail, Phone, MapPin, Clock, ShieldAlert } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track";
import { formatIST } from "@/lib/datetime";
import policyHtml from "@/content/wp/grievance-redressal-policy.html?raw";

export function ComplaintFormPage() {
  const [submitted, setSubmitted] = useState<{ complaintNumber: string; submittedAt: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputCls =
    "w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      message: String(fd.get("message") ?? "").trim(),
    };
    try {
      const res = await fetch("/api/public/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `Could not submit (status ${res.status}). Please try again.`);
      }
      setSubmitted({
        complaintNumber: json.complaintNumber || "submitted",
        submittedAt: json.submittedAt || new Date().toISOString(),
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

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12 grid gap-8 lg:grid-cols-2 items-start">
      {/* Left: intro + contact details */}
      <div className="space-y-5 text-foreground/90 text-[15px] leading-relaxed">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-navy/10 px-3.5 py-1 text-xs font-semibold text-brand-navy">
          <ShieldAlert className="size-4" /> Official Grievance Portal
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">
          File a Complaint — Business Help Services
        </h1>
        <p>Welcome to the Business Help Services Complaint & Grievance Redressal Desk.</p>
        <p>
          We take user feedback, operational difficulties, and service complaints with utmost seriousness. Our team is dedicated to providing transparent, fair, and prompt resolution for any concern regarding your application or consultancy services.
        </p>
        <p>
          If you are facing any delays, verification issues, or service dissatisfaction, please fill out the complaint form below or reach our team directly using the details provided.
        </p>

        <ul className="space-y-4 pt-2">
          <li className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-brand-navy mt-0.5 shrink-0" />
            <span>
              <strong>Working Hours:</strong>{" "}
              <span>10:00 AM to 05:00 PM (IST) (Sunday &amp; Public Holidays off)</span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-brand-navy mt-0.5 shrink-0" />
            <a href="mailto:help@businesshelpservices.com" className="text-brand-navy hover:underline">
              <strong>Email:</strong>{" "}
              <span>help@businesshelpservices.com</span>
            </a>
          </li>
          <li className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-brand-navy mt-0.5 shrink-0" />
            <a href="tel:+919767870331" className="text-brand-navy hover:underline">
              <strong>Phone:</strong>{" "}
              <span>+91-9767870331</span>
            </a>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-brand-navy mt-0.5 shrink-0" />
            <span>
              <strong>Address:</strong>{" "}
              <span>Koregaon Bk, Khed, Pune, Maharashtra – 410505, India</span>
            </span>
          </li>
        </ul>
      </div>

      {/* Right: complaint form card */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-form-header text-white text-center py-4">
          <h2 className="text-xl font-bold font-display">Complaint Form</h2>
        </div>

        {submitted ? (
          <div className="p-6 md:p-8 text-center space-y-3">
            <p className="text-lg font-semibold text-foreground">Thank you!</p>
            <p className="text-sm text-muted-foreground">
              Your complaint has been recorded. Reference number:
            </p>
            <p className="text-lg font-mono font-bold text-brand-navy">{submitted.complaintNumber}</p>
            <div className="inline-block rounded-lg bg-muted/60 px-4 py-2 text-xs font-mono text-foreground font-medium">
              Submitted Time: {formatIST(submitted.submittedAt)}
            </div>
            <p className="text-xs text-muted-foreground">
              A confirmation email has been sent to you. Our grievance team will review your case and respond within working hours.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-5">
            <Field label="Applicant Name / आवेदक का नाम" htmlFor="complaint-name">
              <input
                id="complaint-name"
                name="name"
                required
                maxLength={120}
                className={inputCls}
                placeholder="Enter Applicant Name"
              />
            </Field>

            <Field label="Email / ईमेल" htmlFor="complaint-email">
              <input
                id="complaint-email"
                name="email"
                type="email"
                required
                maxLength={160}
                className={inputCls}
                placeholder="Enter your email address"
              />
            </Field>

            <Field label="Mobile No / मोबाइल नंबर" htmlFor="complaint-mobile">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-foreground/80 font-medium">
                  +91
                </span>
                <input
                  id="complaint-mobile"
                  name="mobile"
                  required
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  className={`${inputCls} pl-14`}
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
            </Field>

            <Field label="State / राज्य" htmlFor="complaint-state">
              <select id="complaint-state" name="state" required defaultValue="" className={inputCls}>
                <option value="" disabled>Select Your State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Language / भाषा" htmlFor="complaint-language">
              <select id="complaint-language" name="language" required defaultValue="" className={inputCls}>
                <option value="" disabled>Select Language</option>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>

            <Field label="Application / Order Reference (Optional)" htmlFor="complaint-ref">
              <input
                id="complaint-ref"
                name="application_ref"
                maxLength={80}
                className={inputCls}
                placeholder="e.g. APP-2026-12345 (if any)"
              />
            </Field>

            <Field label="Complaint / तक्रार" htmlFor="complaint-message">
              <textarea
                id="complaint-message"
                name="message"
                required
                rows={5}
                minLength={10}
                maxLength={2000}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Please describe your complaint in detail…"
              />
            </Field>

            {error && (
              <p className="text-sm text-red-600 -mt-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold py-3 transition-colors disabled:opacity-60"
            >
              {busy ? "Submitting…" : "SUBMIT COMPLAINT"}
            </button>
          </form>
        )}
      </div>

      {/* Full-width: info blocks, support details, policy */}
      <div className="lg:col-span-2 space-y-10 mt-4">
        <InfoBlock title="Grievance Handling & Resolution">
          <ul>
            <li>Every complaint received is assigned a unique reference ticket ID for transparent tracking.</li>
            <li>Our internal compliance officer reviews grievance details within 24 to 48 working hours.</li>
            <li>Official responses or clarification requests will be sent to your registered email address and mobile number.</li>
            <li>Support is available in Marathi, Hindi, and English.</li>
            <li>Resolution timelines depend on application stage, government portal responsiveness, and external dependencies.</li>
          </ul>
        </InfoBlock>

        <InfoBlock title="Before Filing a Complaint">
          <p>To help us resolve your issue swiftly, please keep the following details ready when submitting your grievance:</p>
          <ul>
            <li>Applicant Full Name (matching Aadhaar / Order)</li>
            <li>Registered Mobile Number & Email Address</li>
            <li>Order Number / Application Reference ID (if applicable)</li>
            <li>Payment Reference Number (if applicable)</li>
            <li>Clear description of the issue or grievance faced</li>
          </ul>
        </InfoBlock>

        <InfoBlock title="Important Disclaimer">
          <p>Business Help Services is a private consultancy and assistance service provider.</p>
          <ul>
            <li>We are an independent consultancy and not affiliated with any government authority or official department.</li>
            <li>Services provided through this Platform are consultancy and documentation assistance services.</li>
            <li>Users may also file complaints directly with respective statutory authorities wherever applicable.</li>
          </ul>
        </InfoBlock>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold font-display text-foreground">
            For urgent grievance support, contact our compliance desk directly.
          </h3>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-brand-navy font-semibold">
            <a href="tel:+919767870331" className="inline-flex items-center gap-2 hover:underline">
              <Phone className="w-5 h-5" /> +91-9767870331
            </a>
            <a href="mailto:help@businesshelpservices.com" className="inline-flex items-center gap-2 hover:underline">
              <Mail className="w-5 h-5" /> help@businesshelpservices.com
            </a>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
          <div className="bg-gradient-to-br from-brand-navy to-brand-navy-deep text-white px-6 md:px-10 py-8 md:py-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldAlert className="size-3.5" /> Grievance Policy
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display">Grievance Redressal Policy</h2>
            <p className="mt-2 text-sm md:text-base text-white/80 max-w-2xl">
              How Business Help Services receives, reviews, and resolves user complaints and grievances — fairly, transparently, and professionally.
            </p>
          </div>
          <article
            className="policy-prose px-6 md:px-10 py-8 md:py-10 prose prose-sm md:prose-base max-w-none
              prose-headings:font-display prose-headings:text-foreground
              prose-h2:hidden
              prose-h3:text-xl prose-h3:mt-0 prose-h3:mb-6 prose-h3:text-brand-navy
              prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3 prose-h4:pl-4 prose-h4:border-l-4 prose-h4:border-brand-navy prose-h4:text-foreground prose-h4:font-bold
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-li:text-muted-foreground prose-li:marker:text-brand-navy
              prose-strong:text-foreground
              prose-a:text-brand-navy prose-a:no-underline hover:prose-a:underline
              prose-ul:my-4 prose-ol:my-4"
            dangerouslySetInnerHTML={{ __html: policyHtml }}
          />
        </div>
      </div>
    </section>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="bg-form-header text-white px-6 py-3">
        <h3 className="text-lg font-bold font-display tracking-wide uppercase">{title}</h3>
      </div>
      <div className="p-6 md:p-8 space-y-3 text-foreground/85 text-[15px] leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_p]:my-2">
        {children}
      </div>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-foreground mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
