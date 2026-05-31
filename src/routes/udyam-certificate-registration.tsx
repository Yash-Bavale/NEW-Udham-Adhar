import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-registration.html?raw";

export const Route = createFileRoute("/udyam-certificate-registration")({
    head: () => ({
    meta: [
      { title: "Udyam Certificate Registration - How to Register and Get..." },
      { name: "description", content: "Expert consultancy assistance for udyam certificate registration - how to register and get.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Certificate Registration - How to Register and Get..." },
      { property: "og:description", content: "Expert consultancy assistance for udyam certificate registration - how to register and get.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Registration - How to Register and Get MSM" html={html} />,
});
