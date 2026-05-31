import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-print-certificate.html?raw";

export const Route = createFileRoute("/msme-print-certificate")({
    head: () => ({
    meta: [
      { title: "MSME Print Certificate" },
      { name: "description", content: "Expert consultancy assistance for msme print certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Print Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for msme print certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-print-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Print Certificate | Download & Print MSME Udyam Certifi" html={html} />,
});
