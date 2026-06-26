import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/about-us.html?raw";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Business Help Services Consultancy" },
      { name: "description", content: "About Business Help Services — a private consultancy assisting MSMEs with Business Help Services." },
      { property: "og:title", content: "About Us — Business Help Services Consultancy" },
      { property: "og:description", content: "Learn about Business Help Services and our Business Help Services consultancy assistance." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/about" },
    ],
  }),
  component: () => <WpPage title="About Us" html={html} />,
});
