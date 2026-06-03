import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-download-pdf.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-download-pdf")({
    head: () => ({
    meta: [
      { title: "Udyam Aadhaar Download PDF – Get Your MSME Certificate" },
      { name: "description", content: "Expert consultancy assistance for udyam aadhaar download pdf – get your msme certificate. Get help with Udyam/MSME registration, updates and certificates acr..." },
      { property: "og:title", content: "Udyam Aadhaar Download PDF – Get Your MSME Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for udyam aadhaar download pdf – get your msme certificate. Get help with Udyam/MSME registration, updates and certificates acr..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-download-pdf" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Download PDF" linkTitle="Udyam Aadhaar Download PDF – Get Your MSME Certificate" html={html} />,
});
