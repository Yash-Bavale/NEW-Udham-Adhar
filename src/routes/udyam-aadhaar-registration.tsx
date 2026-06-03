import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-registration.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-registration")({
    head: () => ({
    meta: [
      { title: "Udyam Aadhaar Registration - Link Aadhaar for MSME Regis..." },
      { name: "description", content: "Expert consultancy assistance for udyam aadhaar registration - link aadhaar for msme regis.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Aadhaar Registration - Link Aadhaar for MSME Regis..." },
      { property: "og:description", content: "Expert consultancy assistance for udyam aadhaar registration - link aadhaar for msme regis.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Registration" linkTitle="Udyam Aadhar Registration - Aadhaar Linked MSME Registration" html={html} />,
});
