import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-update-online.html?raw";

export const Route = createFileRoute("/udyam-update-online")({
    head: () => ({
    meta: [
      { title: "Udyam Update Online - Update MSME Registration Details" },
      { name: "description", content: "Expert consultancy assistance for udyam update online - update msme registration details. Get help with Udyam/MSME registration, updates and certificates acr..." },
      { property: "og:title", content: "Udyam Update Online - Update MSME Registration Details" },
      { property: "og:description", content: "Expert consultancy assistance for udyam update online - update msme registration details. Get help with Udyam/MSME registration, updates and certificates acr..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-update-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Update Online" linkTitle="Udyam Update Online - Update MSME Registration Details" html={html} />,
});
