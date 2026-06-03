import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-online-registration.html?raw";

export const Route = createFileRoute("/udyam-online-registration")({
    head: () => ({
    meta: [
      { title: "Udyam Online Registration - Quick MSME Registration Process" },
      { name: "description", content: "Expert consultancy assistance for udyam online registration - quick msme registration process. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Online Registration - Quick MSME Registration Process" },
      { property: "og:description", content: "Expert consultancy assistance for udyam online registration - quick msme registration process. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-online-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Online Registration" linkTitle="Udyam Online Registration - Quick MSME Registration Process" html={html} />,
});
