import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar.html?raw";

export const Route = createFileRoute("/udyog-aadhar")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhar - Old MSME Registration Process Explained" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhar - old msme registration process explained. Get help with Udyam/MSME registration, updates and certificates acr..." },
      { property: "og:title", content: "Udyog Aadhar - Old MSME Registration Process Explained" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhar - old msme registration process explained. Get help with Udyam/MSME registration, updates and certificates acr..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar" linkTitle="Udyog Aadhar - Old MSME Registration Process Explained" html={html} />,
});
