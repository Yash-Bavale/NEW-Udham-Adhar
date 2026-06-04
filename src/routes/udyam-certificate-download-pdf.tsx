import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-download-pdf.html?raw";

export const Route = createFileRoute("/udyam-certificate-download-pdf")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Download PDF — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Certificate Download PDF. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Certificate Download PDF — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Certificate Download PDF. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-download-pdf" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Download PDF" linkTitle="Udyam Certificate Download PDF" html={html} />,
});
