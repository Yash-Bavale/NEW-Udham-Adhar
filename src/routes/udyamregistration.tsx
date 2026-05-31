import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyamregistration.html?raw";

export const Route = createFileRoute("/udyamregistration")({
    head: () => ({
    meta: [
      { title: "Udyamregistration - Official MSME Registration Portal India" },
      { name: "description", content: "Expert consultancy assistance for udyamregistration - official msme registration portal india. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyamregistration - Official MSME Registration Portal India" },
      { property: "og:description", content: "Expert consultancy assistance for udyamregistration - official msme registration portal india. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyamregistration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyamregistration - Official MSME Registration Portal India" html={html} />,
});
