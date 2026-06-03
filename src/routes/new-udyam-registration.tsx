import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout } from "@/components/site/ServicePageLayout";

export const Route = createFileRoute("/new-udyam-registration")({
  head: () => ({
    meta: [
      { title: "New Udyam Registration — Apply Online with Consultancy Help" },
      { name: "description", content: "Apply for a new Udyam Registration for your micro, small or medium enterprise with assistance from Udyam Aadhar." },
      { property: "og:title", content: "New Udyam Registration — Apply Online" },
      { property: "og:description", content: "Get consultancy help applying for a new Udyam Registration certificate." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/new-udyam-registration" },
    ],
  }),
  component: () => (
    <ServicePageLayout title="New Udyam Registration" showSampleCertificate>
      <p>
        Apply for a new Business Help Services with end-to-end consultancy
        assistance — we help you compile the required information, verify
        details, and complete the application on the official Udyam portal.
      </p>
      <p>
        <strong>What you'll need:</strong> Aadhaar number of the proprietor /
        authorised signatory, PAN, business address, NIC activity, employment
        count, and bank details.
      </p>
    </ServicePageLayout>
  ),
});
