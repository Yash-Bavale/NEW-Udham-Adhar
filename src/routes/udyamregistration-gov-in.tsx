import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyamregistration-gov-in.html?raw";

export const Route = createFileRoute("/udyamregistration-gov-in")({
    head: () => ({
    meta: [
      { title: "Udyamregistration Gov In - Official MSME Registration Po..." },
      { name: "description", content: "Expert consultancy assistance for udyamregistration gov in - official msme registration po.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyamregistration Gov In - Official MSME Registration Po..." },
      { property: "og:description", content: "Expert consultancy assistance for udyamregistration gov in - official msme registration po.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyamregistration-gov-in" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyamregistration GOV IN" html={html} />,
});
