import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhar-registration.html?raw";

export const Route = createFileRoute("/udyam-aadhar-registration")({
    head: () => ({
    meta: [
      { title: "Udyam Aadhar Registration - Aadhaar Linked MSME Registra..." },
      { name: "description", content: "Expert consultancy assistance for udyam aadhar registration - aadhaar linked msme registra.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Aadhar Registration - Aadhaar Linked MSME Registra..." },
      { property: "og:description", content: "Expert consultancy assistance for udyam aadhar registration - aadhaar linked msme registra.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhar-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhar Registration - Aadhaar Linked MSME Registration" html={html} />,
});
