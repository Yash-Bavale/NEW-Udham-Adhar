import { type ReactNode } from "react";
import { LeadForm } from "./LeadForm";

const proseClasses =
  "p-6 md:p-8 space-y-4 text-foreground/85 text-[15px] leading-relaxed " +
  "[&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:first:mt-0 " +
  "[&_h3]:font-display [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 " +
  "[&_a]:text-brand-navy [&_a]:underline " +
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 " +
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 " +
  "[&_p]:my-3 [&_strong]:text-foreground";

/** Two-column service page: lead form on the left, info content on the right. */
export function ServicePageLayout({
  title,
  children,
  showSampleCertificate = false,
}: {
  title: string;
  children: ReactNode;
  showSampleCertificate?: boolean;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8 space-y-6">
      <section className="grid gap-6 lg:grid-cols-2 items-start">
        <LeadForm title={title} />
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="bg-form-header text-white text-center py-4">
            <h2 className="text-xl font-bold font-display">{title}</h2>
          </div>
          <div className={proseClasses}>{children}</div>
        </div>
      </section>

      {showSampleCertificate && (
        <section className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-form-header text-white text-center py-4">
              <h2 className="text-xl font-bold font-display">Sample Udyam Certificate</h2>
            </div>
            <div className="p-6">
              <img
                src="https://www.udyamadhar.in/wp-content/uploads/2026/05/udyam-certificate-design-1.webp"
                alt="Sample Udyam Registration Certificate"
                className="w-full h-auto rounded-md border border-border"
                loading="lazy"
              />
              <p className="mt-3 text-center text-sm text-muted-foreground text-slate-950">
                Note: Sample Udyam Registration Certificate shown for reference purposes only.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
