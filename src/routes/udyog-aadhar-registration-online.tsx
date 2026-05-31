import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-registration-online.html?raw";

export const Route = createFileRoute("/udyog-aadhar-registration-online")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhar Registration Online – Simple Process, Benefits" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhar registration online – simple process, benefits. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyog Aadhar Registration Online – Simple Process, Benefits" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhar registration online – simple process, benefits. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-registration-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Registration Online – Simple Process, Benefits " html={html} />,
});
