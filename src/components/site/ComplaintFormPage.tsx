import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, ShieldAlert } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track";
import policyHtml from "@/content/wp/grievance-redressal-policy.html?raw";

export function ComplaintFormPage() {
  const [submitted, setSubmitted] = useState<string | null>(null);
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
      setSubmitted(json.complaintNumber || "submitted");
      toast.success("Complaint recorded. We'll review it shortly.");
      trackEvent("complaint_form_submitted", {});
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error. Please check your connection and try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-12 rounded-full bg-brand-navy/10 text-brand-navy mb-3">
          <ShieldAlert className="size-6" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
          Raise a Complaint
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          Share your grievance with us. Our team will review and respond within working hours.
        </p>
      </div>

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
            <p className="text-lg font-mono font-bold text-brand-navy">{submitted}</p>
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to you. Our team will get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-5">
            <Field label="Full Name / पूरा नाम">
              <input
                name="name"
                required
                maxLength={120}
                className={inputCls}
                placeholder="Enter your full name"
              />
            </Field>

            <Field label="Email / ईमेल">
              <input
                name="email"
                type="email"
                required
                maxLength={160}
                className={inputCls}
                placeholder="Enter your email address"
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

            <Field label="Application / Order Reference (Optional)">
              <input
                name="application_ref"
                maxLength={80}
                className={inputCls}
                placeholder="e.g. APP-2026-12345 (if any)"
              />
            </Field>

            <Field label="Complaint / तक्रार">
              <textarea
                name="message"
                required
                rows={6}
                minLength={10}
                maxLength={2000}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Please describe your complaint in detail…"
              />
            </Field>

            {error && <p className="text-sm text-red-600 -mt-2">{error}</p>}

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

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          You can also reach our grievance team directly:
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-brand-navy font-semibold">
          <a href="tel:+919767870331" className="inline-flex items-center gap-2 hover:underline">
            <Phone className="w-5 h-5" /> +91-9767870331
          </a>
          <a
            href="mailto:help@businesshelpservices.com"
            className="inline-flex items-center gap-2 hover:underline"
          >
            <Mail className="w-5 h-5" /> help@businesshelpservices.com
          </a>
        </div>
      </div>

      <div className="mt-12 rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
        <div className="bg-gradient-to-br from-brand-navy to-brand-navy-deep text-white px-6 md:px-10 py-8 md:py-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldAlert className="size-3.5" /> Official Policy
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">{"\n"}</h2>
          <p className="mt-2 text-sm md:text-base text-white/80 max-w-2xl">
            How Business Help Services receives, reviews, and resolves user complaints and grievances — fairly, transparently, and professionally.
          </p>
        </div>
        <article
          className="policy-prose px-6 md:px-10 py-8 md:py-10 prose prose-sm md:prose-base max-w-none
            prose-headings:font-display prose-headings:text-foreground
            prose-h2:hidden
            prose-h3:text-xl prose-h3:mt-0 prose-h3:mb-6 prose-h3:text-brand-navy
            prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3 prose-h4:pl-4 prose-h4:border-l-4 prose-h4:border-brand-navy prose-h4:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-li:text-muted-foreground prose-li:marker:text-brand-navy
            prose-strong:text-foreground
            prose-a:text-brand-navy prose-a:no-underline hover:prose-a:underline
            prose-ul:my-4 prose-ol:my-4"
          dangerouslySetInnerHTML={{ __html: policyHtml }}
        />
      </div>
    </section>);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
