import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/about-us.html?raw";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Udyam Registration Consultancy" },
      { name: "description", content: "About Business Help Services — a private consultancy assisting MSMEs with Udyam Registration." },
      { property: "og:title", content: "About Us — Udyam Registration Consultancy" },
      { property: "og:description", content: "Learn about Business Help Services and our Udyam Registration consultancy assistance." },
    ],
  }),
  component: () => <WpPage title="About Us" html={html} />,
});
