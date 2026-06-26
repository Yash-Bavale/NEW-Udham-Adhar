import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar.html?raw";

export const Route = createFileRoute("/udyog-aadhaar")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar - Previous MSME Registration System" },
      { name: "description", content: "Udyog Aadhaar was the government’s earlier system for registering micro, small, and medium enterprises before the introduction of the Udyam portal...." },
      { property: "og:title", content: "Udyog Aadhaar - Previous MSME Registration System" },
      { property: "og:description", content: "Udyog Aadhaar was the government’s earlier system for registering micro, small, and medium enterprises before the introduction of the Udyam portal...." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyog-aadhaar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar" linkTitle="Udyog Aadhaar - Previous MSME Registration System" content={`Udyog Aadhaar was the government’s earlier system for registering micro, small, and medium enterprises before the introduction of the Udyam portal. Through Udyog Aadhaar, businesses applied online to receive a unique Udyog Aadhaar Number (UAN) and a certificate that verified their MSME status. The certificate enabled access to government benefits such as loans, subsidies, tax concessions, and eligibility for participation in procurement tenders. While the Udyog Aadhaar system is still recognized, the government recommends migrating to Udyam registration for faster processing, enhanced digital security, and instant certificate issuance. The Udyog Aadhaar registration process required providing basic business details and Aadhaar verification, ensuring authenticity and formal recognition. Upgrading from Udyog Aadhaar to Udyam provides seamless access to modern MSME support schemes, digital records, and simplified updates of business information. The transition enhances credibility with banks, clients, and government institutions while ensuring uninterrupted access to financial and operational benefits offered to small and medium enterprises across India.`} html={html} />,
});
