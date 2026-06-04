import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-adhar-download.html?raw";

export const Route = createFileRoute("/udyam-adhar-download")({
  head: () => ({
    meta: [
      { title: "Udyam Adhar Download | Get MSME Udyam Certificate Online" },
      { name: "description", content: "Udyam Adhar Download enables entrepreneurs to access their official MSME Udyam certificate instantly using their registration number. After completing OTP..." },
      { property: "og:title", content: "Udyam Adhar Download | Get MSME Udyam Certificate Online" },
      { property: "og:description", content: "Udyam Adhar Download enables entrepreneurs to access their official MSME Udyam certificate instantly using their registration number. After completing OTP..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-adhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Adhar Download" linkTitle="Udyam Adhar Download | Get MSME Udyam Certificate Online" content={`Udyam Adhar Download enables entrepreneurs to access their official MSME Udyam certificate instantly using their registration number. After completing OTP verification, the certificate is available in PDF format for printing and official use. This document is essential for applying for bank loans, government tenders, and subsidies. The process is fully digital, paperless, and free of additional documentation, ensuring convenience for all business owners. Step-by-step instructions provide a clear guide to download the certificate safely. Keeping a printed or digital copy ensures compliance with MSME regulations, uninterrupted access to government benefits, and formal recognition of your enterprise. Udyam Adhar Download simplifies certificate management for small and medium enterprises.`} html={html} />,
});
