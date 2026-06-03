import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-apply.html?raw";

export const Route = createFileRoute("/udyam-certificate-apply")({
    head: () => ({
    meta: [
      { title: "Udyam Certificate Apply - How to Apply for MSME Certificate" },
      { name: "description", content: "Expert consultancy assistance for udyam certificate apply - how to apply for msme certificate. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Certificate Apply - How to Apply for MSME Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for udyam certificate apply - how to apply for msme certificate. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-apply" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Apply" linkTitle="Udyam Certificate Apply - How to Apply for MSME Certificate" html={html} />,
});
