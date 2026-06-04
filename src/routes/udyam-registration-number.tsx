import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-number.html?raw";

export const Route = createFileRoute("/udyam-registration-number")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Number - Unique MSME Identification Code" },
      { name: "description", content: "The Udyam registration number is a unique identification code issued to each business after successful registration as an MSME on the official Udyam portal. This number acts as permanent proof of your business’s Micro, Small, or Medium Enterprise status and is essential for accessing government schemes, subsidies,..." },
      { property: "og:title", content: "Udyam Registration Number - Unique MSME Identification Code" },
      { property: "og:description", content: "The Udyam registration number is a unique identification code issued to each business after successful registration as an MSME on the official Udyam portal. This number acts as permanent proof of your business’s Micro, Small, or Medium Enterprise status and is essential for accessing government schemes, subsidies,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-number" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Number" linkTitle="Udyam Registration Number - Unique MSME Identification Code" html={html} />,
});
