import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-update.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-update")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhaar Update – Modify UAN Details Online" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhaar update – modify uan details online. Get help with Udyam/MSME registration, updates and certificates across In..." },
      { property: "og:title", content: "Udyog Aadhaar Update – Modify UAN Details Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhaar update – modify uan details online. Get help with Udyam/MSME registration, updates and certificates across In..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Update – Modify UAN Details Online" html={html} />,
});
