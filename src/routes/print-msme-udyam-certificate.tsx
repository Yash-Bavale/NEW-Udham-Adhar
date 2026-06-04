import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-msme-udyam-certificate.html?raw";

export const Route = createFileRoute("/print-msme-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Print MSME Udyam Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Print your MSME Udyam certificate after downloading the official PDF through the Udyam portal. The certificate is essential for government schemes, subsidies, and tenders. Follow our simple step-by-step guide for a smooth printing experience. OTP verification ensures safe access to your certificate. Keep a printed..." },
      { property: "og:title", content: "Print MSME Udyam Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Print your MSME Udyam certificate after downloading the official PDF through the Udyam portal. The certificate is essential for government schemes, subsidies, and tenders. Follow our simple step-by-step guide for a smooth printing experience. OTP verification ensures safe access to your certificate. Keep a printed..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-msme-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Print MSME Udyam Certificate" linkTitle="Print MSME Udyam Certificate" html={html} />,
});
