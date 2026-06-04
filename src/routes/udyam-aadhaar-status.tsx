import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-status.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-status")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Status — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Aadhaar Status allows entrepreneurs to track the current status of their MSME registration online. By entering your Udyam Registration Number, PAN, or Aadhaar details, you can quickly see whether your certificate is active, pending, or requires updates. The portal provides a secure and paperless platform for..." },
      { property: "og:title", content: "Udyam Aadhaar Status — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Aadhaar Status allows entrepreneurs to track the current status of their MSME registration online. By entering your Udyam Registration Number, PAN, or Aadhaar details, you can quickly see whether your certificate is active, pending, or requires updates. The portal provides a secure and paperless platform for..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-status" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Status" linkTitle="Udyam Aadhaar Status" html={html} />,
});
