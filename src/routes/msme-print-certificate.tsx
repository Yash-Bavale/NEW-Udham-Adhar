import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-print-certificate.html?raw";

export const Route = createFileRoute("/msme-print-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Print Certificate | Download & Print MSME Udyam Certificate" },
      { name: "description", content: "MSME Print Certificate provides a secure and easy way to download and print your Udyam certificate online using your registration number. The PDF..." },
      { property: "og:title", content: "MSME Print Certificate | Download & Print MSME Udyam Certificate" },
      { property: "og:description", content: "MSME Print Certificate provides a secure and easy way to download and print your Udyam certificate online using your registration number. The PDF..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/msme-print-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Print Certificate" linkTitle="MSME Print Certificate | Download & Print MSME Udyam Certificate" content={`MSME Print Certificate provides a secure and easy way to download and print your Udyam certificate online using your registration number. The PDF certificate can be printed for submission to banks, government departments, and tenders. OTP verification ensures safe access to your MSME details. The process is entirely digital, paperless, and designed for hassle-free certificate management. By maintaining a printed copy, entrepreneurs ensure compliance with MSME regulations, eligibility for government schemes, and readiness for financial or official applications. Step-by-step guidance helps complete the printing process quickly and accurately, making MSME Print Certificate ideal for all small and medium enterprises.`} html={html} />,
});
