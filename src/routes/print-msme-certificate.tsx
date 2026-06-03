import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-msme-certificate.html?raw";

export const Route = createFileRoute("/print-msme-certificate")({
    head: () => ({
    meta: [
      { title: "Print MSME Certificate" },
      { name: "description", content: "Expert consultancy assistance for print msme certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Print MSME Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for print msme certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-msme-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Print MSME Certificate" html={html} />,
});
