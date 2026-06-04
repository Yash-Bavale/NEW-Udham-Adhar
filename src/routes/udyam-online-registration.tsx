import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-online-registration.html?raw";

export const Route = createFileRoute("/udyam-online-registration")({
  head: () => ({
    meta: [
      { title: "Udyam online registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam online registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam online registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam online registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-online-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam online registration" linkTitle="Udyam online registration" html={html} />,
});
