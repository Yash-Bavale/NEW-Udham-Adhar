import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-register-print.html?raw";

export const Route = createFileRoute("/udyam-register-print")({
    head: () => ({
    meta: [
      { title: "Udyam Register Print | MSME Certificate Online Printing" },
      { name: "description", content: "Expert consultancy assistance for udyam register print | msme certificate online printing. Get help with Udyam/MSME registration, updates and certificates ac..." },
      { property: "og:title", content: "Udyam Register Print | MSME Certificate Online Printing" },
      { property: "og:description", content: "Expert consultancy assistance for udyam register print | msme certificate online printing. Get help with Udyam/MSME registration, updates and certificates ac..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-register-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Register Print" linkTitle="Udyam Register Print | MSME Certificate Online Printing" html={html} />,
});
