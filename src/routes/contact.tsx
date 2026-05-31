import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/site/ContactPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Business Help Services Consultancy" },
      { name: "description", content: "Contact Business Help Services for Business Help Services consultancy assistance — email, phone and address details." },
      { property: "og:title", content: "Contact Us — Business Help Services" },
      { property: "og:description", content: "Reach out to Business Help Services for help with your Business Help Services." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/contact" },
    ],
  }),
  component: ContactPage,
});
