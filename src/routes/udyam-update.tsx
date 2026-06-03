import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-update.html?raw";

export const Route = createFileRoute("/udyam-update")({
    head: () => ({
    meta: [
      { title: "Update Udyam" },
      { name: "description", content: "Expert consultancy assistance for udyam update - how to update your msme details online. Get help with Udyam/MSME registration, updates and certificates acro..." },
      { property: "og:title", content: "Update Udyam" },
      { property: "og:description", content: "Expert consultancy assistance for udyam update - how to update your msme details online. Get help with Udyam/MSME registration, updates and certificates acro..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Update" linkTitle="Udyam Update - How to Update Your MSME Details Online" html={html} />,
});
