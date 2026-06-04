import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-form.html?raw";

export const Route = createFileRoute("/udyam-registration-form")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Form - Online MSME Registration Application" },
      { name: "description", content: "The Udyam registration form is the official online application required to register your business as an MSME on the Udyam portal. The form is designed to collect essential business information such as enterprise name, type of business activity, address, and Aadhaar details for identity verification. It is..." },
      { property: "og:title", content: "Udyam Registration Form - Online MSME Registration Application" },
      { property: "og:description", content: "The Udyam registration form is the official online application required to register your business as an MSME on the Udyam portal. The form is designed to collect essential business information such as enterprise name, type of business activity, address, and Aadhaar details for identity verification. It is..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-form" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Form" linkTitle="Udyam Registration Form - Online MSME Registration Application" html={html} />,
});
