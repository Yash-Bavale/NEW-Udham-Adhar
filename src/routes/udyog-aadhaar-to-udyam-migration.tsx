import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-to-udyam-migration.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-to-udyam-migration")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar to Udyam Migration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyog Aadhaar to Udyam Migration is the process for transferring old MSME registration details to the new Udyam Registration system. This step is mandatory for micro, small, and medium enterprises to continue availing government benefits, subsidies, and loans. Businesses can verify their Aadhaar, enter their Udyog..." },
      { property: "og:title", content: "Udyog Aadhaar to Udyam Migration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyog Aadhaar to Udyam Migration is the process for transferring old MSME registration details to the new Udyam Registration system. This step is mandatory for micro, small, and medium enterprises to continue availing government benefits, subsidies, and loans. Businesses can verify their Aadhaar, enter their Udyog..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-to-udyam-migration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar to Udyam Migration" linkTitle="Udyog Aadhaar to Udyam Migration" html={html} />,
});
