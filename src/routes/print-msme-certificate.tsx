import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-msme-certificate.html?raw";

export const Route = createFileRoute("/print-msme-certificate")({
  head: () => ({
    meta: [
      { title: "Print MSME Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Printing your MSME Certificate online is a crucial step for registered businesses to validate their micro, small, or medium enterprise status. Through the official Udyam portal, entrepreneurs can enter their registration number, verify via OTP, and download the certificate in PDF format. This certificate is..." },
      { property: "og:title", content: "Print MSME Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Printing your MSME Certificate online is a crucial step for registered businesses to validate their micro, small, or medium enterprise status. Through the official Udyam portal, entrepreneurs can enter their registration number, verify via OTP, and download the certificate in PDF format. This certificate is..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-msme-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Print MSME Certificate" linkTitle="Print MSME Certificate" html={html} />,
});
