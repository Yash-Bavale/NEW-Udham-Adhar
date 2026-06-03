import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-registration.html?raw";

export const Route = createFileRoute("/udyog-aadhar-registration")({
    head: () => ({
    meta: [
      { title: "\n" },
      { name: "description", content: "Expert consultancy assistance for \n. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "\n" },
      { property: "og:description", content: "Expert consultancy assistance for \n. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Registration" linkTitle="\\n" html={html} />,
});
