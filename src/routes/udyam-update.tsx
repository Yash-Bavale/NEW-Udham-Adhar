import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-update.html?raw";

export const Route = createFileRoute("/udyam-update")({
  head: () => ({
    meta: [
      { title: "Udyam update — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam update. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam update — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam update. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam update" linkTitle="Udyam update" html={html} />,
});
