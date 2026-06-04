import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-number-verify.html?raw";

export const Route = createFileRoute("/udyam-registration-number-verify")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Number Verify — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Registration Number Verify enables businesses to validate their official MSME registration certificate using their unique Udyam Number. The verification process confirms authenticity, ensuring the certificate is recognized for bank loans, tenders, subsidies, and government schemes. By using Aadhaar or..." },
      { property: "og:title", content: "Udyam Registration Number Verify — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Registration Number Verify enables businesses to validate their official MSME registration certificate using their unique Udyam Number. The verification process confirms authenticity, ensuring the certificate is recognized for bank loans, tenders, subsidies, and government schemes. By using Aadhaar or..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-number-verify" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Number Verify" linkTitle="Udyam Registration Number Verify" html={html} />,
});
