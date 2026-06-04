import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-verify.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-verify")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Verify — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Aadhaar Verify allows businesses to confirm their MSME registration status through the official Udyam portal. By entering your Udyam Number or Aadhaar-linked details, you can instantly check if your certificate is valid and up to date. Verification ensures eligibility for government schemes, bank loans,..." },
      { property: "og:title", content: "Udyam Aadhaar Verify — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Aadhaar Verify allows businesses to confirm their MSME registration status through the official Udyam portal. By entering your Udyam Number or Aadhaar-linked details, you can instantly check if your certificate is valid and up to date. Verification ensures eligibility for government schemes, bank loans,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-verify" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Verify" linkTitle="Udyam Aadhaar Verify" html={html} />,
});
