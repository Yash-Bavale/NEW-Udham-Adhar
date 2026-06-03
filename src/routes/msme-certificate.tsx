import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate.html?raw";

export const Route = createFileRoute("/msme-certificate")({
    head: () => ({
    meta: [
      { title: "MSME Certificate - Benefits and Online Registration" },
      { name: "description", content: "Expert consultancy assistance for msme certificate - benefits and online registration. Get help with Udyam/MSME registration, updates and certificates across..." },
      { property: "og:title", content: "MSME Certificate - Benefits and Online Registration" },
      { property: "og:description", content: "Expert consultancy assistance for msme certificate - benefits and online registration. Get help with Udyam/MSME registration, updates and certificates across..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate" linkTitle="MSME Certificate - Benefits and Online Registration" html={html} />,
});
