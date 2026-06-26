import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-registration.html?raw";

export const Route = createFileRoute("/udyog-aadhar-registration")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Registration - MSME Registration Process (Old)" },
      { name: "description", content: "Udyog Aadhar registration was the earlier system introduced by the Government of India to simplify and streamline the process of enrolling micro, small,..." },
      { property: "og:title", content: "Udyog Aadhar Registration - MSME Registration Process (Old)" },
      { property: "og:description", content: "Udyog Aadhar registration was the earlier system introduced by the Government of India to simplify and streamline the process of enrolling micro, small,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyog-aadhar-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar registration" linkTitle="Udyog Aadhar Registration - MSME Registration Process (Old)" content={`Udyog Aadhar registration was the earlier system introduced by the Government of India to simplify and streamline the process of enrolling micro, small, and medium enterprises into the national MSME database. This earlier process allowed business owners to register online using their Aadhaar number and a few basic business details, resulting in the issuance of a Udyog Aadhar Number (UAN). This number served as proof of MSME status and enabled access to several benefits such as subsidies, loans, and government schemes. Although the Udyog Aadhar system helped millions of businesses formalize their operations, it has now been replaced by the more robust and technologically advanced Udyam registration portal. The shift to Udyam brings enhanced digital verification, automatic classification based on PAN and GST data, and improved accuracy in determining enterprise size. Despite being an older system, Udyog Aadhar certificates are still recognized, and many businesses may need to download their previous UAN documents for reference, banking, or migration purposes. Migrating from Udyog Aadhar to Udyam is encouraged by the government to ensure that all enterprises benefit from updated features, faster processing, and lifetime-valid certification. For businesses that previously registered under the old system, transitioning to Udyam ensures they remain eligible for government support, priority lending, credit guarantees, vendor protection, and tender participation. Udyog Aadhar registration played a vital role in India’s digital transition for small businesses, and it continues to be an important link in the evolution toward the fully digital Udyam platform. Although outdated, it represents a key step in the government’s effort to make MSME registration accessible, quick, and user-friendly before the advanced system we have today.`} html={html} />,
});
