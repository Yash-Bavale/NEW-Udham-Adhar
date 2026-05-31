import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-form.html?raw";

export const Route = createFileRoute("/udyam-registration-form")({
    head: () => ({
    meta: [
      { title: "Fill application - Online MSME Registration Applicati" },
      { name: "description", content: "Expert consultancy assistance for fill application - online msme registration applicati. Get help with Udyam/MSME registration, updates and certificates acro..." },
      { property: "og:title", content: "Fill application - Online MSME Registration Applicati" },
      { property: "og:description", content: "Expert consultancy assistance for fill application - online msme registration applicati. Get help with Udyam/MSME registration, updates and certificates acro..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-form" },
    ],
  }),
  component: () => <SeoLandingPage title="Fill application - Online MSME Registration Applicati" html={html} />,
});
