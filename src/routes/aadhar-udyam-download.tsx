import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-download.html?raw";

export const Route = createFileRoute("/aadhar-udyam-download")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Download - Download Aadhaar Linked MSME Certificate" },
      { name: "description", content: "Aadhar Udyam download allows businesses to access their Aadhaar-linked MSME certificate through the official Udyam portal. This digital certificate..." },
      { property: "og:title", content: "Aadhar Udyam Download - Download Aadhaar Linked MSME Certificate" },
      { property: "og:description", content: "Aadhar Udyam download allows businesses to access their Aadhaar-linked MSME certificate through the official Udyam portal. This digital certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/download-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam download" linkTitle="Aadhar Udyam Download - Download Aadhaar Linked MSME Certificate" content={`Aadhar Udyam download allows businesses to access their Aadhaar-linked MSME certificate through the official Udyam portal. This digital certificate confirms that the enterprise is officially registered as a micro, small, or medium business and ensures eligibility for government schemes, loans, subsidies, and procurement benefits. The certificate is secure, digitally signed, and instantly available for download anytime online. Linking Aadhaar simplifies verification for banks, financial institutions, and government authorities while maintaining authenticity and compliance. Entrepreneurs can store, print, or share the certificate easily for official purposes. Aadhar Udyam download ensures that businesses maintain uninterrupted access to benefits and financial support, providing a seamless, paperless solution for MSME certification and operational growth.`} html={html} />,
});
