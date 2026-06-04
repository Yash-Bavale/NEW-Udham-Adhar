import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-government-in.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-government-in")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Government In — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhaar Government In. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhaar Government In — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhaar Government In. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-government-in" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Government In" linkTitle="Udyog Aadhaar Government In" html={html} />,
});
