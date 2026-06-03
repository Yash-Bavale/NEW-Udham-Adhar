import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-to-udyam-migration.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-to-udyam-migration")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhaar to Udyam Migration" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhaar to udyam migration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhaar to Udyam Migration" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhaar to udyam migration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-to-udyam-migration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar to Udyam Migration | Update Old UAN to Udyam Certificate" html={html} />,
});
