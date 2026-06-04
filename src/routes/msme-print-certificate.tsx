import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-print-certificate.html?raw";

export const Route = createFileRoute("/msme-print-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Print Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME Print Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Print Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME Print Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-print-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Print Certificate" linkTitle="MSME Print Certificate" html={html} />,
});
