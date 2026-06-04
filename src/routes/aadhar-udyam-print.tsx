import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-print.html?raw";

export const Route = createFileRoute("/aadhar-udyam-print")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Print — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Aadhar Udyam Print. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Aadhar Udyam Print — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Aadhar Udyam Print. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam Print" linkTitle="Aadhar Udyam Print" html={html} />,
});
