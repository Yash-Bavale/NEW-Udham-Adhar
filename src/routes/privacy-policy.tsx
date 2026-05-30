import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/privacy-policy.html?raw";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Udyam Registration Consultancy" },
      { name: "description", content: "How Business Help Services collects, uses, stores and protects your personal information." },
      { property: "og:title", content: "Privacy Policy" },
      { property: "og:description", content: "Privacy practices for Business Help Services." },
    ],
  }),
  component: () => <WpPage title="Privacy Policy" html={html} />,
});
