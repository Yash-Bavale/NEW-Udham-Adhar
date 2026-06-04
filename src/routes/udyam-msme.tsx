import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme.html?raw";

export const Route = createFileRoute("/udyam-msme")({
  head: () => ({
    meta: [
      { title: "Udyam MSME Certificate" },
      { name: "description", content: "Udyam registration has become an essential step for small and medium enterprises looking to grow in a structured way. It provides official recognition to businesses and opens the door to a range of government benefits. Many entrepreneurs are now choosing this registration to improve their credibility in the market...." },
      { property: "og:title", content: "Udyam MSME Certificate" },
      { property: "og:description", content: "Udyam registration has become an essential step for small and medium enterprises looking to grow in a structured way. It provides official recognition to businesses and opens the door to a range of government benefits. Many entrepreneurs are now choosing this registration to improve their credibility in the market...." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-msme" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Certificate" linkTitle="Udyam MSME Certificate" html={html} />,
});
