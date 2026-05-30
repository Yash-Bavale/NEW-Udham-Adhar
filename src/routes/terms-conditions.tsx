import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/terms-conditions.html?raw";

export const Route = createFileRoute("/terms-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Udyam Registration Consultancy" },
      { name: "description", content: "Terms and conditions governing the use of Udyam Registration consultancy services on this website." },
      { property: "og:title", content: "Terms & Conditions" },
      { property: "og:description", content: "Terms and conditions for Business Help Services." },
    ],
  }),
  component: () => <WpPage title="Terms & Conditions" html={html} />,
});
