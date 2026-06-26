import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-certificate.html?raw";

export const Route = createFileRoute("/aadhar-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Certificate - Aadhaar Linked MSME Certification" },
      { name: "description", content: "The Aadhar Udyam certificate is issued after linking an entrepreneur’s Aadhaar number with their MSME registration on the official Udyam portal. This..." },
      { property: "og:title", content: "Aadhar Udyam Certificate - Aadhaar Linked MSME Certification" },
      { property: "og:description", content: "The Aadhar Udyam certificate is issued after linking an entrepreneur’s Aadhaar number with their MSME registration on the official Udyam portal. This..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/aadhar-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam certificate" linkTitle="Aadhar Udyam Certificate - Aadhaar Linked MSME Certification" content={`The Aadhar Udyam certificate is issued after linking an entrepreneur’s Aadhaar number with their MSME registration on the official Udyam portal. This digitally signed certificate confirms the business as a registered Micro, Small, or Medium Enterprise, serving as legal proof for banks, financial institutions, clients, and government authorities. The certificate enables access to various government benefits, including loans, subsidies, priority lending, and participation in procurement tenders, while ensuring compliance with regulatory requirements. It can be downloaded anytime online, allowing businesses to maintain digital records and update information when needed. By obtaining the Aadhar Udyam certificate, startups, small businesses, and established enterprises gain formal recognition, operational credibility, and eligibility for financial and operational support programs aimed at fostering growth, market expansion, and long-term sustainability within India’s MSME ecosystem.`} html={html} />,
});
