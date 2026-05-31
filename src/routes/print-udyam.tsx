import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-udyam.html?raw";

export const Route = createFileRoute("/print-udyam")({
    head: () => ({
    meta: [
      { title: "Print Udyam Certificate | MSME Certificate Print Online" },
      { name: "description", content: "Expert consultancy assistance for print udyam certificate | msme certificate print online. Get help with Udyam/MSME registration, updates and certificates ac..." },
      { property: "og:title", content: "Print Udyam Certificate | MSME Certificate Print Online" },
      { property: "og:description", content: "Expert consultancy assistance for print udyam certificate | msme certificate print online. Get help with Udyam/MSME registration, updates and certificates ac..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Print Udyam Certificate | MSME Certificate Print Online" html={html} />,
});
