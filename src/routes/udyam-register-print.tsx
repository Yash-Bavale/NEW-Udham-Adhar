import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-register-print.html?raw";

export const Route = createFileRoute("/udyam-register-print")({
  head: () => ({
    meta: [
      { title: "Udyam Register Print | MSME Certificate Online Printing" },
      { name: "description", content: "Udyam Register Print allows businesses to access their Udyam registration details and print the official MSME certificate directly from the government..." },
      { property: "og:title", content: "Udyam Register Print | MSME Certificate Online Printing" },
      { property: "og:description", content: "Udyam Register Print allows businesses to access their Udyam registration details and print the official MSME certificate directly from the government..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-register-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Register Print" linkTitle="Udyam Register Print | MSME Certificate Online Printing" content={`Udyam Register Print allows businesses to access their Udyam registration details and print the official MSME certificate directly from the government portal. After OTP verification, the certificate is available in PDF format for printing and official use. The document is essential for bank loans, government tenders, and subsidy applications. The process is fast, secure, and user-friendly, ensuring entrepreneurs can maintain compliance with MSME regulations. Step-by-step guidance helps users retrieve, download, and print their certificates without errors. Keeping a printed certificate ensures uninterrupted access to MSME benefits and simplifies participation in government schemes, tenders, and financial programs.`} html={html} />,
});
