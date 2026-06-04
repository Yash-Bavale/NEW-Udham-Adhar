import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam.html?raw";

export const Route = createFileRoute("/udyam")({
  head: () => ({
    meta: [
      { title: "Udyam - Government Portal for MSME Registration" },
      { name: "description", content: "Udyam is the official government portal dedicated to simplifying MSME registration for entrepreneurs across India, making the process more accessible, efficient, and transparent than ever before. This platform eliminates the complexities associated with earlier registration systems by offering a fully digital,..." },
      { property: "og:title", content: "Udyam - Government Portal for MSME Registration" },
      { property: "og:description", content: "Udyam is the official government portal dedicated to simplifying MSME registration for entrepreneurs across India, making the process more accessible, efficient, and transparent than ever before. This platform eliminates the complexities associated with earlier registration systems by offering a fully digital,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam" linkTitle="Udyam - Government Portal for MSME Registration" html={html} />,
});
