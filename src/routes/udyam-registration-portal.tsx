import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-portal.html?raw";

export const Route = createFileRoute("/udyam-registration-portal")({
    head: () => ({
    meta: [
      { title: "Portal - Official MSME Registration Websi" },
      { name: "description", content: "Expert consultancy assistance for portal - official msme registration websi. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Portal - Official MSME Registration Websi" },
      { property: "og:description", content: "Expert consultancy assistance for portal - official msme registration websi. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-portal" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Portal" linkTitle="Udyam Registration Portal - Official MSME Registration Website" html={html} />,
});
