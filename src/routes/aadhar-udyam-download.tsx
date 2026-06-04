import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-download.html?raw";

export const Route = createFileRoute("/aadhar-udyam-download")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Download - Download Aadhaar Linked MSME Certificate" },
      { name: "description", content: "Aadhar Udyam download allows businesses to access their Aadhaar-linked MSME certificate through the official Udyam portal. This digital certificate confirms that the enterprise is officially registered as a micro, small, or medium business and ensures eligibility for government schemes, loans, subsidies, and..." },
      { property: "og:title", content: "Aadhar Udyam Download - Download Aadhaar Linked MSME Certificate" },
      { property: "og:description", content: "Aadhar Udyam download allows businesses to access their Aadhaar-linked MSME certificate through the official Udyam portal. This digital certificate confirms that the enterprise is officially registered as a micro, small, or medium business and ensures eligibility for government schemes, loans, subsidies, and..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam Download" linkTitle="Aadhar Udyam Download - Download Aadhaar Linked MSME Certificate" html={html} />,
});
