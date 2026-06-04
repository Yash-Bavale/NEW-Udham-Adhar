import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-update.html?raw";

export const Route = createFileRoute("/udyam-registration-update")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Update — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Registration Update. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Registration Update — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Registration Update. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Update" linkTitle="Udyam Registration Update" html={html} />,
});
