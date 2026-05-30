import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/compliance-statement.html?raw";

export const Route = createFileRoute("/compliance-statement")({
  head: () => ({
    meta: [
      { title: "Compliance Statement — Udyam Registration Consultancy" },
      { name: "description", content: "Compliance statement for Business Help Services regarding Udyam Registration consultancy." },
      { property: "og:title", content: "Compliance Statement" },
      { property: "og:description", content: "Read our compliance commitments and obligations." },
    ],
  }),
  component: () => <WpPage title="Compliance Statement" html={html} />,
});
