import { useState } from "react";
import { toast } from "sonner";
import { INDIAN_STATES, LANGUAGES } from "@/lib/constants";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track";
import { formatIST } from "@/lib/datetime";

export function ContactPage() {
  const [submitted, setSubmitted] = useState<{ submittedAt: string } | null>(null);
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
      message: String(fd.get("message") ?? "").trim(),
    };
    if (typeof window !== "undefined" && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion();
    }

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `Could not submit (status ${res.status}). Please try again.`);
      }
      setSubmitted({ submittedAt: json.submittedAt || new Date().toISOString() });
      toast.success("Message sent. We'll be in touch soon.");
      trackEvent("contact_form_submitted", { state: payload.state });
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
        <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">Contact Business Help Services</h1>
        <p>Thank you for visiting Business Help Services.</p>
        <p>
          We are committed to providing professional consultancy, documentation
          support, communication handling, coordination assistance, and
          process-related support services in a simple, transparent, and
          convenient manner.
        </p>
        <p>
          For any service-related queries, operational assistance, support
          requests, or communication regarding your order/application, users
          may contact us through the details provided below.
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

      {/* Right: contact form card */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-form-header text-white text-center py-4">
          <h2 className="text-xl font-bold font-display">Contact Us</h2>
        </div>

        {submitted ? (
          <div className="p-6 md:p-8 text-center space-y-3">
            <p className="text-lg font-semibold text-foreground">Thank you!</p>
            <p className="text-sm text-muted-foreground">
              We've received your message and sent a confirmation to your email.
            </p>
            <div className="inline-block rounded-lg bg-muted/60 px-4 py-2 text-xs font-mono text-foreground font-medium">
              Submitted Time: {formatIST(submitted.submittedAt)}
            </div>
            <p className="text-xs text-muted-foreground">
              Our team will respond within working hours.
            </p>
          </div>
        ) : (

          <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-5">
            <Field label="Applicant Name / आवेदक का नाम" htmlFor="contact-name">
              <input
                id="contact-name"
                name="name"
                required
                maxLength={120}
                className={inputCls}
                placeholder="Enter Applicant Name"
              />
            </Field>

            <Field label="Email / ईमेल" htmlFor="contact-email">
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={160}
                className={inputCls}
                placeholder="Enter your email"
              />
            </Field>

            <Field label="Mobile No / मोबाइल नंबर" htmlFor="contact-mobile">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-foreground/80 font-medium">
                  +91
                </span>
                <input
                  id="contact-mobile"
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

            <Field label="State / राज्य" htmlFor="contact-state">
              <select id="contact-state" name="state" required defaultValue="" className={inputCls}>
                <option value="" disabled>Select Your State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Language / भाषा" htmlFor="contact-language">
              <select id="contact-language" name="language" required defaultValue="" className={inputCls}>
                <option value="" disabled>Select Language</option>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>

            <Field label="Purpose of Contact / संपर्क का उद्देश्य" htmlFor="contact-message">
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                maxLength={1000}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter Message"
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
              {busy ? "Submitting…" : "SUBMIT"}
            </button>

          </form>
        )}
      </div>

      {/* Full-width: communication, support, disclaimer */}
      <div className="lg:col-span-2 space-y-10 mt-4">
        <InfoBlock title="Communication & Support">
          <ul>
            <li>Official communication may ordinarily be conducted through email or other written communication channels.</li>
            <li>Users are advised to regularly monitor their registered communication channels for updates, verification requests, confirmations, and operational communication.</li>
            <li>For operational, verification, compliance, quality-control, and record-management purposes, users may be requested to communicate through written communication channels.</li>
            <li>Customer support and communication are currently available only in Marathi, Hindi, and English languages.</li>
            <li>Support response timelines are indicative and may vary depending upon workload, operational requirements, holidays, technical conditions, or external dependencies.</li>
          </ul>
        </InfoBlock>

        <InfoBlock title="Before Contacting Support">
          <p>To help us assist you more efficiently, users are advised to keep the following details ready while contacting support:</p>
          <ul>
            <li>Registered Name</li>
            <li>Registered Mobile Number</li>
            <li>Registered Email Address</li>
            <li>Order / Application Number</li>
            <li>Payment Reference Number (if applicable)</li>
            <li>Relevant screenshot or error details (if applicable)</li>
          </ul>
        </InfoBlock>

        <InfoBlock title="Important Disclaimer">
          <p>Business Help Services is a private consultancy and assistance service provider.</p>
          <ul>
            <li>We are not affiliated with, authorized by, endorsed by, or associated with any government authority or department.</li>
            <li>Services provided through this Platform are consultancy and assistance-based professional services.</li>
            <li>Users may independently access official services directly through respective official portals wherever applicable.</li>
          </ul>
          <p>
            We appreciate the opportunity to assist you and look forward to supporting your
            business, documentation, registration, and process-related requirements.
          </p>
        </InfoBlock>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold font-display text-foreground">
            For more information or questions, please contact our customer care.
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
