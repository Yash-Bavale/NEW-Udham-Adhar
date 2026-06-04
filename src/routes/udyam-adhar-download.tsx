import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-adhar-download.html?raw";

export const Route = createFileRoute("/udyam-adhar-download")({
  head: () => ({
    meta: [
      { title: "Udyam Adhar Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Adhar Download enables entrepreneurs to access their official MSME Udyam certificate instantly using their registration number. After completing OTP verification, the certificate is available in PDF format for printing and official use. This document is essential for applying for bank loans, government..." },
      { property: "og:title", content: "Udyam Adhar Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Adhar Download enables entrepreneurs to access their official MSME Udyam certificate instantly using their registration number. After completing OTP verification, the certificate is available in PDF format for printing and official use. This document is essential for applying for bank loans, government..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-adhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Adhar Download" linkTitle="Udyam Adhar Download" html={html} />,
});
