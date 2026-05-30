import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/payment-notice-service-acknowledgment.html?raw";

export const Route = createFileRoute("/payment-notice-service-acknowledgment")({
  head: () => ({
    meta: [
      { title: "Payment Notice & Service Acknowledgment — Udyam Registration Consultancy" },
      { name: "description", content: "Payment notice and service acknowledgment for Business Help Services." },
      { property: "og:title", content: "Payment Notice & Service Acknowledgment" },
      { property: "og:description", content: "Payment notice and service acknowledgment details." },
    ],
  }),
  component: () => <WpPage title="Payment Notice & Service Acknowledgment" html={html} />,
});
