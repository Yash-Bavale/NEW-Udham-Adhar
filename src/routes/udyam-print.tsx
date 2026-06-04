import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print.html?raw";

export const Route = createFileRoute("/udyam-print")({
  head: () => ({
    meta: [
      { title: "Udyam Print — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udhayam Aadhar Download allows entrepreneurs to securely download their MSME Udyam certificate in PDF format from the official Udyam portal. By verifying your Aadhaar-linked mobile number, you can instantly access the certificate for official purposes such as banking, government tenders, and subsidy applications...." },
      { property: "og:title", content: "Udyam Print — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udhayam Aadhar Download allows entrepreneurs to securely download their MSME Udyam certificate in PDF format from the official Udyam portal. By verifying your Aadhaar-linked mobile number, you can instantly access the certificate for official purposes such as banking, government tenders, and subsidy applications...." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print" linkTitle="Udyam Print" html={html} />,
});
