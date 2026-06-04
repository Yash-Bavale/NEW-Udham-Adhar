import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-number.html?raw";

export const Route = createFileRoute("/udyam-number")({
  head: () => ({
    meta: [
      { title: "Udyam Number - Unique MSME Registration ID" },
      { name: "description", content: "The Udyam number is a unique registration ID assigned to businesses upon successful MSME registration through the official Udyam portal. This number acts as permanent proof of the enterprise’s Micro, Small, or Medium status and is essential for accessing government benefits, including priority sector lending,..." },
      { property: "og:title", content: "Udyam Number - Unique MSME Registration ID" },
      { property: "og:description", content: "The Udyam number is a unique registration ID assigned to businesses upon successful MSME registration through the official Udyam portal. This number acts as permanent proof of the enterprise’s Micro, Small, or Medium status and is essential for accessing government benefits, including priority sector lending,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-number" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Number" linkTitle="Udyam Number - Unique MSME Registration ID" html={html} />,
});
