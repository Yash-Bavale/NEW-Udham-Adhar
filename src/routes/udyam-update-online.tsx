import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-update-online.html?raw";

export const Route = createFileRoute("/udyam-update-online")({
  head: () => ({
    meta: [
      { title: "Udyam update online — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam update online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam update online — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam update online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-update-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam update online" linkTitle="Udyam update online" html={html} />,
});
