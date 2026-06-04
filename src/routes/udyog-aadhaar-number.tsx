import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-number.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-number")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Number - MSME Identifier Before Udyam Portal" },
      { name: "description", content: "The Udyog Aadhaar number was the unique identifier provided to businesses under the older MSME registration system before the introduction of the Udyam portal. This number served as proof of Micro, Small, or Medium Enterprise status and allowed businesses to access government schemes, loans, subsidies, priority..." },
      { property: "og:title", content: "Udyog Aadhaar Number - MSME Identifier Before Udyam Portal" },
      { property: "og:description", content: "The Udyog Aadhaar number was the unique identifier provided to businesses under the older MSME registration system before the introduction of the Udyam portal. This number served as proof of Micro, Small, or Medium Enterprise status and allowed businesses to access government schemes, loans, subsidies, priority..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-number" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar number" linkTitle="Udyog Aadhaar Number - MSME Identifier Before Udyam Portal" html={html} />,
});
