import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-update-online.html?raw";

export const Route = createFileRoute("/udyam-update-online")({
  head: () => ({
    meta: [
      { title: "Udyam Update Online - Update MSME Registration Details" },
      { name: "description", content: "Udyam update online enables registered MSMEs to modify or correct their business information on the official portal. This includes changes in business..." },
      { property: "og:title", content: "Udyam Update Online - Update MSME Registration Details" },
      { property: "og:description", content: "Udyam update online enables registered MSMEs to modify or correct their business information on the official portal. This includes changes in business..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-update-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam update online" linkTitle="Udyam Update Online - Update MSME Registration Details" content={`Udyam update online enables registered MSMEs to modify or correct their business information on the official portal. This includes changes in business address, activities, ownership, or contact details. Keeping registration details accurate ensures uninterrupted access to government schemes, financial benefits, and participation in procurement opportunities. The update process is free, paperless, and secure, allowing businesses to maintain compliance with regulatory requirements. By updating details online, entrepreneurs enhance credibility with banks, financial institutions, and government authorities. Udyam update online also ensures that the digitally signed MSME certificate reflects correct and current information, providing legal proof of business status. Regular updates help businesses continue availing loans, subsidies, priority sector support, and all benefits offered by the government under the MSME scheme.`} html={html} />,
});
