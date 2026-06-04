import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print-certificate.html?raw";

export const Route = createFileRoute("/udyam-print-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Print Certificate | MSME Certificate Printing Guide" },
      { name: "description", content: "Udyam Print Certificate provides a simple and secure way to print your MSME certificate directly from the official portal. By downloading the certificate..." },
      { property: "og:title", content: "Udyam Print Certificate | MSME Certificate Printing Guide" },
      { property: "og:description", content: "Udyam Print Certificate provides a simple and secure way to print your MSME certificate directly from the official portal. By downloading the certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print Certificate" linkTitle="Udyam Print Certificate | MSME Certificate Printing Guide" content={`Udyam Print Certificate provides a simple and secure way to print your MSME certificate directly from the official portal. By downloading the certificate PDF after OTP verification, entrepreneurs can access an official document containing all key business details. This certificate is essential for bank loans, subsidies, government tenders, and other MSME-related benefits. The portal ensures a paperless, fast, and user-friendly experience, guiding users step-by-step through the download and print process. Keeping a printed certificate ready ensures compliance, credibility, and uninterrupted access to financial and government schemes. Udyam Print Certificate simplifies documentation management for all micro, small, and medium enterprises.`} html={html} />,
});
