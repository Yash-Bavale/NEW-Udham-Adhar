import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-update.html?raw";

export const Route = createFileRoute("/udyam-update")({
  head: () => ({
    meta: [
      { title: "Udyam Update - How to Update Your MSME Details Online" },
      { name: "description", content: "Udyam update allows registered MSMEs to modify and maintain accurate business information such as address, category, nature of activity, or contact details through the official Udyam portal. Keeping registration details current is crucial for uninterrupted access to government schemes, subsidies, loans, priority..." },
      { property: "og:title", content: "Udyam Update - How to Update Your MSME Details Online" },
      { property: "og:description", content: "Udyam update allows registered MSMEs to modify and maintain accurate business information such as address, category, nature of activity, or contact details through the official Udyam portal. Keeping registration details current is crucial for uninterrupted access to government schemes, subsidies, loans, priority..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam update" linkTitle="Udyam Update - How to Update Your MSME Details Online" html={html} />,
});
