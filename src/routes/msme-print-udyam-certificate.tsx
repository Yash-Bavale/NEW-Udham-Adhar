import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-print-udyam-certificate.html?raw";

export const Route = createFileRoute("/msme-print-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Print Udyam Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "MSME Print Udyam Certificate allows registered businesses to download and print their official Udyam certificate for banking, tenders, subsidies, and other government schemes. By entering your Udyam Number and completing OTP verification, the PDF certificate becomes instantly available for printing. The portal..." },
      { property: "og:title", content: "MSME Print Udyam Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "MSME Print Udyam Certificate allows registered businesses to download and print their official Udyam certificate for banking, tenders, subsidies, and other government schemes. By entering your Udyam Number and completing OTP verification, the PDF certificate becomes instantly available for printing. The portal..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-print-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Print Udyam Certificate" linkTitle="MSME Print Udyam Certificate" html={html} />,
});
