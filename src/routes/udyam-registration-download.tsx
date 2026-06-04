import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-download.html?raw";

export const Route = createFileRoute("/udyam-registration-download")({
  head: () => ({
    meta: [
      { title: "Udyam registration download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam registration download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam registration download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam registration download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam registration download" linkTitle="Udyam registration download" html={html} />,
});
