import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/contact-us.html?raw";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Udyam Registration Consultancy" },
      { name: "description", content: "Contact Business Help Services for Udyam Registration consultancy assistance." },
      { property: "og:title", content: "Contact Us — Udyam Registration Consultancy" },
      { property: "og:description", content: "Reach out to Business Help Services for help with your Udyam Registration." },
    ],
  }),
  component: () => <WpPage title="Contact Us" html={html} />,
});
