import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-update-online.html?raw";

export const Route = createFileRoute("/udyam-update-online")({
  head: () => ({
    meta: [
      { title: "Udyam Update Online - Update MSME Registration Details" },
      { name: "description", content: "Udyam update online enables registered MSMEs to modify or correct their business information on the official portal. This includes changes in business address, activities, ownership, or contact details. Keeping registration details accurate ensures uninterrupted access to government schemes, financial benefits, and..." },
      { property: "og:title", content: "Udyam Update Online - Update MSME Registration Details" },
      { property: "og:description", content: "Udyam update online enables registered MSMEs to modify or correct their business information on the official portal. This includes changes in business address, activities, ownership, or contact details. Keeping registration details accurate ensures uninterrupted access to government schemes, financial benefits, and..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-update-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam update online" linkTitle="Udyam Update Online - Update MSME Registration Details" html={html} />,
});
