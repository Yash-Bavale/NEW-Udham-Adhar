import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyog-aadhar.html?raw";

export const Route = createFileRoute("/msme-udyog-aadhar")({
    head: () => ({
    meta: [
      { title: "MSME Udyog Aadhar - Old MSME Registration Identification" },
      { name: "description", content: "Expert consultancy assistance for msme udyog aadhar - old msme registration identification. Get help with Udyam/MSME registration, updates and certificates a..." },
      { property: "og:title", content: "MSME Udyog Aadhar - Old MSME Registration Identification" },
      { property: "og:description", content: "Expert consultancy assistance for msme udyog aadhar - old msme registration identification. Get help with Udyam/MSME registration, updates and certificates a..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-udyog-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyog Aadhar - Old MSME Registration Identification" html={html} />,
});
