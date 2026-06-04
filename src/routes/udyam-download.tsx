import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-download.html?raw";

export const Route = createFileRoute("/udyam-download")({
  head: () => ({
    meta: [
      { title: "Udyam Download - Download MSME Registration Certificate" },
      { name: "description", content: "Udyam download allows entrepreneurs and business owners registered on the Udyam portal to access and retrieve their official MSME certificate instantly, providing a secure, convenient, and fully digital solution for verifying business status. After completing the online registration process, which requires basic..." },
      { property: "og:title", content: "Udyam Download - Download MSME Registration Certificate" },
      { property: "og:description", content: "Udyam download allows entrepreneurs and business owners registered on the Udyam portal to access and retrieve their official MSME certificate instantly, providing a secure, convenient, and fully digital solution for verifying business status. After completing the online registration process, which requires basic..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Download" linkTitle="Udyam Download - Download MSME Registration Certificate" html={html} />,
});
