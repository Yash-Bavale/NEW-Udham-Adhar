import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-update.html?raw";

export const Route = createFileRoute("/udyam-certificate-update")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Update - Modify Your MSME Registration Details" },
      { name: "description", content: "Udyam certificate update allows MSMEs to modify their business details on the official Udyam portal to ensure that the MSME certificate reflects accurate information. Changes can include business address, nature of activity, ownership details, or contact information. Updating the certificate is essential to..." },
      { property: "og:title", content: "Udyam Certificate Update - Modify Your MSME Registration Details" },
      { property: "og:description", content: "Udyam certificate update allows MSMEs to modify their business details on the official Udyam portal to ensure that the MSME certificate reflects accurate information. Changes can include business address, nature of activity, ownership details, or contact information. Updating the certificate is essential to..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Update" linkTitle="Udyam Certificate Update - Modify Your MSME Registration Details" html={html} />,
});
