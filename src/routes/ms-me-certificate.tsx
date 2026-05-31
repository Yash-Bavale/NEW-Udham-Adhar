import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/ms-me-certificate.html?raw";

export const Route = createFileRoute("/ms-me-certificate")({
    head: () => ({
    meta: [
      { title: "MSME Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for msme certificate online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for msme certificate online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/ms-me-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Online | Get Business Help Services Certificate" html={html} />,
});
