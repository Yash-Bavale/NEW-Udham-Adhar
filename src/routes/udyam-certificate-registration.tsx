import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-registration.html?raw";

export const Route = createFileRoute("/udyam-certificate-registration")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Registration - How to Register and Get MSME Certificate" },
      { name: "description", content: "Udyam certificate registration is the process of formally registering your business on the official Udyam portal to obtain an MSME certificate. This registration process is completely free, fast, and paperless, requiring only Aadhaar-based verification and basic business details. Once completed, businesses receive..." },
      { property: "og:title", content: "Udyam Certificate Registration - How to Register and Get MSME Certificate" },
      { property: "og:description", content: "Udyam certificate registration is the process of formally registering your business on the official Udyam portal to obtain an MSME certificate. This registration process is completely free, fast, and paperless, requiring only Aadhaar-based verification and basic business details. Once completed, businesses receive..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam certificate registration" linkTitle="Udyam Certificate Registration - How to Register and Get MSME Certificate" html={html} />,
});
