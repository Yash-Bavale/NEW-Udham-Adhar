import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-reprint.html?raw";

export const Route = createFileRoute("/udyam-certificate-reprint")({
    head: () => ({
    meta: [
      { title: "Udyam Certificate Reprint | Download MSME Certificate Again" },
      { name: "description", content: "Expert consultancy assistance for udyam certificate reprint | download msme certificate again. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Certificate Reprint | Download MSME Certificate Again" },
      { property: "og:description", content: "Expert consultancy assistance for udyam certificate reprint | download msme certificate again. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-reprint" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Reprint" linkTitle="Udyam Certificate Reprint | Download MSME Certificate Again" html={html} />,
});
