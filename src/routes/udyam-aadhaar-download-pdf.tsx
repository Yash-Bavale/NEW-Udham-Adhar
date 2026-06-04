import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-download-pdf.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-download-pdf")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Download PDF — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Aadhaar Download PDF. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Aadhaar Download PDF — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Aadhaar Download PDF. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-download-pdf" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Download PDF" linkTitle="Udyam Aadhaar Download PDF" html={html} />,
});
