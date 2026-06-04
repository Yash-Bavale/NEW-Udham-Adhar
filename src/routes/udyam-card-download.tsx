import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-card-download.html?raw";

export const Route = createFileRoute("/udyam-card-download")({
  head: () => ({
    meta: [
      { title: "Udyam Card Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Card Download allows businesses to obtain their official MSME registration card online through the Udyam portal. The card contains the Udyam Registration Number, business details, and digital verification, serving as proof of micro, small, or medium enterprise status. Downloading the card is free, secure, and..." },
      { property: "og:title", content: "Udyam Card Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Card Download allows businesses to obtain their official MSME registration card online through the Udyam portal. The card contains the Udyam Registration Number, business details, and digital verification, serving as proof of micro, small, or medium enterprise status. Downloading the card is free, secure, and..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-card-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Card Download" linkTitle="Udyam Card Download" html={html} />,
});
