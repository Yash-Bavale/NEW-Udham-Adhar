import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-portal.html?raw";

export const Route = createFileRoute("/udyam-portal")({
  head: () => ({
    meta: [
      { title: "Udyam Portal - Official MSME Registration Website" },
      { name: "description", content: "The Udyam portal is the Government of India’s official online platform dedicated to MSME registration, certificate downloads, and enterprise updates, offering a completely paperless and secure environment for business owners. This portal serves as the central hub for entrepreneurs seeking to register their..." },
      { property: "og:title", content: "Udyam Portal - Official MSME Registration Website" },
      { property: "og:description", content: "The Udyam portal is the Government of India’s official online platform dedicated to MSME registration, certificate downloads, and enterprise updates, offering a completely paperless and secure environment for business owners. This portal serves as the central hub for entrepreneurs seeking to register their..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-portal" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam portal" linkTitle="Udyam Portal - Official MSME Registration Website" html={html} />,
});
