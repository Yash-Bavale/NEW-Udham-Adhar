import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-card-download.html?raw";

export const Route = createFileRoute("/udyam-card-download")({
  head: () => ({
    meta: [
      { title: "Udyam Card Download – Get Your MSME Certificate Online" },
      { name: "description", content: "Udyam Card Download allows businesses to obtain their official MSME registration card online through the Udyam portal. The card contains the Udyam..." },
      { property: "og:title", content: "Udyam Card Download – Get Your MSME Certificate Online" },
      { property: "og:description", content: "Udyam Card Download allows businesses to obtain their official MSME registration card online through the Udyam portal. The card contains the Udyam..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-card-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Card Download" linkTitle="Udyam Card Download – Get Your MSME Certificate Online" content={`Udyam Card Download allows businesses to obtain their official MSME registration card online through the Udyam portal. The card contains the Udyam Registration Number, business details, and digital verification, serving as proof of micro, small, or medium enterprise status. Downloading the card is free, secure, and instantly available in PDF format. Businesses can verify registration details before download, use OTP verification for security, and store the card for official use with banks, government authorities, or clients. The Udyam Card provides legal recognition, ensures uninterrupted access to government schemes, loans, subsidies, and procurement opportunities, and simplifies verification processes. It is a convenient, paperless tool to manage MSME certification and maintain compliance for startups and established enterprises.`} html={html} />,
});
