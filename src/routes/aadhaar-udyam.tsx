import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhaar-udyam.html?raw";

export const Route = createFileRoute("/aadhaar-udyam")({
    head: () => ({
    meta: [
      { title: "Aadhaar Udyam - Aadhaar Based MSME Registration Verifica..." },
      { name: "description", content: "Expert consultancy assistance for aadhaar udyam - aadhaar based msme registration verifica.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Aadhaar Udyam - Aadhaar Based MSME Registration Verifica..." },
      { property: "og:description", content: "Expert consultancy assistance for aadhaar udyam - aadhaar based msme registration verifica.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhaar-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhaar Udyam" linkTitle="Aadhar Udyam - Aadhaar Linked MSME Registration" html={html} />,
});
