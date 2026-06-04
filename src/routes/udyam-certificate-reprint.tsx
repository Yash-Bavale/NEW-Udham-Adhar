import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-reprint.html?raw";

export const Route = createFileRoute("/udyam-certificate-reprint")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Reprint — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Certificate Reprint. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Certificate Reprint — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Certificate Reprint. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-reprint" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Reprint" linkTitle="Udyam Certificate Reprint" html={html} />,
});
