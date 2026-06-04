import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-download.html?raw";

export const Route = createFileRoute("/udyog-aadhar-download")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Download - Get Your Old MSME Certificate" },
      { name: "description", content: "Udyog Aadhar download allows business owners who registered under the older Udyog Aadhar system to retrieve their certificate for reference,..." },
      { property: "og:title", content: "Udyog Aadhar Download - Get Your Old MSME Certificate" },
      { property: "og:description", content: "Udyog Aadhar download allows business owners who registered under the older Udyog Aadhar system to retrieve their certificate for reference,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Download" linkTitle="Udyog Aadhar Download - Get Your Old MSME Certificate" content={`Udyog Aadhar download allows business owners who registered under the older Udyog Aadhar system to retrieve their certificate for reference, documentation, or migration to the new Udyam platform. This feature is especially important for businesses that previously obtained a Udyog Aadhar Number (UAN) and may still need access to their old certificate for banking, loan processing, subsidy claims, or verification purposes. Although Udyog Aadhar has been replaced by the more advanced Udyam registration system, the government continues to make download options available so that entrepreneurs can maintain continuity and easily transition their details into the modern portal. The downloadable certificate provides essential information about the business, its category, and identification number, which is often required for compliance or application submissions. Accessing the Udyog Aadhar document online ensures convenience, as entrepreneurs can retrieve and store their certificate digitally without visiting any offices or dealing with paperwork. The download process is simple, requiring basic details such as the UAN or Aadhaar-linked mobile number. While the government encourages all businesses to migrate to the Udyam portal for updated classification, lifetime validity, and improved benefits, the Udyog Aadhar download feature remains valuable for enterprises needing historical records. It ensures that no business loses access to older registration details, supporting a smooth transition to the upgraded system. The ability to download this certificate helps business owners stay organized, compliant, and ready to access the benefits and opportunities available under the new MSME regime.`} html={html} />,
});
