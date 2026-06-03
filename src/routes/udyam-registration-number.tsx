import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-number.html?raw";

export const Route = createFileRoute("/udyam-registration-number")({
    head: () => ({
    meta: [
      { title: "Number - Unique MSME Identification Code" },
      { name: "description", content: "Expert consultancy assistance for number - unique msme identification code. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Number - Unique MSME Identification Code" },
      { property: "og:description", content: "Expert consultancy assistance for number - unique msme identification code. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-number" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Number" linkTitle="Udyam Registration Number - Unique MSME Identification Code" html={html} />,
});
