import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-certificate-download.html?raw";

export const Route = createFileRoute("/msme-registration-certificate-download")({
  head: () => ({
    meta: [
      { title: "MSME Registration Certificate Download – Get Udyam Certificate PDF" },
      { name: "description", content: "MSME Registration Certificate Download allows businesses to instantly access their Udyam Certificate online. Using your URN and registered mobile number..." },
      { property: "og:title", content: "MSME Registration Certificate Download – Get Udyam Certificate PDF" },
      { property: "og:description", content: "MSME Registration Certificate Download allows businesses to instantly access their Udyam Certificate online. Using your URN and registered mobile number..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/download-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Certificate Download" linkTitle="MSME Registration Certificate Download – Get Udyam Certificate PDF" content={`MSME Registration Certificate Download allows businesses to instantly access their Udyam Certificate online. Using your URN and registered mobile number for OTP verification, you can download a digitally signed PDF certificate. This official document confirms your enterprise classification as micro, small, or medium, and is required to access loans, government subsidies, tenders, and other support schemes. The process is fast, secure, paperless, and ensures that businesses remain compliant with MSME regulations. Entrepreneurs can store or print the certificate for verification purposes and continue leveraging government incentives to enhance operations, credibility, and financial growth.`} html={html} />,
});
