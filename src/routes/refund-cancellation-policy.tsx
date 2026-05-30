import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/refund-cancellation-policy.html?raw";

export const Route = createFileRoute("/refund-cancellation-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy — Udyam Registration Consultancy" },
      { name: "description", content: "Refund and cancellation policy for Udyam Registration consultancy services." },
      { property: "og:title", content: "Refund & Cancellation Policy" },
      { property: "og:description", content: "When and how refunds may be issued for consultancy fees." },
    ],
  }),
  component: () => <WpPage title="Refund & Cancellation Policy" html={html} />,
});
