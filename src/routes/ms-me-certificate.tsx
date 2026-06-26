import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/ms-me-certificate.html?raw";

export const Route = createFileRoute("/ms-me-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Certificate Online | Get Udyam Registration Certificate" },
      { name: "description", content: "The MS ME Certificate is an official document issued under the Udyam Registration system, verifying the registration of micro, small, or medium..." },
      { property: "og:title", content: "MSME Certificate Online | Get Udyam Registration Certificate" },
      { property: "og:description", content: "The MS ME Certificate is an official document issued under the Udyam Registration system, verifying the registration of micro, small, or medium..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/ms-me-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MS ME Certificate" linkTitle="MSME Certificate Online | Get Udyam Registration Certificate" content={`The MS ME Certificate is an official document issued under the Udyam Registration system, verifying the registration of micro, small, or medium enterprises. Entrepreneurs can download the certificate online using their Udyam Number and OTP verification. This certificate is essential for availing government loans, subsidies, tenders, and other schemes. The online process is fast, secure, paperless, and convenient for businesses of all sizes. Maintaining a copy ensures compliance with MSME regulations, provides credibility with banks and government departments, and guarantees uninterrupted access to financial and operational benefits. The MS ME Certificate is central to formal recognition and growth of small enterprises across India.`} html={html} />,
});
