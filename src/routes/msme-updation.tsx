import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-updation.html?raw";

export const Route = createFileRoute("/msme-updation")({
    head: () => ({
    meta: [
      { title: "MSME Updation - How to Update Your MSME Registration Det..." },
      { name: "description", content: "Expert consultancy assistance for msme updation - how to update your msme registration det.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "MSME Updation - How to Update Your MSME Registration Det..." },
      { property: "og:description", content: "Expert consultancy assistance for msme updation - how to update your msme registration det.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-updation" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Updation - How to Update Your MSME Registration Details" html={html} />,
});
