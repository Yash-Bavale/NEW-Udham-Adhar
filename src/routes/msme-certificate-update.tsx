import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-update.html?raw";

export const Route = createFileRoute("/msme-certificate-update")({
  head: () => ({
    meta: [
      { title: "MSME Certificate Update - How to Update Your MSME Registration" },
      { name: "description", content: "MSME certificate update enables businesses to maintain accurate and up-to-date information on their MSME registration. This includes updates to business activities, addresses, ownership, or contact details. Keeping your certificate information current is critical for continued eligibility for government schemes,..." },
      { property: "og:title", content: "MSME Certificate Update - How to Update Your MSME Registration" },
      { property: "og:description", content: "MSME certificate update enables businesses to maintain accurate and up-to-date information on their MSME registration. This includes updates to business activities, addresses, ownership, or contact details. Keeping your certificate information current is critical for continued eligibility for government schemes,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate-update" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Update" linkTitle="MSME Certificate Update - How to Update Your MSME Registration" html={html} />,
});
