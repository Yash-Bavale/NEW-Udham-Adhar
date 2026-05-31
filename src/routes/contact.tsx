import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/site/ContactPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Udyam Registration Consultancy" },
      { name: "description", content: "Contact Business Help Services for Udyam Registration consultancy assistance — email, phone and address details." },
      { property: "og:title", content: "Contact Us — Business Help Services" },
      { property: "og:description", content: "Reach out to Business Help Services for help with your Udyam Registration." },
    ],
  }),
  component: ContactPage,
});
