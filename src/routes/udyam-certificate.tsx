import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate.html?raw";

export const Route = createFileRoute("/udyam-certificate")({
    head: () => ({
    meta: [
      { title: "Udyam Certificate - Download Official MSME Certificate O..." },
      { name: "description", content: "Expert consultancy assistance for udyam certificate - download official msme certificate o.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Certificate - Download Official MSME Certificate O..." },
      { property: "og:description", content: "Expert consultancy assistance for udyam certificate - download official msme certificate o.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate - Download Official MSME Certificate Onlin" html={html} />,
});
