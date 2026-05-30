import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/service-delivery-policy.html?raw";

export const Route = createFileRoute("/service-delivery-policy")({
  head: () => ({
    meta: [
      { title: "Service Delivery Policy — Udyam Registration Consultancy" },
      { name: "description", content: "Service delivery policy for Udyam Registration consultancy services." },
      { property: "og:title", content: "Service Delivery Policy" },
      { property: "og:description", content: "How we deliver our consultancy and assistance services." },
    ],
  }),
  component: () => <WpPage title="Service Delivery Policy" html={html} />,
});
