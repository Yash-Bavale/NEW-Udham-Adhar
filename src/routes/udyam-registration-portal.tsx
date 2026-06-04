import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-portal.html?raw";

export const Route = createFileRoute("/udyam-registration-portal")({
  head: () => ({
    meta: [
      { title: "Udyam registration portal — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam registration portal. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam registration portal — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam registration portal. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-portal" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam registration portal" linkTitle="Udyam registration portal" html={html} />,
});
