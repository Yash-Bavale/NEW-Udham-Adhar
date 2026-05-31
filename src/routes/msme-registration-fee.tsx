import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-fee.html?raw";

export const Route = createFileRoute("/msme-registration-fee")({
    head: () => ({
    meta: [
      { title: "MSME Registration Fee - Free Online MSME Registration Pr..." },
      { name: "description", content: "Expert consultancy assistance for msme registration fee - free online msme registration pr.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "MSME Registration Fee - Free Online MSME Registration Pr..." },
      { property: "og:description", content: "Expert consultancy assistance for msme registration fee - free online msme registration pr.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-fee" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Fee - Free Online MSME Registration Proces" html={html} />,
});
