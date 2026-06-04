import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-msme-udyam-certificate.html?raw";

export const Route = createFileRoute("/print-msme-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Print MSME Udyam Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Print MSME Udyam Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Print MSME Udyam Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Print MSME Udyam Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-msme-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Print MSME Udyam Certificate" linkTitle="Print MSME Udyam Certificate" html={html} />,
});
