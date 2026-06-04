import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-update.html?raw";

export const Route = createFileRoute("/update-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Update - How to Update Your MSME Details Online" },
      { name: "description", content: "Udyam update allows registered MSMEs to modify and maintain accurate business information such as address, category, nature of activity, or contact..." },
      { property: "og:title", content: "Udyam Update - How to Update Your MSME Details Online" },
      { property: "og:description", content: "Udyam update allows registered MSMEs to modify and maintain accurate business information such as address, category, nature of activity, or contact..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/update-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam update" linkTitle="Udyam Update - How to Update Your MSME Details Online" content={`Udyam update allows registered MSMEs to modify and maintain accurate business information such as address, category, nature of activity, or contact details through the official Udyam portal. Keeping registration details current is crucial for uninterrupted access to government schemes, subsidies, loans, priority lending, and participation in procurement tenders. The update process is free, paperless, and secure, enabling businesses to reflect changes promptly and maintain compliance with regulatory requirements. Udyam update ensures that the unique Udyam Registration Number and digitally signed MSME certificate remain valid and reliable for verification by banks, clients, and government authorities. Regular updates also support eligibility for new schemes, grants, and financial assistance programs while enhancing credibility and trust in the marketplace. By using the Udyam update facility, businesses can focus on growth, expansion, and operational efficiency while leveraging all available government benefits designed to strengthen the MSME ecosystem in India..`} html={html} />,
});
