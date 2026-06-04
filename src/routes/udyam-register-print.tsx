import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-register-print.html?raw";

export const Route = createFileRoute("/udyam-register-print")({
  head: () => ({
    meta: [
      { title: "Udyam Register Print — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Register Print allows businesses to access their Udyam registration details and print the official MSME certificate directly from the government portal. After OTP verification, the certificate is available in PDF format for printing and official use. The document is essential for bank loans, government..." },
      { property: "og:title", content: "Udyam Register Print — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Register Print allows businesses to access their Udyam registration details and print the official MSME certificate directly from the government portal. After OTP verification, the certificate is available in PDF format for printing and official use. The document is essential for bank loans, government..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-register-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Register Print" linkTitle="Udyam Register Print" html={html} />,
});
