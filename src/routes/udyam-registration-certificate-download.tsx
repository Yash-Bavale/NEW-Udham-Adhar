import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-registration-certificate-download")({
    head: () => ({
    meta: [
      { title: "Certificate Download - Official MSME Proo" },
      { name: "description", content: "Expert consultancy assistance for certificate download - official msme proo. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Certificate Download - Official MSME Proo" },
      { property: "og:description", content: "Expert consultancy assistance for certificate download - official msme proo. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Certificate Download - Official MSME Proof" html={html} />,
});
