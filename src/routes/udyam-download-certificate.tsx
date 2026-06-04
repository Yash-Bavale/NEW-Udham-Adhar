import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-download-certificate.html?raw";

export const Route = createFileRoute("/udyam-download-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam download certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam download certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam download certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam download certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-download-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam download certificate" linkTitle="Udyam download certificate" html={html} />,
});
