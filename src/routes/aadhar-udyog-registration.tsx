import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyog-registration.html?raw";

export const Route = createFileRoute("/aadhar-udyog-registration")({
    head: () => ({
    meta: [
      { title: "Aadhar Udyog Registration - Aadhaar-Based MSME Registration" },
      { name: "description", content: "Expert consultancy assistance for aadhar udyog registration - aadhaar-based msme registration. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Aadhar Udyog Registration - Aadhaar-Based MSME Registration" },
      { property: "og:description", content: "Expert consultancy assistance for aadhar udyog registration - aadhaar-based msme registration. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyog-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyog Registration - Aadhaar-Based MSME Registration Process" html={html} />,
});
