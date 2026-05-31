import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout } from "@/components/site/ServicePageLayout";

export const Route = createFileRoute("/migrate-udyog-aadhaar-to-udyam")({
  head: () => ({
    meta: [
      { title: "Migrate Udyog Aadhaar to Udyam Registration" },
      { name: "description", content: "Migrate your old Udyog Aadhaar (UAM) registration to the new Udyam Registration with consultancy assistance." },
      { property: "og:title", content: "Migrate Udyog Aadhaar to Udyam" },
      { property: "og:description", content: "Convert your existing Udyog Aadhaar to the new Udyam Registration with help from Business Help Services." },
    ],
  }),
  component: () => (
    <ServicePageLayout title="Migrate Udyog Aadhaar to Udyam">
      <p>
        If you have an old <strong>Udyog Aadhaar Memorandum (UAM)</strong>
        registration, it must be migrated to the new <strong>Udyam
        Registration</strong> system. We assist with the entire migration
        process end-to-end.
      </p>
    </ServicePageLayout>
  ),
});
