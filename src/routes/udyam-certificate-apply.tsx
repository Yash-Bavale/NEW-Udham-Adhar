import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-apply.html?raw";

export const Route = createFileRoute("/udyam-certificate-apply")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Apply - How to Apply for MSME Certificate" },
      { name: "description", content: "Udyam certificate apply is the official process for obtaining your MSME certificate online through the Udyam portal. Businesses can submit basic details such as name, address, activity type, and Aadhaar information for verification. The application is completely free, paperless, and instant once processed. Upon..." },
      { property: "og:title", content: "Udyam Certificate Apply - How to Apply for MSME Certificate" },
      { property: "og:description", content: "Udyam certificate apply is the official process for obtaining your MSME certificate online through the Udyam portal. Businesses can submit basic details such as name, address, activity type, and Aadhaar information for verification. The application is completely free, paperless, and instant once processed. Upon..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-apply" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam certificate apply" linkTitle="Udyam Certificate Apply - How to Apply for MSME Certificate" html={html} />,
});
