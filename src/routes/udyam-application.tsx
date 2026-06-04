import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-application.html?raw";

export const Route = createFileRoute("/udyam-application")({
  head: () => ({
    meta: [
      { title: "Udyam Application — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Application. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Application — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Application. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-application" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Application" linkTitle="Udyam Application" html={html} />,
});
