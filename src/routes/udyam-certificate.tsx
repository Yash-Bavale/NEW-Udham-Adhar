import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate.html?raw";

export const Route = createFileRoute("/udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam certificate" linkTitle="Udyam certificate" html={html} />,
});
