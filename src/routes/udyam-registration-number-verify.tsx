import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-number-verify.html?raw";

export const Route = createFileRoute("/udyam-registration-number-verify")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Number Verify | MSME Certificate Validation" },
      { name: "description", content: "Udyam Registration Number Verify enables businesses to validate their official MSME registration certificate using their unique Udyam Number. The..." },
      { property: "og:title", content: "Udyam Registration Number Verify | MSME Certificate Validation" },
      { property: "og:description", content: "Udyam Registration Number Verify enables businesses to validate their official MSME registration certificate using their unique Udyam Number. The..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-registration-number-verify" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Number Verify" linkTitle="Udyam Registration Number Verify | MSME Certificate Validation" content={`Udyam Registration Number Verify enables businesses to validate their official MSME registration certificate using their unique Udyam Number. The verification process confirms authenticity, ensuring the certificate is recognized for bank loans, tenders, subsidies, and government schemes. By using Aadhaar or PAN-based OTP verification, the process is secure, fast, and completely online. This feature helps entrepreneurs avoid fraudulent use of Udyam certificates and ensures compliance with MSME regulations. Step-by-step instructions provide clear guidance for accurate verification. Maintaining verified registration details strengthens credibility with banks, suppliers, and government authorities, supporting smooth business operations for micro, small, and medium enterprises.`} html={html} />,
});
