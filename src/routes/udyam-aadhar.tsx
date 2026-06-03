import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhar.html?raw";

export const Route = createFileRoute("/udyam-aadhar")({
    head: () => ({
    meta: [
      { title: "Udyam Aadhar - Aadhaar-based MSME Registration" },
      { name: "description", content: "Expert consultancy assistance for udyam aadhar - aadhaar-based msme registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Aadhar - Aadhaar-based MSME Registration" },
      { property: "og:description", content: "Expert consultancy assistance for udyam aadhar - aadhaar-based msme registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhar" linkTitle="Udyam Aadhar - Aadhaar-based MSME Registration" html={html} />,
});
