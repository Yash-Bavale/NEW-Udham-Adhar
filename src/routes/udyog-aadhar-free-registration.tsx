import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-free-registration.html?raw";

export const Route = createFileRoute("/udyog-aadhar-free-registration")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhar Free Registration - Old MSME Registration P..." },
      { name: "description", content: "Expert consultancy assistance for udyog aadhar free registration - old msme registration p.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyog Aadhar Free Registration - Old MSME Registration P..." },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhar free registration - old msme registration p.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-free-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Free Registration" linkTitle="Udyog Aadhar Free Registration - Old MSME Registration Process" html={html} />,
});
