import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-new-registration.html?raw";

export const Route = createFileRoute("/udyam-new-registration")({
  head: () => ({
    meta: [
      { title: "Udyam new registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam new registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam new registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam new registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-new-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam new registration" linkTitle="Udyam new registration" html={html} />,
});
