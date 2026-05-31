import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout } from "@/components/site/ServicePageLayout";

export const Route = createFileRoute("/update-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Update Udyam Certificate — Edit Details with Consultancy Help" },
      { name: "description", content: "Update your existing Business Help Services certificate — address, NIC code, investment, turnover and more — with assistance." },
      { property: "og:title", content: "Update Udyam Certificate Online" },
      { property: "og:description", content: "Edit your Udyam certificate details with consultancy assistance from Business Help Services." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/update-udyam-certificate" },
    ],
  }),
  component: () => (
    <ServicePageLayout title="Update Udyam Certificate">
      <p>
        Update your existing Business Help Services certificate — change of business
        name, address, NIC activity, investment, turnover, mobile or email — with
        end-to-end consultancy assistance.
      </p>
    </ServicePageLayout>
  ),
});
