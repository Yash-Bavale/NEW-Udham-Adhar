import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-update.html?raw";

export const Route = createFileRoute("/udyog-aadhar-update")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Update - How to Update Your MSME Details" },
      { name: "description", content: "Udyog Aadhar update allows existing MSMEs to modify and maintain accurate business information under the older Udyog Aadhaar system. Businesses can update details such as address, contact information, nature of activity, or ownership changes. Keeping Udyog Aadhaar information current is essential for continuing to..." },
      { property: "og:title", content: "Udyog Aadhar Update - How to Update Your MSME Details" },
      { property: "og:description", content: "Udyog Aadhar update allows existing MSMEs to modify and maintain accurate business information under the older Udyog Aadhaar system. Businesses can update details such as address, contact information, nature of activity, or ownership changes. Keeping Udyog Aadhaar information current is essential for continuing to..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar update" linkTitle="Udyog Aadhar Update - How to Update Your MSME Details" html={html} />,
});
