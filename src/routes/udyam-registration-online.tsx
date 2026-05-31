import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-online.html?raw";

export const Route = createFileRoute("/udyam-registration-online")({
    head: () => ({
    meta: [
      { title: "Online - Digital MSME Registration Proces" },
      { name: "description", content: "Expert consultancy assistance for online - digital msme registration proces. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Online - Digital MSME Registration Proces" },
      { property: "og:description", content: "Expert consultancy assistance for online - digital msme registration proces. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Business Help Services Online - Digital MSME Registration Proces" html={html} />,
});
