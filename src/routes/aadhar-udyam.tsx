import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam.html?raw";

export const Route = createFileRoute("/aadhar-udyam")({
    head: () => ({
    meta: [
      { title: "Aadhar Udyam - Aadhaar Linked MSME Registration" },
      { name: "description", content: "Expert consultancy assistance for aadhar udyam - aadhaar linked msme registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Aadhar Udyam - Aadhaar Linked MSME Registration" },
      { property: "og:description", content: "Expert consultancy assistance for aadhar udyam - aadhaar linked msme registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam - Aadhaar Linked MSME Registration" html={html} />,
});
