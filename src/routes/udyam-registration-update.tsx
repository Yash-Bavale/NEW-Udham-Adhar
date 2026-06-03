import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-update.html?raw";

export const Route = createFileRoute("/udyam-registration-update")({
    head: () => ({
    meta: [
      { title: "Update | Modify MSME Certificate Details" },
      { name: "description", content: "Expert consultancy assistance for update | modify msme certificate details. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Update | Modify MSME Certificate Details" },
      { property: "og:description", content: "Expert consultancy assistance for update | modify msme certificate details. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Update" html={html} />,
});
