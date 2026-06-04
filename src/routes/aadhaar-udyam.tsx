import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhaar-udyam.html?raw";

export const Route = createFileRoute("/aadhaar-udyam")({
  head: () => ({
    meta: [
      { title: "Aadhaar Udyam — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Aadhaar Udyam. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Aadhaar Udyam — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Aadhaar Udyam. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhaar-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhaar Udyam" linkTitle="Aadhaar Udyam" html={html} />,
});
