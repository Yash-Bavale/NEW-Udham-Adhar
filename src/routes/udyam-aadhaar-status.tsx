import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-status.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-status")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Status | Track Your MSME Registration Online" },
      { name: "description", content: "Udyam Aadhaar Status allows entrepreneurs to track the current status of their MSME registration online. By entering your Udyam Registration Number, PAN,..." },
      { property: "og:title", content: "Udyam Aadhaar Status | Track Your MSME Registration Online" },
      { property: "og:description", content: "Udyam Aadhaar Status allows entrepreneurs to track the current status of their MSME registration online. By entering your Udyam Registration Number, PAN,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-status" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Status" linkTitle="Udyam Aadhaar Status | Track Your MSME Registration Online" content={`Udyam Aadhaar Status allows entrepreneurs to track the current status of their MSME registration online. By entering your Udyam Registration Number, PAN, or Aadhaar details, you can quickly see whether your certificate is active, pending, or requires updates. The portal provides a secure and paperless platform for monitoring business compliance. Maintaining a valid Udyam Aadhaar ensures access to government subsidies, bank loans, tenders, and other MSME benefits. Step-by-step guidance helps users navigate the status-checking process with ease. Regularly checking your Udyam Aadhaar Status ensures your enterprise remains compliant and eligible for official support programs, offering peace of mind and uninterrupted business operations.`} html={html} />,
});
