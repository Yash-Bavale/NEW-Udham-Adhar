import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-edit.html?raw";

export const Route = createFileRoute("/udyam-edit")({
  head: () => ({
    meta: [
      { title: "Udyam Edit – Update or Modify Your MSME Registration Details" },
      { name: "description", content: "Edit your Udyam Registration details online quickly. Udyam Edit allows businesses to update or modify their MSME registration details online quickly and..." },
      { property: "og:title", content: "Udyam Edit – Update or Modify Your MSME Registration Details" },
      { property: "og:description", content: "Edit your Udyam Registration details online quickly. Udyam Edit allows businesses to update or modify their MSME registration details online quickly and..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-edit" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Edit" linkTitle="Udyam Edit – Update or Modify Your MSME Registration Details" content={`Edit your Udyam Registration details online quickly. Udyam Edit allows businesses to update or modify their MSME registration details online quickly and securely. Entrepreneurs can edit business name, address, activity type, Aadhaar information, NIC codes, or business category as needed. The process uses OTP verification for security, requires no documents for basic edits, and ensures that registration information remains accurate and up to date. Keeping registration details current is essential to maintain eligibility for government schemes, loans, subsidies, and participation in procurement tenders. Udyam Edit provides a seamless, paperless solution for startups, small businesses, and medium enterprises to comply with regulations, enhance credibility, and ensure uninterrupted access to financial and operational benefits.`} html={html} />,
});
