import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-msme-udyam-certificate.html?raw";

export const Route = createFileRoute("/print-msme-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Print MSME Udyam Certificate | Online Printing Guide" },
      { name: "description", content: "Print your MSME Udyam certificate after downloading the official PDF through the Udyam portal. The certificate is essential for government schemes,..." },
      { property: "og:title", content: "Print MSME Udyam Certificate | Online Printing Guide" },
      { property: "og:description", content: "Print your MSME Udyam certificate after downloading the official PDF through the Udyam portal. The certificate is essential for government schemes,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-msme-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Print MSME Udyam Certificate" linkTitle="Print MSME Udyam Certificate | Online Printing Guide" content={`Print your MSME Udyam certificate after downloading the official PDF through the Udyam portal. The certificate is essential for government schemes, subsidies, and tenders. Follow our simple step-by-step guide for a smooth printing experience. OTP verification ensures safe access to your certificate. Keep a printed copy for business operations and compliance. The process is quick and user-friendly. Print your MSME Udyam certificate anytime you need it.`} html={html} />,
});
