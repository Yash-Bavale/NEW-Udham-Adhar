import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Online — Apply, Update, Download & Migrate" },
      {
        name: "description",
        content:
          "Get assistance with new Udyam Registration, certificate updates, downloads, Udyog Aadhaar migration and corrections — Business Help Consultancy Services.",
      },
      { property: "og:title", content: "Udyam Registration — Business Help Consultancy" },
      {
        property: "og:description",
        content:
          "Consultancy assistance for MSME / Udyam Registration. Apply, update, download or migrate your certificate.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 grid gap-8 lg:grid-cols-2 items-start">
      <LeadForm />

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-form-header text-white text-center py-4">
          <h2 className="text-xl font-bold font-display">Udyam Sample Certificate</h2>
        </div>
        <div className="p-6">
          <img
            src="https://www.udyamadhar.in/wp-content/uploads/2026/05/udyam-certificate-design-1.webp"
            alt="Sample Udyam Registration Certificate"
            className="w-full h-auto rounded-md border border-border"
            loading="lazy"
          />
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Sample Udyam Registration Certificate shown for reference purposes only.
          </p>
        </div>
      </div>
    </section>
  );
}
