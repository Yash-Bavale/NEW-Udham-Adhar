import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-print-certificate.html?raw";

export const Route = createFileRoute("/msme-print-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Print Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "MSME Print Certificate provides a secure and easy way to download and print your Udyam certificate online using your registration number. The PDF certificate can be printed for submission to banks, government departments, and tenders. OTP verification ensures safe access to your MSME details. The process is..." },
      { property: "og:title", content: "MSME Print Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "MSME Print Certificate provides a secure and easy way to download and print your Udyam certificate online using your registration number. The PDF certificate can be printed for submission to banks, government departments, and tenders. OTP verification ensures safe access to your MSME details. The process is..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-print-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Print Certificate" linkTitle="MSME Print Certificate" html={html} />,
});
