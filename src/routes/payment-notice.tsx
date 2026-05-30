import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/payment-notice.html?raw";

export const Route = createFileRoute("/payment-notice")({
  head: () => ({
    meta: [
      { title: "Payment Notice — Udyam Registration Consultancy" },
      { name: "description", content: "Payment Notice Important Payment &amp; Service Acknowledgment By proceeding with payment on this website, the User acknowledges, understands, and agrees th" },
      { property: "og:title", content: "Payment Notice" },
      { property: "og:description", content: "Payment Notice Important Payment &amp; Service Acknowledgment By proceeding with payment on this website, the User acknowledges, understands, and agrees th" },
    ],
  }),
  component: () => <WpPage title="Payment Notice" html={html} />,
});
