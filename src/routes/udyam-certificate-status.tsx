import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-status.html?raw";

export const Route = createFileRoute("/udyam-certificate-status")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Status — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Certificate Status allows entrepreneurs to quickly verify the current status of their MSME registration online. By entering your Udyam Number, PAN, or Aadhaar-linked details, you can check if your certificate is active, pending, or requires updates. Ensuring an up-to-date certificate is crucial for..." },
      { property: "og:title", content: "Udyam Certificate Status — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Certificate Status allows entrepreneurs to quickly verify the current status of their MSME registration online. By entering your Udyam Number, PAN, or Aadhaar-linked details, you can check if your certificate is active, pending, or requires updates. Ensuring an up-to-date certificate is crucial for..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-status" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Status" linkTitle="Udyam Certificate Status" html={html} />,
});
