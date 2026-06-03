import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/www-udyamregistration-gov-in.html?raw";

export const Route = createFileRoute("/www-udyamregistration-gov-in")({
    head: () => ({
    meta: [
      { title: "www.udyamregistration.gov.in - Official MSME Registratio..." },
      { name: "description", content: "Expert consultancy assistance for www.udyamregistration.gov.in - official msme registratio.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "www.udyamregistration.gov.in - Official MSME Registratio..." },
      { property: "og:description", content: "Expert consultancy assistance for www.udyamregistration.gov.in - official msme registratio.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/www-udyamregistration-gov-in" },
    ],
  }),
  component: () => <SeoLandingPage title="Www Udyamregistration GOV IN" linkTitle="www.udyamregistration.gov.in - Official MSME Registration Website" html={html} />,
});
