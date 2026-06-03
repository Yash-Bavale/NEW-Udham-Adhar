import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-apply.html?raw";

export const Route = createFileRoute("/udyam-apply")({
    head: () => ({
    meta: [
      { title: "Udyam Apply - Registration Online" },
      { name: "description", content: "Expert consultancy assistance for udyam apply - registration online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Apply - Registration Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam apply - registration online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-apply" },
    ],
  }),
  component: () => <SeoLandingPage title=": Udyam Apply – Registration Online" html={html} />,
});
