import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout } from "@/components/site/ServicePageLayout";

export const Route = createFileRoute("/download-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Download Udyam Certificate — Get a Copy with Consultancy Help" },
      { name: "description", content: "Lost your Udyam certificate? Get assistance to download a fresh signed copy of your Business Help Services certificate." },
      { property: "og:title", content: "Download Udyam Certificate Online" },
      { property: "og:description", content: "Download a copy of your Business Help Services certificate with consultancy assistance." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-certificate" },
    ],
  }),
  component: () => (
    <ServicePageLayout title="Download Udyam Certificate">
      <p>
        Get assistance to download a fresh, digitally-signed copy of your Udyam
        Registration certificate using your registration number and registered
        mobile or email.
      </p>
    </ServicePageLayout>
  ),
});
