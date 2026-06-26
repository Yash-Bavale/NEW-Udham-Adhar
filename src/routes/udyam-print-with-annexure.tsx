import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print-with-annexure.html?raw";

export const Route = createFileRoute("/udyam-print-with-annexure")({
  head: () => ({
    meta: [
      { title: "Udyam Print With Annexure | Download Full MSME Certificate" },
      { name: "description", content: "Udyam Print With Annexure allows businesses to download and print their Udyam certificate along with the annexure, which contains detailed business..." },
      { property: "og:title", content: "Udyam Print With Annexure | Download Full MSME Certificate" },
      { property: "og:description", content: "Udyam Print With Annexure allows businesses to download and print their Udyam certificate along with the annexure, which contains detailed business..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-print-with-annexure" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print With Annexure" linkTitle="Udyam Print With Annexure | Download Full MSME Certificate" content={`Udyam Print With Annexure allows businesses to download and print their Udyam certificate along with the annexure, which contains detailed business information for official verifications. By completing OTP verification, both documents are available in PDF format for printing. The certificate and annexure are essential for banks, tenders, subsidies, and government schemes. The process is fast, secure, paperless, and easy to follow. Step-by-step guidance ensures accurate printing without errors. Maintaining printed copies of both the certificate and annexure ensures compliance with MSME regulations and uninterrupted access to official benefits. Udyam Print With Annexure streamlines documentation management for entrepreneurs.`} html={html} />,
});
