import { useState } from "react";
import { INDIAN_STATES, LANGUAGES } from "@/lib/constants";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const inputCls =
    "w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    // Best-effort: open user's mail client with the message pre-filled.
    const fd = new FormData(e.currentTarget);
    const subject = encodeURIComponent(
      `Contact request from ${String(fd.get("name") ?? "")}`,
    );
    const body = encodeURIComponent(
      `Name: ${fd.get("name") ?? ""}\nEmail: ${fd.get("email") ?? ""}\nMobile: +91${fd.get("mobile") ?? ""}\nState: ${fd.get("state") ?? ""}\nLanguage: ${fd.get("language") ?? ""}\n\nMessage:\n${fd.get("message") ?? ""}`,
    );
    window.location.href = `mailto:help@businesshelpservices.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setBusy(false);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12 grid gap-8 lg:grid-cols-2 items-start">
      {/* Left: intro + contact details */}
      <div className="space-y-5 text-foreground/90 text-[15px] leading-relaxed">
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
              <strong>Working Hours:</strong> 10:00 AM to 05:00 PM (IST) (Sunday
              &amp; Public Holidays off)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-brand-navy mt-0.5 shrink-0" />
            <a
              href="mailto:help@businesshelpservices.com"
              className="text-brand-navy hover:underline"
            >
              <strong>Email:</strong> help@businesshelpservices.com
            </a>
          </li>
          <li className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-brand-navy mt-0.5 shrink-0" />
            <a href="tel:+919767870331" className="text-brand-navy hover:underline">
              <strong>Phone:</strong> +91-9767870331
            </a>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-brand-navy mt-0.5 shrink-0" />
            <span>
              <strong>Address:</strong> Koregaon Bk, Khed, Pune, Maharashtra –
              410505, India
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
              Your mail client has been opened with your message. We will respond
              within working hours.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-5">
            <Field label="Applicant Name / आवेदक का नाम">
              <input
                name="name"
                required
                maxLength={120}
                className={inputCls}
                placeholder="Enter Applicant Name"
              />
            </Field>

            <Field label="Email / ईमेल">
              <input
                name="email"
                type="email"
                required
                maxLength={160}
                className={inputCls}
                placeholder="Enter your email"
              />
            </Field>

            <Field label="Mobile No / मोबाइल नंबर">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-foreground/80 font-medium">
                  +91
                </span>
                <input
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

            <Field label="State / राज्य">
              <select name="state" required defaultValue="" className={inputCls}>
                <option value="" disabled>Select Your State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Language / भाषा">
              <select name="language" required defaultValue="" className={inputCls}>
                <option value="" disabled>Select Language</option>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>

            <Field label="Purpose of Contact / संपर्क का उद्देश्य">
              <textarea
                name="message"
                required
                rows={5}
                maxLength={1000}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter Message"
              />
            </Field>

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
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
