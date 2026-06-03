import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-update.html?raw";

export const Route = createFileRoute("/udyog-aadhar-update")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhar Update - How to Update Your MSME Details" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhar update - how to update your msme details. Get help with Udyam/MSME registration, updates and certificates acro..." },
      { property: "og:title", content: "Udyog Aadhar Update - How to Update Your MSME Details" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhar update - how to update your msme details. Get help with Udyam/MSME registration, updates and certificates acro..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Update" linkTitle="Udyog Aadhar Update - How to Update Your MSME Details" html={html} />,
});
