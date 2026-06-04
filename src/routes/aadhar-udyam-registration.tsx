import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-registration.html?raw";

export const Route = createFileRoute("/aadhar-udyam-registration")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Registration - Access MSME Certificate" },
      { name: "description", content: "Aadhar Udyam registration is the process of linking your Aadhaar number with your MSME registration on the Udyam portal. This process ensures secure, fast, and paperless registration. Once completed, the business receives a digitally signed MSME certificate, confirming its official status as a micro, small, or..." },
      { property: "og:title", content: "Aadhar Udyam Registration - Access MSME Certificate" },
      { property: "og:description", content: "Aadhar Udyam registration is the process of linking your Aadhaar number with your MSME registration on the Udyam portal. This process ensures secure, fast, and paperless registration. Once completed, the business receives a digitally signed MSME certificate, confirming its official status as a micro, small, or..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam registration" linkTitle="Aadhar Udyam Registration - Access MSME Certificate" html={html} />,
});
