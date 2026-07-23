import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-register-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-register-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam Register Certificate Download - Download MSME Certificate Online" },
      { name: "description", content: "Udyam register certificate download allows businesses to retrieve their MSME registration certificate instantly from the official Udyam portal. The..." },
      { property: "og:title", content: "Udyam Register Certificate Download - Download MSME Certificate Online" },
      { property: "og:description", content: "Udyam register certificate download allows businesses to retrieve their MSME registration certificate instantly from the official Udyam portal. The..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/download-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam register certificate download" linkTitle="Udyam Register Certificate Download - Download MSME Certificate Online" content={`Udyam register certificate download allows businesses to retrieve their MSME registration certificate instantly from the official Udyam portal. The certificate serves as legal proof of the enterprise's micro, small, or medium status, enabling access to government schemes, subsidies, loans, and participation in procurement tenders. The download process is free, secure, and paperless, providing businesses with instant digital access. Entrepreneurs and businesses can maintain records, update details, and verify credentials for financial institutions or official purposes. Downloading the certificate ensures compliance with government regulations, strengthens credibility, and facilitates uninterrupted access to benefits and opportunities designed for MSME growth, operational efficiency, and sustainability.`} html={html} />,
});
