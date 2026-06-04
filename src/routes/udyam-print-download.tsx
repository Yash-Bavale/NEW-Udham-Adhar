import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print-download.html?raw";

export const Route = createFileRoute("/udyam-print-download")({
  head: () => ({
    meta: [
      { title: "Udyam Print Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Print Download enables businesses to download and print their MSME certificate within minutes from the official Udyam portal. By entering the Udyam Number and completing OTP verification, the certificate PDF becomes instantly available. This document is required for tenders, bank loans, subsidies, and other..." },
      { property: "og:title", content: "Udyam Print Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Print Download enables businesses to download and print their MSME certificate within minutes from the official Udyam portal. By entering the Udyam Number and completing OTP verification, the certificate PDF becomes instantly available. This document is required for tenders, bank loans, subsidies, and other..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print Download" linkTitle="Udyam Print Download" html={html} />,
});
