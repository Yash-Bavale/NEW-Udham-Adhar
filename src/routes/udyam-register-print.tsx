import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-register-print.html?raw";

export const Route = createFileRoute("/udyam-register-print")({
  head: () => ({
    meta: [
      { title: "Udyam Register Print — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Register Print. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Register Print — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Register Print. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-register-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Register Print" linkTitle="Udyam Register Print" html={html} />,
});
